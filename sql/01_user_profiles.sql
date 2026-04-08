-- ═══════════════════════════════════════════════════════════
-- OKYU HRM – Supabase Setup SQL
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- ═══════════════════════════════════════════════════════════

-- 1. Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id            BIGSERIAL PRIMARY KEY,
  auth_user_id  UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id       TEXT NOT NULL UNIQUE,       -- e.g. 'inhaber', 'manager_origami'
  name          TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('inhaber', 'manager', 'mitarbeiter', 'azubi')),
  location      TEXT NOT NULL DEFAULT 'all',
  avatar        TEXT NOT NULL DEFAULT '??',
  emp_id        INTEGER,                    -- links to future employees table
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = auth_user_id);

-- Inhaber/Manager can read all profiles
CREATE POLICY "Admins can read all profiles"
  ON user_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE auth_user_id = auth.uid()
      AND role IN ('inhaber', 'manager')
    )
  );

-- Only inhaber can update profiles
CREATE POLICY "Inhaber can update profiles"
  ON user_profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE auth_user_id = auth.uid()
      AND role = 'inhaber'
    )
  );

-- ═══════════════════════════════════════════════════════════
-- DEMO USERS SETUP
-- After running this SQL, create these users in Supabase Auth
-- Dashboard → Authentication → Users → Create User
-- ═══════════════════════════════════════════════════════════

-- After creating auth users, insert profiles:
-- (Replace the UUIDs with actual auth user IDs from Supabase dashboard)

/*
-- Example: After creating users in Auth dashboard, run:

INSERT INTO user_profiles (auth_user_id, user_id, name, role, location, avatar, emp_id) VALUES
  ('UUID_FROM_AUTH', 'inhaber',         'Linh Nguyen',    'inhaber',      'all',     'LN', NULL),
  ('UUID_FROM_AUTH', 'manager_origami', 'Yuki Tanaka',    'manager',      'origami', 'YT', 2),
  ('UUID_FROM_AUTH', 'manager_enso',    'Marco Rossi',    'manager',      'enso',    'MR', 3),
  ('UUID_FROM_AUTH', 'emp_anna',        'Anna Schmidt',   'mitarbeiter',  'origami', 'AS', 4),
  ('UUID_FROM_AUTH', 'emp_kevin',       'Kevin Pham',     'mitarbeiter',  'enso',    'KP', 5),
  ('UUID_FROM_AUTH', 'emp_julia',       'Julia Braun',    'azubi',        'origami', 'JB', 6);
*/

-- ═══════════════════════════════════════════════════════════
-- QUICK SETUP HELPER
-- Creates auth users AND profiles in one go
-- ═══════════════════════════════════════════════════════════

-- Step 1: Create users via Supabase Dashboard → Authentication → Users
--   Email: inhaber@okyu.de     Password: OkyuAdmin2026!
--   Email: manager1@okyu.de    Password: OkyuManager2026!
--   Email: manager2@okyu.de    Password: OkyuManager2026!
--   Email: anna@okyu.de        Password: OkyuMitarbeiter2026!
--   Email: kevin@okyu.de       Password: OkyuMitarbeiter2026!
--   Email: julia@okyu.de       Password: OkyuAzubi2026!

-- Step 2: Get the UUIDs from the auth.users table
-- SELECT id, email FROM auth.users;

-- Step 3: Insert profiles with the correct UUIDs
-- (see INSERT example above)
