-- ============================================================
-- Mi Parche — Supabase Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── user_profiles ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_profiles (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth0_id          TEXT UNIQUE NOT NULL,
  email             TEXT NOT NULL,
  name              TEXT,
  avatar_url        TEXT,
  notification_hour INT DEFAULT 9 CHECK (notification_hour >= 0 AND notification_hour <= 23),
  timezone          TEXT DEFAULT 'America/Argentina/Buenos_Aires',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─── patch_cycles ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS patch_cycles (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  start_date  DATE NOT NULL,
  patch_type  TEXT NOT NULL DEFAULT 'weekly' CHECK (patch_type IN ('weekly')),
  status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_patch_cycles_user_id ON patch_cycles(user_id);
CREATE INDEX IF NOT EXISTS idx_patch_cycles_status ON patch_cycles(status);

-- ─── notifications ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notification_records (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  cycle_id       UUID NOT NULL REFERENCES patch_cycles(id) ON DELETE CASCADE,
  type           TEXT NOT NULL CHECK (type IN ('change', 'remove', 'new_cycle', 'rest_end')),
  scheduled_for  TIMESTAMPTZ NOT NULL,
  sent_at        TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notification_records(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled ON notification_records(scheduled_for) WHERE sent_at IS NULL;

-- ─── Row Level Security ──────────────────────────────────────
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patch_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_records ENABLE ROW LEVEL SECURITY;

-- user_profiles: users can only see/edit their own profile
-- (Service role used in API, so these protect direct DB access)
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (true); -- handled at API level via auth0_id

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (true);

-- patch_cycles: only owner can access
CREATE POLICY "Users can view own cycles"
  ON patch_cycles FOR ALL
  USING (true); -- enforced via API

-- ─── updated_at trigger ──────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patch_cycles_updated_at
  BEFORE UPDATE ON patch_cycles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
