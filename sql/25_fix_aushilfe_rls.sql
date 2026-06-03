-- ═══════════════════════════════════════════════════════════
-- OKYU HRM – Fix Aushilfe RLS: anon SELECT policy conflict
-- Run in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════
--
-- Problem: After UPDATE slot 'open' → 'booked', Supabase tries
-- to return the updated row. The anon SELECT policy (status='open')
-- blocks this, causing "new row violates row-level security" on
-- some PostgreSQL/Supabase versions → error on mobile browsers.
--
-- Fix: Allow anon to SELECT all slots (status unrestricted).
-- Security: public aushilfe.html JS already filters to only
-- DISPLAY open slots. Booked slots have no sensitive admin data.
-- Weekly limit check by phone number also works correctly now.
-- ═══════════════════════════════════════════════════════════

-- Drop the old restrictive SELECT policy
DROP POLICY IF EXISTS "anon_select_open" ON aushilfe_slots;

-- New policy: anon can see all slots
-- (JS code handles filtering to only show 'open' on public page)
CREATE POLICY "anon_select_all"
  ON aushilfe_slots
  FOR SELECT
  TO anon
  USING (true);

-- Keep the UPDATE policy as-is (it's correct)
-- anon can only UPDATE rows where status='open' → 'booked'
-- (already exists as "anon_book_slot")
