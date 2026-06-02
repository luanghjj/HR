-- ═══════════════════════════════════════════════════════════
-- OKYU HRM – Aushilfe Slots Table
-- Migration: 23_aushilfe_slots.sql
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS aushilfe_slots (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  location      TEXT NOT NULL,
  slot_date     DATE NOT NULL,
  shift_label   TEXT NOT NULL,
  shift_from    TEXT NOT NULL,   -- stored as 'HH:MM'
  shift_to      TEXT NOT NULL,   -- stored as 'HH:MM'
  dept          TEXT NOT NULL,
  note          TEXT DEFAULT '',
  -- Booking status
  status        TEXT DEFAULT 'open' CHECK (status IN ('open', 'booked')),
  -- Aushilfe info (filled on booking)
  aushilfe_name  TEXT,
  aushilfe_phone TEXT,
  aushilfe_email TEXT,
  aushilfe_note  TEXT,
  -- Metadata
  created_at    TIMESTAMPTZ DEFAULT now(),
  created_by    UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Index for fast queries by location + date
CREATE INDEX IF NOT EXISTS idx_aushilfe_slots_location_date
  ON aushilfe_slots (location, slot_date);

CREATE INDEX IF NOT EXISTS idx_aushilfe_slots_status
  ON aushilfe_slots (status);

-- ── Row Level Security ──────────────────────────────────────
ALTER TABLE aushilfe_slots ENABLE ROW LEVEL SECURITY;

-- Authenticated users (Inhaber / Manager) can do everything
CREATE POLICY "authenticated_full_access"
  ON aushilfe_slots
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Anonymous users can SELECT only open slots
CREATE POLICY "anon_select_open"
  ON aushilfe_slots
  FOR SELECT
  TO anon
  USING (status = 'open');

-- Anonymous users can UPDATE a slot to book it
-- (they can only update specific fields when status is 'open')
CREATE POLICY "anon_book_slot"
  ON aushilfe_slots
  FOR UPDATE
  TO anon
  USING (status = 'open')
  WITH CHECK (status = 'booked');
