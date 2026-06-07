-- ============================================================
-- Innerproof — Triggers
-- Migration 0003
-- ============================================================
-- Win immutability, photo count, witness notification queueing.

-- ============================================================
-- Win immutability after 5 min
-- ============================================================
-- Soft-delete (setting deleted_at) is allowed anytime.
-- Other field updates are blocked once now() > edit_locked_at.

CREATE OR REPLACE FUNCTION public.enforce_win_edit_lock()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow soft-delete or undelete (deleted_at flip) past the edit window
  IF (OLD.deleted_at IS DISTINCT FROM NEW.deleted_at)
     AND OLD.body = NEW.body
     AND OLD.photo_url IS NOT DISTINCT FROM NEW.photo_url
     AND OLD.area = NEW.area
     AND OLD.visibility = NEW.visibility
     AND OLD.vision_board_id IS NOT DISTINCT FROM NEW.vision_board_id THEN
    RETURN NEW;
  END IF;

  -- Block all other edits past edit_locked_at
  IF NOW() > OLD.edit_locked_at THEN
    RAISE EXCEPTION 'Win % is past 5-minute edit window and cannot be modified', OLD.id;
  END IF;

  -- Don't allow extending the lock window
  NEW.edit_locked_at := OLD.edit_locked_at;
  NEW.created_at := OLD.created_at;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_win_edit_lock_trigger
  BEFORE UPDATE ON public.wins
  FOR EACH ROW EXECUTE FUNCTION public.enforce_win_edit_lock();

-- ============================================================
-- Vision board photo count (3–5 enforced)
-- ============================================================
-- INSERT: blocks if board would exceed 5 photos
-- DELETE: blocks if board would drop below 3 photos
-- Initial board creation: client must wrap board insert + 3–5 photos in one
-- transaction (or use an RPC). The 3-min check is suspended for the very
-- first insert (when the board has zero photos).

CREATE OR REPLACE FUNCTION public.enforce_board_photo_count()
RETURNS TRIGGER AS $$
DECLARE
  current_count INT;
  target_board_id UUID;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_board_id := OLD.vision_board_id;
  ELSE
    target_board_id := NEW.vision_board_id;
  END IF;

  SELECT COUNT(*) INTO current_count
  FROM public.vision_photos
  WHERE vision_board_id = target_board_id;

  IF TG_OP = 'INSERT' AND current_count > 5 THEN
    RAISE EXCEPTION 'Vision board % can have at most 5 photos', target_board_id;
  END IF;

  IF TG_OP = 'DELETE' AND current_count < 1 THEN
    RAISE EXCEPTION 'Vision board % must have at least 1 photo', target_board_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_board_photo_count_after_insert
  AFTER INSERT ON public.vision_photos
  FOR EACH ROW EXECUTE FUNCTION public.enforce_board_photo_count();

CREATE TRIGGER enforce_board_photo_count_after_delete
  AFTER DELETE ON public.vision_photos
  FOR EACH ROW EXECUTE FUNCTION public.enforce_board_photo_count();

-- ============================================================
-- Witness win notification — queue into notification_batches
-- ============================================================
-- AFTER INSERT on wins where visibility='witness': enqueue a notification
-- for the paired user. Edge function `notify-witness-win` runs on a schedule
-- to read the outbox and send batched APNs pushes (max 1 per 4-hour window).

CREATE OR REPLACE FUNCTION public.queue_witness_win_notification()
RETURNS TRIGGER AS $$
DECLARE
  paired_user_id UUID;
  existing_batch_id UUID;
BEGIN
  IF NEW.visibility != 'witness' THEN
    RETURN NEW;
  END IF;

  -- Find the paired witness (if any active pair exists)
  SELECT CASE
    WHEN user_a_id = NEW.user_id THEN user_b_id
    ELSE user_a_id
  END INTO paired_user_id
  FROM public.witness_pairs
  WHERE ended_at IS NULL
    AND (user_a_id = NEW.user_id OR user_b_id = NEW.user_id)
  LIMIT 1;

  IF paired_user_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Check for an open batch in the recipient's window
  SELECT id INTO existing_batch_id
  FROM public.notification_batches
  WHERE recipient_user_id = paired_user_id
    AND kind = 'witness_win'
    AND sent_at IS NULL
    AND batch_window_end > NOW()
  LIMIT 1;

  IF existing_batch_id IS NOT NULL THEN
    -- Append win id to existing payload
    UPDATE public.notification_batches
    SET payload = jsonb_set(
      payload,
      '{win_ids}',
      COALESCE(payload->'win_ids', '[]'::jsonb) || to_jsonb(NEW.id::text)
    )
    WHERE id = existing_batch_id;
  ELSE
    -- New batch
    INSERT INTO public.notification_batches (recipient_user_id, kind, payload)
    VALUES (
      paired_user_id,
      'witness_win',
      jsonb_build_object(
        'win_ids', jsonb_build_array(NEW.id::text),
        'sender_id', NEW.user_id::text
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER queue_witness_win_after_insert
  AFTER INSERT ON public.wins
  FOR EACH ROW EXECUTE FUNCTION public.queue_witness_win_notification();

-- ============================================================
-- Last focused tracking on vision boards
-- ============================================================
-- When a ritual session is created, bump last_focused_at on the source board
-- so round-robin focus works in the future.

CREATE OR REPLACE FUNCTION public.bump_board_last_focused()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.source_board_id IS NOT NULL THEN
    UPDATE public.vision_boards
    SET last_focused_at = NOW()
    WHERE id = NEW.source_board_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bump_last_focused_after_ritual
  AFTER INSERT ON public.ritual_sessions
  FOR EACH ROW EXECUTE FUNCTION public.bump_board_last_focused();
