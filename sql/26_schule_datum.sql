-- ═══════════════════════════════════════════════════════════
-- OKYU HRM – Step 26: Berufsschule auf konkrete Daten umstellen
-- Run in Supabase Dashboard → SQL Editor
-- ───────────────────────────────────────────────────────────
-- schule_schedule speicherte bisher nur wochentag (wöchentlich
-- wiederholend). Neu: Spalte `datum` für konkrete Schultage.
-- Bestehende Zeilen (datum IS NULL) bleiben als Wochen-Wiederholung
-- gültig (Abwärtskompatibilität).
-- ═══════════════════════════════════════════════════════════

ALTER TABLE schule_schedule
  ADD COLUMN IF NOT EXISTS datum DATE;

-- wochentag darf jetzt NULL sein (bei konkreten Daten optional);
-- der CHECK bleibt gültig, NULL ist erlaubt.
ALTER TABLE schule_schedule
  ALTER COLUMN wochentag DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_schule_datum ON schule_schedule(emp_id, datum);
