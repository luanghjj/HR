-- ═══════════════════════════════════════════════════════════
-- timetrack HRM – Availability (Nicht verfügbar)
-- Migration: 28_availability.sql
-- In Supabase SQL Editor ausführen.
-- ═══════════════════════════════════════════════════════════
--
-- Mitarbeiter melden Tage, an denen sie NICHT verfügbar sind.
-- Manager/Inhaber sehen das beim Einplanen im Arbeitsplan.

CREATE TABLE IF NOT EXISTS availability (
  id          BIGSERIAL PRIMARY KEY,
  emp_id      INTEGER NOT NULL,
  emp_name    TEXT,
  location    TEXT,
  date        DATE NOT NULL,
  reason      TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Ein Mitarbeiter pro Tag nur einmal "nicht verfügbar"
CREATE UNIQUE INDEX IF NOT EXISTS idx_availability_emp_date
  ON availability (emp_id, date);

ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

-- Eingeloggte Nutzer dürfen lesen/schreiben (Detail-Kontrolle "nur eigene"
-- erfolgt in der App, analog zu den übrigen Tabellen).
CREATE POLICY "availability_authenticated_full"
  ON availability
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
