-- ═══════════════════════════════════════════════════════════
-- Migration 20: GM → OKYU HR Data Migration
-- PART 1: Schema Changes (chạy TRƯỚC import)
-- Run in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════

-- ─── 1. Thêm locations mới ───
INSERT INTO locations (id, name, city) VALUES
  ('enso', 'Enso Sushi & Grill', 'Stuttgart'),
  ('okyu', 'Ōkyu Sushi', 'Heilbronn')
ON CONFLICT (id) DO NOTHING;

-- ─── 2. Thêm cột Stammdaten vào employees ───
ALTER TABLE employees ADD COLUMN IF NOT EXISTS typ TEXT DEFAULT '';
ALTER TABLE employees ADD COLUMN IF NOT EXISTS austritt DATE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS netto NUMERIC(10,2) DEFAULT 0;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS steuerklasse TEXT DEFAULT '';
ALTER TABLE employees ADD COLUMN IF NOT EXISTS steuer_id TEXT DEFAULT '';
ALTER TABLE employees ADD COLUMN IF NOT EXISTS sv_nr TEXT DEFAULT '';
ALTER TABLE employees ADD COLUMN IF NOT EXISTS krankenkasse TEXT DEFAULT '';
ALTER TABLE employees ADD COLUMN IF NOT EXISTS iban TEXT DEFAULT '';
ALTER TABLE employees ADD COLUMN IF NOT EXISTS adresse TEXT DEFAULT '';
ALTER TABLE employees ADD COLUMN IF NOT EXISTS nationalitaet TEXT DEFAULT '';
ALTER TABLE employees ADD COLUMN IF NOT EXISTS aufenthaltstitel TEXT DEFAULT '';
ALTER TABLE employees ADD COLUMN IF NOT EXISTS arbeitserlaubnis_bis DATE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS benefit_kita NUMERIC(10,2) DEFAULT 0;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS benefit_jobticket NUMERIC(10,2) DEFAULT 0;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS benefit_jobrad NUMERIC(10,2) DEFAULT 0;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS benefit_erholung NUMERIC(10,2) DEFAULT 0;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS benefit_diensthandy BOOLEAN DEFAULT false;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS benefit_gesundheit NUMERIC(10,2) DEFAULT 0;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS stb_name TEXT DEFAULT '';
ALTER TABLE employees ADD COLUMN IF NOT EXISTS ma_notiz TEXT DEFAULT '';

-- ─── 3. Tạo bảng gehaelter ───
CREATE TABLE IF NOT EXISTS gehaelter (
  id            BIGSERIAL PRIMARY KEY,
  emp_id        INT REFERENCES employees(id) ON DELETE SET NULL,
  monat         TEXT NOT NULL,
  betrieb       TEXT NOT NULL,
  pers_nr       INT,
  name          TEXT NOT NULL,
  gehalt        NUMERIC(10,2) DEFAULT 0,
  brutto        NUMERIC(10,2) DEFAULT 0,
  netto         NUMERIC(10,2) DEFAULT 0,
  abzuege       NUMERIC(10,2) DEFAULT 0,
  netto_ausz    NUMERIC(10,2) DEFAULT 0,
  ueberweisung  NUMERIC(10,2) DEFAULT 0,
  bar_tg        NUMERIC(10,2) DEFAULT 0,
  ue_status     TEXT DEFAULT 'offen',
  ue_datum      TEXT DEFAULT '',
  ue_bank       TEXT DEFAULT '',
  bar_status    TEXT DEFAULT 'offen',
  bar_datum     TEXT DEFAULT '',
  ziel_gehalt   NUMERIC(10,2) DEFAULT 0,
  notiz         TEXT DEFAULT '',
  UNIQUE (pers_nr, betrieb, monat)
);

ALTER TABLE gehaelter ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gehaelter_auth_read" ON gehaelter
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "gehaelter_auth_write" ON gehaelter
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ─── 4. Xóa employees cũ (giữ Inhaber + Manager) ───

-- Xóa cascade data trước
DELETE FROM payment_status WHERE emp_id IN (
  SELECT e.id FROM employees e
  LEFT JOIN user_profiles up ON up.emp_id = e.id
  WHERE up.role IS NULL OR up.role NOT IN ('inhaber','manager')
);

DELETE FROM salary_history WHERE emp_id IN (
  SELECT e.id FROM employees e
  LEFT JOIN user_profiles up ON up.emp_id = e.id
  WHERE up.role IS NULL OR up.role NOT IN ('inhaber','manager')
);

DELETE FROM vacations WHERE emp_id IN (
  SELECT e.id FROM employees e
  LEFT JOIN user_profiles up ON up.emp_id = e.id
  WHERE up.role IS NULL OR up.role NOT IN ('inhaber','manager')
);

DELETE FROM sick_leaves WHERE emp_id IN (
  SELECT e.id FROM employees e
  LEFT JOIN user_profiles up ON up.emp_id = e.id
  WHERE up.role IS NULL OR up.role NOT IN ('inhaber','manager')
);

DELETE FROM documents WHERE emp_id IN (
  SELECT e.id FROM employees e
  LEFT JOIN user_profiles up ON up.emp_id = e.id
  WHERE up.role IS NULL OR up.role NOT IN ('inhaber','manager')
);

-- Shifts
DELETE FROM shifts WHERE emp_id IN (
  SELECT e.id FROM employees e
  LEFT JOIN user_profiles up ON up.emp_id = e.id
  WHERE up.role IS NULL OR up.role NOT IN ('inhaber','manager')
);

-- Time records
DELETE FROM time_records WHERE emp_id IN (
  SELECT e.id FROM employees e
  LEFT JOIN user_profiles up ON up.emp_id = e.id
  WHERE up.role IS NULL OR up.role NOT IN ('inhaber','manager')
);

-- Checklists (ON DELETE CASCADE, but clean anyway)
DELETE FROM checklists WHERE emp_id IN (
  SELECT e.id FROM employees e
  LEFT JOIN user_profiles up ON up.emp_id = e.id
  WHERE up.role IS NULL OR up.role NOT IN ('inhaber','manager')
);

-- Cuối cùng xóa employees
DELETE FROM employees WHERE id IN (
  SELECT e.id FROM employees e
  LEFT JOIN user_profiles up ON up.emp_id = e.id
  WHERE up.role IS NULL OR up.role NOT IN ('inhaber','manager')
);

-- Reset sequence
SELECT setval('employees_id_seq', COALESCE((SELECT MAX(id) FROM employees), 0) + 1);
