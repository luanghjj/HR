-- ═══════════════════════════════════════════════════════════
-- OKYU HRM – Step 5: Azubi Tables
-- Run in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════

-- ─── SCHOOL SCHEDULE (Berufsschultage) ───
CREATE TABLE IF NOT EXISTS schule_schedule (
  id        SERIAL PRIMARY KEY,
  emp_id    INTEGER REFERENCES employees(id),
  wochentag TEXT NOT NULL CHECK (wochentag IN ('Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag')),
  schule    TEXT NOT NULL DEFAULT 'Berufsschule',
  klasse    TEXT DEFAULT '',
  von       TIME DEFAULT '08:00',
  bis       TIME DEFAULT '15:00',
  aktiv     BOOLEAN DEFAULT true
);

-- ─── TRAINING LOGS (Ausbildungsnachweise) ───
CREATE TABLE IF NOT EXISTS ausbildungsnachweise (
  id                 SERIAL PRIMARY KEY,
  emp_id             INTEGER REFERENCES employees(id),
  emp_name           TEXT NOT NULL,
  woche_start        DATE NOT NULL,
  woche_end          DATE NOT NULL,
  betrieb_taetigkeiten TEXT DEFAULT '',   -- What they did at work
  schule_themen      TEXT DEFAULT '',      -- What they learned at school
  betrieb_stunden    NUMERIC(4,1) DEFAULT 0,
  schule_stunden     NUMERIC(4,1) DEFAULT 0,
  notizen            TEXT DEFAULT '',
  status             TEXT DEFAULT 'entwurf' CHECK (status IN ('entwurf', 'eingereicht', 'genehmigt', 'abgelehnt')),
  ausbilder_kommentar TEXT DEFAULT '',
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

-- ─── EVALUATIONS (Bewertungen) ───
CREATE TABLE IF NOT EXISTS azubi_bewertungen (
  id           SERIAL PRIMARY KEY,
  emp_id       INTEGER REFERENCES employees(id),
  emp_name     TEXT NOT NULL,
  datum        DATE NOT NULL DEFAULT CURRENT_DATE,
  bewerter     TEXT NOT NULL,              -- Who evaluated
  kategorie    TEXT NOT NULL,              -- Category
  note         INTEGER CHECK (note >= 1 AND note <= 6), -- German grade 1-6
  kommentar    TEXT DEFAULT '',
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── RLS ───
ALTER TABLE schule_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE ausbildungsnachweise ENABLE ROW LEVEL SECURITY;
ALTER TABLE azubi_bewertungen ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth_read" ON schule_schedule FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read" ON ausbildungsnachweise FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read" ON azubi_bewertungen FOR SELECT TO authenticated USING (true);

CREATE POLICY "auth_write" ON schule_schedule FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_write" ON ausbildungsnachweise FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_write" ON azubi_bewertungen FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "service_all" ON schule_schedule FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_all" ON ausbildungsnachweise FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_all" ON azubi_bewertungen FOR ALL USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════
-- DEMO DATA
-- ═══════════════════════════════════════════════════════════

-- School schedule for Julia Braun (emp_id=12, Azubi Koch, Origami)
INSERT INTO schule_schedule (emp_id, wochentag, schule, klasse, von, bis) VALUES
  (12, 'Montag',    'Fritz-Erler-Schule Pforzheim', 'NK3a', '08:00', '15:00'),
  (12, 'Dienstag',  'Fritz-Erler-Schule Pforzheim', 'NK3a', '08:00', '13:00')
ON CONFLICT DO NOTHING;

-- School schedule for Nina Richter (emp_id=16, Azubi Service, Enso)
INSERT INTO schule_schedule (emp_id, wochentag, schule, klasse, von, bis) VALUES
  (16, 'Mittwoch',  'Louis-Leitz-Schule Stuttgart', 'RS2b', '08:00', '15:30'),
  (16, 'Donnerstag','Louis-Leitz-Schule Stuttgart', 'RS2b', '08:00', '13:00')
ON CONFLICT DO NOTHING;

-- Training logs for Julia Braun (last 4 weeks)
INSERT INTO ausbildungsnachweise (emp_id, emp_name, woche_start, woche_end, betrieb_taetigkeiten, schule_themen, betrieb_stunden, schule_stunden, status) VALUES
  (12, 'Julia Braun', '2026-03-02', '2026-03-08',
   'Maki-Rollen üben, Reis kochen, Mise en place Frühschicht',
   'Lebensmittelhygiene, HACCP-Grundlagen',
   24, 14, 'genehmigt'),
  (12, 'Julia Braun', '2026-03-09', '2026-03-15',
   'Nigiri-Technik mit Lachs, Thunfisch, Garnele. Saucen vorbereiten.',
   'Warenkunde Fisch, Qualitätskontrolle',
   24, 14, 'genehmigt'),
  (12, 'Julia Braun', '2026-03-16', '2026-03-22',
   'Inside-Out-Rollen, Tempura-Teig, Frittieren üben',
   'Kalkulation und Preisberechnung',
   24, 14, 'eingereicht'),
  (12, 'Julia Braun', '2026-03-23', '2026-03-29',
   'Sashimi-Schnitt, Fisch-Vorbereitung, Abend-Service unterstützt',
   'Ernährungslehre, Allergene',
   28, 10, 'entwurf')
ON CONFLICT DO NOTHING;

-- Training logs for Nina Richter
INSERT INTO ausbildungsnachweise (emp_id, emp_name, woche_start, woche_end, betrieb_taetigkeiten, schule_themen, betrieb_stunden, schule_stunden, status) VALUES
  (16, 'Nina Richter', '2026-03-16', '2026-03-22',
   'Gästeempfang, Bestellaufnahme, Kassensystem üben',
   'Serviceablauf, Beschwerdemanagement',
   22, 15, 'eingereicht'),
  (16, 'Nina Richter', '2026-03-23', '2026-03-29',
   'Getränkeservice, Weinempfehlung Basics, Tisch eindecken',
   'Getränkekunde, Allergenkennzeichnung',
   24, 13, 'entwurf')
ON CONFLICT DO NOTHING;

-- Evaluations for Julia Braun
INSERT INTO azubi_bewertungen (emp_id, emp_name, datum, bewerter, kategorie, note, kommentar) VALUES
  (12, 'Julia Braun', '2026-01-15', 'Minh Tran', 'Fachkompetenz',    2, 'Sehr saubere Schnittführung, lernt schnell'),
  (12, 'Julia Braun', '2026-01-15', 'Minh Tran', 'Pünktlichkeit',    3, 'Meistens pünktlich, 1x 10 Min. verspätet'),
  (12, 'Julia Braun', '2026-01-15', 'Minh Tran', 'Teamarbeit',       2, 'Integriert sich gut ins Küchenteam'),
  (12, 'Julia Braun', '2026-01-15', 'Minh Tran', 'Eigeninitiative',  2, 'Fragt nach Aufgaben, arbeitet selbstständig'),
  (12, 'Julia Braun', '2026-01-15', 'Minh Tran', 'Hygiene',          1, 'Vorbildlich, kennt HACCP-Regeln'),
  (12, 'Julia Braun', '2026-03-15', 'Minh Tran', 'Fachkompetenz',    2, 'Maki und Nigiri auf gutem Niveau'),
  (12, 'Julia Braun', '2026-03-15', 'Minh Tran', 'Pünktlichkeit',    2, 'Deutlich verbessert'),
  (12, 'Julia Braun', '2026-03-15', 'Minh Tran', 'Teamarbeit',       1, 'Hilft anderen proaktiv'),
  (12, 'Julia Braun', '2026-03-15', 'Minh Tran', 'Eigeninitiative',  2, 'Übernimmt Verantwortung'),
  (12, 'Julia Braun', '2026-03-15', 'Minh Tran', 'Hygiene',          1, 'Weiterhin vorbildlich');

-- Evaluations for Nina Richter
INSERT INTO azubi_bewertungen (emp_id, emp_name, datum, bewerter, kategorie, note, kommentar) VALUES
  (16, 'Nina Richter', '2026-03-15', 'Sarah Klein', 'Fachkompetenz',   3, 'Grundlagen Service gut, Weinwissen ausbauen'),
  (16, 'Nina Richter', '2026-03-15', 'Sarah Klein', 'Pünktlichkeit',   4, 'Regelmäßig verspätet, muss verbessert werden'),
  (16, 'Nina Richter', '2026-03-15', 'Sarah Klein', 'Teamarbeit',      2, 'Kommt gut mit Kollegen zurecht'),
  (16, 'Nina Richter', '2026-03-15', 'Sarah Klein', 'Eigeninitiative', 3, 'Wartet oft auf Anweisungen'),
  (16, 'Nina Richter', '2026-03-15', 'Sarah Klein', 'Hygiene',         2, 'Gute Hygienestandards');
