-- ============================================================
-- Innerproof — Row Level Security policies
-- Migration 0002
-- ============================================================
-- Server-enforced authorization. Never trust the client.

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vision_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vision_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.witness_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.witness_pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ritual_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_library_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_batches ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- profiles — self only
-- ============================================================

CREATE POLICY "profiles_self_select" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() AND deleted_at IS NULL);

CREATE POLICY "profiles_self_insert" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_self_update" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- No DELETE policy — soft delete only via deleted_at update.

-- ============================================================
-- vision_boards — self only
-- ============================================================

CREATE POLICY "boards_self_select" ON public.vision_boards
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "boards_self_insert" ON public.vision_boards
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "boards_self_update" ON public.vision_boards
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "boards_self_delete" ON public.vision_boards
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- vision_photos — via board ownership
-- ============================================================

CREATE POLICY "photos_via_board_select" ON public.vision_photos
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.vision_boards
    WHERE id = vision_photos.vision_board_id AND user_id = auth.uid()
  ));

CREATE POLICY "photos_via_board_insert" ON public.vision_photos
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.vision_boards
    WHERE id = vision_photos.vision_board_id AND user_id = auth.uid()
  ));

CREATE POLICY "photos_via_board_update" ON public.vision_photos
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.vision_boards
    WHERE id = vision_photos.vision_board_id AND user_id = auth.uid()
  ));

CREATE POLICY "photos_via_board_delete" ON public.vision_photos
  FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.vision_boards
    WHERE id = vision_photos.vision_board_id AND user_id = auth.uid()
  ));

-- ============================================================
-- wins — self always; paired witness for visibility=witness
-- ============================================================

CREATE POLICY "wins_self_select" ON public.wins
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() AND deleted_at IS NULL);

CREATE POLICY "wins_witness_select" ON public.wins
  FOR SELECT TO authenticated
  USING (
    visibility = 'witness'
    AND deleted_at IS NULL
    AND EXISTS (
      SELECT 1 FROM public.witness_pairs
      WHERE ended_at IS NULL
        AND (
          (user_a_id = auth.uid() AND user_b_id = wins.user_id)
          OR (user_b_id = auth.uid() AND user_a_id = wins.user_id)
        )
    )
  );

CREATE POLICY "wins_self_insert" ON public.wins
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 5-minute edit window enforced via trigger in 0003
CREATE POLICY "wins_self_update" ON public.wins
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "wins_self_delete" ON public.wins
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- witness_invites — inviter only (acceptance via edge function/service role)
-- ============================================================

CREATE POLICY "invites_inviter_select" ON public.witness_invites
  FOR SELECT TO authenticated
  USING (inviter_user_id = auth.uid());

CREATE POLICY "invites_inviter_insert" ON public.witness_invites
  FOR INSERT TO authenticated
  WITH CHECK (inviter_user_id = auth.uid());

-- No public UPDATE/DELETE — acceptance happens via pair-witness edge function (service role)

-- ============================================================
-- witness_pairs — both members can read; INSERT via service role
-- ============================================================

CREATE POLICY "pairs_members_select" ON public.witness_pairs
  FOR SELECT TO authenticated
  USING (user_a_id = auth.uid() OR user_b_id = auth.uid());

-- Either member can end the pair (set ended_at)
CREATE POLICY "pairs_members_end" ON public.witness_pairs
  FOR UPDATE TO authenticated
  USING (
    (user_a_id = auth.uid() OR user_b_id = auth.uid())
    AND ended_at IS NULL
  )
  WITH CHECK (
    (user_a_id = auth.uid() OR user_b_id = auth.uid())
    AND ended_at IS NOT NULL
  );

-- No INSERT/DELETE for clients — service role only.

-- ============================================================
-- ritual_sessions — self only
-- ============================================================

CREATE POLICY "rituals_self_select" ON public.ritual_sessions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "rituals_self_insert" ON public.ritual_sessions
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "rituals_self_update" ON public.ritual_sessions
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================
-- photo_library_assets — read-only for authenticated; admin writes
-- ============================================================

CREATE POLICY "library_authenticated_select" ON public.photo_library_assets
  FOR SELECT TO authenticated
  USING (active = TRUE);

-- INSERT/UPDATE/DELETE: service role only (admin curation)

-- ============================================================
-- notification_batches — recipient can read; service role writes
-- ============================================================

CREATE POLICY "batches_recipient_select" ON public.notification_batches
  FOR SELECT TO authenticated
  USING (recipient_user_id = auth.uid());

-- INSERT via DB triggers / service role; never client.
