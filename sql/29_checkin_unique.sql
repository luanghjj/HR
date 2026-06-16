-- ═══════════════════════════════════════════════════════════
-- timetrack HRM – Doppelte Check-ins verhindern
-- Migration: 29_checkin_unique.sql
-- In Supabase SQL Editor ausführen.
-- ═══════════════════════════════════════════════════════════
--
-- Partial Unique Index: pro Mitarbeiter darf nur EIN offener Check-in
-- (check_out IS NULL) existieren. Verhindert Doppel-Check-ins durch
-- schnelles Doppeltippen / Netzwerk-Lag (Race Condition).
-- Gültige Check-ins an verschiedenen Tagen bleiben erlaubt, weil der alte
-- jeweils ausgecheckt (check_out gesetzt) ist.

CREATE UNIQUE INDEX IF NOT EXISTS uniq_open_checkin
  ON time_records (emp_id)
  WHERE check_out IS NULL;
