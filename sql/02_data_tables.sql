-- ═══════════════════════════════════════════════════════════
-- OKYU HRM – Step 4: All Data Tables + Demo Data
-- Run in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════

-- ─── LOCATIONS ───
CREATE TABLE IF NOT EXISTS locations (
  id    TEXT PRIMARY KEY,
  name  TEXT NOT NULL,
  city  TEXT NOT NULL
);

-- ─── DEPARTMENTS ───
CREATE TABLE IF NOT EXISTS departments (
  id        SERIAL PRIMARY KEY,
  name      TEXT NOT NULL,
  location  TEXT REFERENCES locations(id),
  head      TEXT DEFAULT '—',
  count     INTEGER DEFAULT 0,
  color     TEXT DEFAULT '#a29bfe'
);

-- ─── EMPLOYEES ───
CREATE TABLE IF NOT EXISTS employees (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  location      TEXT REFERENCES locations(id),
  dept          TEXT NOT NULL,
  position      TEXT NOT NULL,
  status        TEXT DEFAULT 'active' CHECK (status IN ('active', 'vacation', 'sick', 'inactive')),
  start_date    DATE NOT NULL,
  avatar        TEXT DEFAULT '??',
  vac_total     INTEGER DEFAULT 26,
  vac_used      INTEGER DEFAULT 0,
  sick_days     INTEGER DEFAULT 0,
  late_count    INTEGER DEFAULT 0,
  soll_stunden  INTEGER DEFAULT 160,
  brutto_gehalt NUMERIC(10,2) DEFAULT 0,
  schule_tage   INTEGER DEFAULT 0,
  birthday      DATE,
  prob_end      DATE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── VACATIONS ───
CREATE TABLE IF NOT EXISTS vacations (
  id        SERIAL PRIMARY KEY,
  emp_id    INTEGER REFERENCES employees(id),
  emp_name  TEXT NOT NULL,
  location  TEXT REFERENCES locations(id),
  from_date DATE NOT NULL,
  to_date   DATE NOT NULL,
  days      INTEGER NOT NULL,
  status    TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  note      TEXT DEFAULT ''
);

-- ─── SICK LEAVES ───
CREATE TABLE IF NOT EXISTS sick_leaves (
  id        SERIAL PRIMARY KEY,
  emp_id    INTEGER REFERENCES employees(id),
  emp_name  TEXT NOT NULL,
  location  TEXT REFERENCES locations(id),
  from_date DATE NOT NULL,
  to_date   DATE NOT NULL,
  days      INTEGER NOT NULL,
  status    TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  has_au    BOOLEAN DEFAULT false,
  note      TEXT DEFAULT ''
);

-- ─── DOCUMENTS ───
CREATE TABLE IF NOT EXISTS documents (
  id        SERIAL PRIMARY KEY,
  emp_id    INTEGER REFERENCES employees(id),
  emp_name  TEXT NOT NULL,
  name      TEXT NOT NULL,
  type      TEXT DEFAULT 'other',
  doc_date  DATE NOT NULL,
  icon      TEXT DEFAULT '📄'
);

-- ─── RLS for all tables ───
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE vacations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sick_leaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Simple policy: authenticated users can read all data
CREATE POLICY "auth_read" ON locations FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read" ON departments FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read" ON employees FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read" ON vacations FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read" ON sick_leaves FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read" ON documents FOR SELECT TO authenticated USING (true);

-- Write policies (authenticated can insert/update/delete)
CREATE POLICY "auth_write" ON employees FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_write" ON vacations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_write" ON sick_leaves FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_write" ON documents FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_write" ON departments FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Service role full access (for setup)
CREATE POLICY "service_all" ON locations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_all" ON departments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_all" ON employees FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_all" ON vacations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_all" ON sick_leaves FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_all" ON documents FOR ALL USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════
-- DEMO DATA
-- ═══════════════════════════════════════════════════════════

-- Locations
INSERT INTO locations (id, name, city) VALUES
  ('origami',      'Origami Sushi & Asian Cuisine', 'Göppingen'),
  ('enso',         'Enso Sushi & Grill',            'Stuttgart'),
  ('okyu_central', 'OKYU Zentrale',                 'Stuttgart')
ON CONFLICT (id) DO NOTHING;

-- Departments
INSERT INTO departments (id, name, location, head, count, color) VALUES
  (1, 'Küche',      'origami',      'Minh Tran',   6, '#fdcb6e'),
  (2, 'Service',    'origami',      'Lisa Müller', 5, '#74b9ff'),
  (3, 'Bar',        'origami',      'Tom Weber',   2, '#00b894'),
  (4, 'Küche',      'enso',         'Duc Nguyen',  5, '#fdcb6e'),
  (5, 'Service',    'enso',         'Sarah Klein', 4, '#74b9ff'),
  (6, 'Bar',        'enso',         'Max Bauer',   2, '#00b894'),
  (7, 'Verwaltung', 'okyu_central', 'Hai My',      3, '#a29bfe'),
  (8, 'Ausbildung', 'origami',      'Minh Tran',   3, '#e17055'),
  (9, 'Ausbildung', 'enso',         'Duc Nguyen',  2, '#e17055')
ON CONFLICT (id) DO NOTHING;

-- Employees
INSERT INTO employees (id, name, location, dept, position, status, start_date, avatar, vac_total, vac_used, sick_days, late_count, soll_stunden, brutto_gehalt, schule_tage, birthday, prob_end) VALUES
  (1,  'Minh Tran',      'origami',      'Küche',      'Küchenchef',          'active',   '2019-03-15', 'MT', 30, 5,  2, 0, 173, 3800, 0,  '1988-07-12', '2019-09-15'),
  (2,  'Lisa Müller',    'origami',      'Service',    'Serviceleitung',      'active',   '2020-06-01', 'LM', 28, 3,  3, 1, 160, 3200, 0,  '1995-04-22', '2020-12-01'),
  (3,  'Tom Weber',      'origami',      'Bar',        'Barkeeper',           'active',   '2021-01-10', 'TW', 28, 0,  0, 0, 140, 2600, 0,  '1993-11-05', '2021-07-10'),
  (4,  'Anna Schmidt',   'origami',      'Service',    'Kellnerin',           'active',   '2022-04-01', 'AS', 26, 4,  1, 2, 120, 2200, 0,  '2000-03-28', '2022-10-01'),
  (5,  'Duc Nguyen',     'enso',         'Küche',      'Küchenchef',          'active',   '2020-09-01', 'DN', 30, 8,  0, 0, 173, 3800, 0,  '1990-12-18', '2021-03-01'),
  (6,  'Sarah Klein',    'enso',         'Service',    'Serviceleitung',      'active',   '2021-05-15', 'SK', 28, 5,  1, 0, 160, 3100, 0,  '1994-08-30', '2021-11-15'),
  (7,  'Max Bauer',      'enso',         'Bar',        'Barkeeper',           'active',   '2022-01-20', 'MB', 26, 0,  2, 3, 130, 2400, 0,  '1998-06-14', '2022-07-20'),
  (8,  'Hai My',         'okyu_central', 'Verwaltung', 'Office Manager',      'active',   '2018-08-01', 'HM', 30, 10, 0, 0, 173, 3500, 0,  '1992-01-25', '2019-02-01'),
  (9,  'Lukas Hoffmann', 'origami',      'Küche',      'Koch',                'active',   '2023-02-01', 'LH', 26, 2,  1, 1, 160, 2800, 0,  '1997-09-08', '2023-08-01'),
  (10, 'Maria Garcia',   'origami',      'Service',    'Kellnerin',           'vacation', '2022-07-15', 'MG', 26, 12, 0, 0, 100, 1850, 0,  '1999-05-20', '2023-01-15'),
  (11, 'Kevin Pham',     'enso',         'Küche',      'Koch',                'sick',     '2023-06-01', 'KP', 26, 3,  8, 2, 160, 2700, 0,  '1996-10-03', '2023-12-01'),
  (12, 'Julia Braun',    'origami',      'Ausbildung', 'Azubi Koch',          'active',   '2024-08-01', 'JB', 24, 0,  2, 1, 160, 1000, 8,  '2005-04-15', '2024-11-01'),
  (13, 'Thi Lan Vo',     'enso',         'Service',    'Kellnerin',           'active',   '2023-09-01', 'TV', 26, 0,  0, 0, 130, 2400, 0,  '2001-07-30', '2024-03-01'),
  (14, 'Björn Dolwig',   'okyu_central', 'Verwaltung', 'Steuerberater (ext.)','active',   '2019-01-01', 'BD', 0,  0,  0, 0, 0,   0,    0,  '1980-02-14', NULL),
  (15, 'Phuong Le',      'origami',      'Küche',      'Sushi-Koch',          'active',   '2021-11-01', 'PL', 28, 6,  4, 0, 160, 2900, 0,  '1991-03-22', '2022-05-01'),
  (16, 'Nina Richter',   'enso',         'Ausbildung', 'Azubi Service',       'active',   '2025-08-01', 'NR', 24, 0,  1, 4, 160, 950,  10, '2006-11-10', '2025-11-01'),
  (17, 'Huy Dang',       'origami',      'Küche',      'Beikoch',             'sick',     '2024-03-01', 'HD', 26, 0,  5, 1, 140, 2400, 0,  '1999-08-19', '2024-09-01')
ON CONFLICT (id) DO NOTHING;

-- Reset sequence
SELECT setval('employees_id_seq', (SELECT MAX(id) FROM employees));

-- Vacations
INSERT INTO vacations (id, emp_id, emp_name, location, from_date, to_date, days, status, note) VALUES
  (1, 10, 'Maria Garcia',   'origami', '2026-03-18', '2026-03-25', 6, 'approved', 'Familienurlaub'),
  (2, 4,  'Anna Schmidt',   'origami', '2026-04-06', '2026-04-12', 5, 'pending',  'Osterurlaub'),
  (3, 13, 'Thi Lan Vo',     'enso',    '2026-04-20', '2026-05-01', 8, 'pending',  'Heimatbesuch Vietnam'),
  (4, 6,  'Sarah Klein',    'enso',    '2026-03-10', '2026-03-14', 5, 'approved', ''),
  (5, 9,  'Lukas Hoffmann', 'origami', '2026-05-15', '2026-05-23', 7, 'approved', 'Sommerurlaub')
ON CONFLICT (id) DO NOTHING;

SELECT setval('vacations_id_seq', (SELECT MAX(id) FROM vacations));

-- Sick Leaves
INSERT INTO sick_leaves (id, emp_id, emp_name, location, from_date, to_date, days, status, has_au, note) VALUES
  (1, 11, 'Kevin Pham',  'enso',    '2026-03-18', '2026-03-21', 4, 'active', true,  'Grippe'),
  (2, 17, 'Huy Dang',    'origami', '2026-03-19', '2026-03-20', 2, 'active', false, 'Rückenschmerzen'),
  (3, 2,  'Lisa Müller', 'origami', '2026-03-10', '2026-03-12', 3, 'closed', true,  'Erkältung')
ON CONFLICT (id) DO NOTHING;

SELECT setval('sick_leaves_id_seq', (SELECT MAX(id) FROM sick_leaves));

-- Documents
INSERT INTO documents (id, emp_id, emp_name, name, type, doc_date, icon) VALUES
  (1,  1,  'Minh Tran',    'Arbeitsvertrag',               'contracts', '2019-03-15', '📄'),
  (2,  1,  'Minh Tran',    'Gesundheitszeugnis',           'health',    '2019-03-10', '🏥'),
  (3,  4,  'Anna Schmidt', 'Arbeitsvertrag',               'contracts', '2022-04-01', '📄'),
  (4,  4,  'Anna Schmidt', 'Lohnsteuerbescheinigung 2025', 'tax',       '2026-02-01', '💰'),
  (5,  12, 'Julia Braun',  'Ausbildungsvertrag',           'contracts', '2024-08-01', '📄'),
  (6,  12, 'Julia Braun',  'Berufsschulbescheinigung',     'certs',     '2024-09-15', '🎓'),
  (7,  11, 'Kevin Pham',   'Arbeitsvertrag',               'contracts', '2023-06-01', '📄'),
  (8,  11, 'Kevin Pham',   'Aufenthaltstitel',             'other',     '2023-06-01', '🪪'),
  (9,  8,  'Hai My',       'Arbeitsvertrag',               'contracts', '2018-08-01', '📄'),
  (10, 15, 'Phuong Le',    'Gesundheitszeugnis',           'health',    '2021-10-20', '🏥')
ON CONFLICT (id) DO NOTHING;

SELECT setval('documents_id_seq', (SELECT MAX(id) FROM documents));
