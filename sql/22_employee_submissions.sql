-- ═══════════════════════════════════════════════════════════
-- Employee Submissions – Standalone table for info collection
-- Run in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════

CREATE TABLE employee_submissions (
  id BIGSERIAL PRIMARY KEY,
  familienname TEXT NOT NULL,
  vorname TEXT NOT NULL,
  steuer_id TEXT NOT NULL UNIQUE,
  steuerklasse TEXT NOT NULL,
  krankenversicherung TEXT NOT NULL,
  sv_nummer TEXT NOT NULL,
  iban TEXT NOT NULL,
  geburtstag DATE NOT NULL,
  geburtsort TEXT DEFAULT '',
  nationalitaet TEXT NOT NULL,
  telefon TEXT NOT NULL,
  adresse TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'neu'
);

ALTER TABLE employee_submissions ENABLE ROW LEVEL SECURITY;

-- Anon: nur INSERT (Mitarbeiter füllt Formular aus)
CREATE POLICY "anon_insert" ON employee_submissions
  FOR INSERT TO anon WITH CHECK (true);

-- Anon: SELECT nur für Duplikat-Check (steuer_id)
CREATE POLICY "anon_check_duplicate" ON employee_submissions
  FOR SELECT TO anon USING (true);

-- Authenticated (Admin): Vollzugriff
CREATE POLICY "auth_full" ON employee_submissions
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
