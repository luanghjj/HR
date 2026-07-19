-- ═══════════════════════════════════════════════════════════
-- timetrack HRM – Schichtvorschläge (Minijob schlägt Tage/Schichten vor)
-- Migration: 36_shift_proposals.sql
-- In Supabase SQL Editor ausführen. Ändert KEINE bestehenden Daten.
-- ═══════════════════════════════════════════════════════════
--
-- Minijob-Mitarbeiter können (z. B. sonntags per Erinnerung) Tage markieren,
-- an denen sie arbeiten könnten, und eine Wunschsicht wählen. Der Status ist
-- zunächst 'pending'. Inhaber/Manager sehen die Liste, genehmigen oder lehnen
-- ab. Bei Genehmigung legt die App daraus eine echte Schicht im shifts-Plan an.

CREATE TABLE IF NOT EXISTS shift_proposals (
  id          SERIAL PRIMARY KEY,
  emp_id      INTEGER REFERENCES employees(id),
  emp_name    TEXT NOT NULL,
  location    TEXT,                 -- Standort des MA (kann Komma-separiert sein)
  dept        TEXT,                 -- Bereich des MA (wird beim Genehmigen zur Schicht)
  prop_date   DATE NOT NULL,        -- Tag, an dem der MA anbietet zu arbeiten
  shift_label TEXT NOT NULL,        -- z. B. "Mittagsschicht"
  shift_from  TEXT NOT NULL,        -- 'HH:MM'
  shift_to    TEXT NOT NULL,        -- 'HH:MM'
  status      TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  note        TEXT DEFAULT '',      -- optional: Bemerkung des MA
  decided_by  TEXT,                 -- user_id des Entscheiders
  decided_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_shift_proposals_status ON shift_proposals(status);
CREATE INDEX IF NOT EXISTS idx_shift_proposals_emp ON shift_proposals(emp_id);

ALTER TABLE shift_proposals ENABLE ROW LEVEL SECURITY;

-- Wie übrige Tabellen: eingeloggte Nutzer voll; inhaltliche Kontrolle
-- (wer darf genehmigen) erfolgt in der App über can('editSchedules').
CREATE POLICY "shift_proposals_authenticated_full"
  ON shift_proposals FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
