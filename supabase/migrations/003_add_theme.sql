-- ============================================================
-- Mi Parche — Agregar columna theme a user_profiles
-- Ejecutar en Supabase SQL Editor
-- ============================================================

ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'dark' CHECK (theme IN ('dark', 'light'));
