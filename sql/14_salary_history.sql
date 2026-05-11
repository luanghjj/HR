-- ═══════════════════════════════════════════════════════════
-- Migration: Salary History + BAR/Überweisung Split
-- Run in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════

-- 1. salary_history table
CREATE TABLE IF NOT EXISTS salary_history (
  id              BIGSERIAL PRIMARY KEY,
  emp_id          INT NOT NULL,
  changed_at      TIMESTAMPTZ DEFAULT NOW(),
  old_brutto      NUMERIC(10,2),
  new_brutto      NUMERIC(10,2),
  old_bar         NUMERIC(10,2),
  new_bar         NUMERIC(10,2),
  note            TEXT,
  changed_by      TEXT
);

-- RLS
ALTER TABLE salary_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_all" ON salary_history FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 2. bar_gehalt column on employees (cash portion)
ALTER TABLE employees ADD COLUMN IF NOT EXISTS bar_gehalt NUMERIC(10,2) DEFAULT 0;

-- 3. Remove old payment_method if it exists
ALTER TABLE employees DROP COLUMN IF EXISTS payment_method;
