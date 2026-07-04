-- ═══════════════════════════════════════════════════════════
-- timetrack HRM – Pause pro EINZELNER Schicht (überschreibt MA-Default)
-- Migration: 35_shift_pause.sql
-- In Supabase SQL Editor ausführen. Ändert KEINE bestehenden Daten.
-- ═══════════════════════════════════════════════════════════
-- NULL = Standard-Pause des Mitarbeiters verwenden.
-- Zahl (z.B. 60, 90) = Pause nur für diese Schicht (z.B. durchgehende Schicht).

ALTER TABLE shifts ADD COLUMN IF NOT EXISTS pause_minutes INTEGER;
