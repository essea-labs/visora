-- ============================================================
-- Innerproof — Initial schema
-- Migration 0001
-- ============================================================
-- Tables in dependency order. RLS in 0002, triggers in 0003.

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- Enums
-- ============================================================

CREATE TYPE area_kind AS ENUM ('career', 'health', 'love', 'finance', 'joy', 'custom');
CREATE TYPE win_visibility AS ENUM ('private', 'witness');
CREATE TYPE photo_source AS ENUM ('library', 'upload');
CREATE TYPE user_tier AS ENUM ('trial', 'paid', 'expired');

-- ============================================================
-- profiles — 1:1 with auth.users
-- ============================================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name TEXT,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  morning_time TIME NOT NULL DEFAULT '07:00:00',
  voice_preference TEXT NOT NULL DEFAULT 'sage',
  palette_preference TEXT NOT NULL DEFAULT 'A',
  tier user_tier NOT NULL DEFAULT 'trial',
  tier_expires_at TIMESTAMPTZ,
  device_tokens TEXT[] NOT NULL DEFAULT '{}',  -- APNs tokens for push
  deleted_at TIMESTAMPTZ,

  CONSTRAINT profile_morning_time_range CHECK (
    morning_time >= '05:00:00' AND morning_time <= '10:00:00'
  )
);

CREATE INDEX idx_profiles_tier ON public.profiles(tier);
CREATE INDEX idx_profiles_morning ON public.profiles(morning_time) WHERE deleted_at IS NULL;

-- Auto-create profile when auth.users row is inserted
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- photo_library_assets — curated stock library
-- ============================================================

CREATE TABLE public.photo_library_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  area area_kind NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  attribution TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_library_area_active ON public.photo_library_assets(area) WHERE active;

-- ============================================================
-- vision_boards
-- ============================================================

CREATE TABLE public.vision_boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  area area_kind NOT NULL,
  custom_label TEXT,
  name TEXT NOT NULL,
  identity_statement TEXT NOT NULL,
  season INT NOT NULL DEFAULT 1,
  last_focused_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  archived_at TIMESTAMPTZ,

  CONSTRAINT board_name_length CHECK (length(name) BETWEEN 2 AND 80),
  CONSTRAINT board_identity_length CHECK (length(identity_statement) <= 400),
  CONSTRAINT board_custom_label_required CHECK (
    (area != 'custom') OR (custom_label IS NOT NULL AND length(custom_label) > 0)
  )
);

CREATE INDEX idx_boards_user_active ON public.vision_boards(user_id) WHERE archived_at IS NULL;
CREATE INDEX idx_boards_user_area_season ON public.vision_boards(user_id, area, season);
CREATE INDEX idx_boards_last_focused ON public.vision_boards(user_id, last_focused_at) WHERE archived_at IS NULL;

-- ============================================================
-- vision_photos — 1 to 5 per board (count enforced by trigger in 0003)
-- ============================================================

CREATE TABLE public.vision_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vision_board_id UUID NOT NULL REFERENCES public.vision_boards(id) ON DELETE CASCADE,
  position INT NOT NULL,
  source photo_source NOT NULL,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  blurhash TEXT,
  library_asset_id UUID REFERENCES public.photo_library_assets(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT photo_position_range CHECK (position BETWEEN 0 AND 4),
  CONSTRAINT photo_library_consistency CHECK (
    (source = 'library' AND library_asset_id IS NOT NULL)
    OR (source = 'upload' AND library_asset_id IS NULL)
  ),
  CONSTRAINT photo_unique_position_per_board UNIQUE (vision_board_id, position)
);

CREATE INDEX idx_photos_board_position ON public.vision_photos(vision_board_id, position);

-- ============================================================
-- wins — chronological, immutable after 5 min (enforced by trigger)
-- ============================================================

CREATE TABLE public.wins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vision_board_id UUID REFERENCES public.vision_boards(id) ON DELETE SET NULL,
  area area_kind NOT NULL,
  body TEXT NOT NULL,
  photo_url TEXT,
  visibility win_visibility NOT NULL DEFAULT 'private',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  edit_locked_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '5 minutes',
  deleted_at TIMESTAMPTZ,

  CONSTRAINT win_body_length CHECK (length(body) BETWEEN 4 AND 500)
);

CREATE INDEX idx_wins_user_created ON public.wins(user_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_wins_user_area ON public.wins(user_id, area) WHERE deleted_at IS NULL;
CREATE INDEX idx_wins_board ON public.wins(vision_board_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_wins_witness_visible ON public.wins(user_id, created_at DESC)
  WHERE visibility = 'witness' AND deleted_at IS NULL;

-- ============================================================
-- witness_invites — invite tokens, accepted via edge function
-- ============================================================

CREATE TABLE public.witness_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inviter_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '7 days',
  accepted_at TIMESTAMPTZ,
  accepted_by_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

CREATE INDEX idx_invites_token_pending ON public.witness_invites(token) WHERE accepted_at IS NULL;
CREATE INDEX idx_invites_inviter ON public.witness_invites(inviter_user_id);

-- ============================================================
-- witness_pairs — symmetric, 0 or 1 active per user
-- ============================================================

CREATE TABLE public.witness_pairs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_a_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_b_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  paired_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,

  CONSTRAINT pair_distinct_users CHECK (user_a_id != user_b_id),
  CONSTRAINT pair_ordered CHECK (user_a_id < user_b_id)  -- canonical ordering
);

-- Each user is in at most one active pair
CREATE UNIQUE INDEX idx_pairs_user_a_active ON public.witness_pairs(user_a_id) WHERE ended_at IS NULL;
CREATE UNIQUE INDEX idx_pairs_user_b_active ON public.witness_pairs(user_b_id) WHERE ended_at IS NULL;

-- ============================================================
-- ritual_sessions — one row per completed/skipped ritual
-- ============================================================

CREATE TABLE public.ritual_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  scheduled_for DATE NOT NULL,
  completed_at TIMESTAMPTZ,
  skipped BOOLEAN NOT NULL DEFAULT FALSE,
  intention_text TEXT,
  source_board_id UUID REFERENCES public.vision_boards(id) ON DELETE SET NULL,
  source_identity_snapshot TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT ritual_one_per_user_per_day UNIQUE (user_id, scheduled_for),
  CONSTRAINT ritual_intention_length CHECK (intention_text IS NULL OR length(intention_text) <= 500)
);

CREATE INDEX idx_rituals_user_date ON public.ritual_sessions(user_id, scheduled_for DESC);
CREATE INDEX idx_rituals_completed ON public.ritual_sessions(user_id, completed_at DESC)
  WHERE completed_at IS NOT NULL;

-- ============================================================
-- notification_batches — outbox for batched pushes
-- ============================================================

CREATE TABLE public.notification_batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,  -- 'witness_win' | 're_engagement' | 'milestone'
  batch_window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  batch_window_end TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '4 hours',
  payload JSONB NOT NULL DEFAULT '{}',
  sent_at TIMESTAMPTZ
);

CREATE INDEX idx_notif_pending ON public.notification_batches(recipient_user_id, kind)
  WHERE sent_at IS NULL;
CREATE INDEX idx_notif_batch_window ON public.notification_batches(batch_window_end)
  WHERE sent_at IS NULL;

-- ============================================================
-- Storage buckets (created via Supabase dashboard / API)
-- ============================================================
-- user-photos       — private, RLS-secured by user_id path prefix
-- library-photos    — public read, service role write
-- (no ritual-audio bucket — audio is bundled in app binary)
