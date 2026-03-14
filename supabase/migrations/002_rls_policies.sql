-- ============================================================
-- Mi Parche — RLS policies con Auth0 JWT
-- Ejecutar DESPUÉS de 001_initial_schema.sql
-- ============================================================

-- Supabase necesita saber cómo leer el JWT de Auth0.
-- En el dashboard de Supabase: Settings → API → JWT Settings
-- Agregar el "JWKS URI" de Auth0:
--   https://YOUR_AUTH0_DOMAIN/.well-known/jwks.json

-- Helper: extrae el auth0 sub del JWT actual
-- Usamos public schema porque Supabase no permite crear funciones en auth schema
CREATE OR REPLACE FUNCTION public.auth0_uid() RETURNS TEXT AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->>'sub',
    (current_setting('request.jwt.claims', true)::json->>'https://miparche.app/sub')
  )
$$ LANGUAGE sql STABLE;

-- ─── Eliminar policies permisivas anteriores ─────────────────
DROP POLICY IF EXISTS "Users can view own profile"   ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own cycles"    ON patch_cycles;

-- ─── user_profiles ───────────────────────────────────────────
CREATE POLICY "select_own_profile"
  ON user_profiles FOR SELECT
  USING (auth0_id = public.auth0_uid());

CREATE POLICY "insert_own_profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth0_id = public.auth0_uid());

CREATE POLICY "update_own_profile"
  ON user_profiles FOR UPDATE
  USING (auth0_id = public.auth0_uid())
  WITH CHECK (auth0_id = public.auth0_uid());

-- ─── patch_cycles ────────────────────────────────────────────
CREATE POLICY "select_own_cycles"
  ON patch_cycles FOR SELECT
  USING (
    user_id = (
      SELECT id FROM user_profiles WHERE auth0_id = public.auth0_uid()
    )
  );

CREATE POLICY "insert_own_cycles"
  ON patch_cycles FOR INSERT
  WITH CHECK (
    user_id = (
      SELECT id FROM user_profiles WHERE auth0_id = public.auth0_uid()
    )
  );

CREATE POLICY "update_own_cycles"
  ON patch_cycles FOR UPDATE
  USING (
    user_id = (
      SELECT id FROM user_profiles WHERE auth0_id = public.auth0_uid()
    )
  );

CREATE POLICY "delete_own_cycles"
  ON patch_cycles FOR DELETE
  USING (
    user_id = (
      SELECT id FROM user_profiles WHERE auth0_id = public.auth0_uid()
    )
  );

-- ─── notification_records ────────────────────────────────────
CREATE POLICY "select_own_notifications"
  ON notification_records FOR SELECT
  USING (
    user_id = (
      SELECT id FROM user_profiles WHERE auth0_id = public.auth0_uid()
    )
  );

CREATE POLICY "insert_own_notifications"
  ON notification_records FOR INSERT
  WITH CHECK (
    user_id = (
      SELECT id FROM user_profiles WHERE auth0_id = public.auth0_uid()
    )
  );

-- ─── NOTA IMPORTANTE ─────────────────────────────────────────
-- Las API routes usan el Service Role Key (createAdminClient)
-- que bypasea RLS — esto está bien para operaciones del servidor.
-- Las policies de arriba protegen contra acceso DIRECTO a la DB
-- (ej: alguien que robe la anon key).