-- ═══════════════════════════════════════════════════════════
-- Migration: Salary History + Payment Method
-- Run in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════

-- 1. salary_history table
CREATE TABLE IF NOT EXISTS salary_history (
  id          BIGSERIAL PRIMARY KEY,
  emp_id      INT NOT NULL,
  changed_at  TIMESTAMPTZ DEFAULT NOW(),
  old_amount  NUMERIC(10,2),
  new_amount  NUMERIC(10,2),
  note        TEXT,
  changed_by  TEXT
);

-- RLS
ALTER TABLE salary_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_all" ON salary_history FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 2. payment_method column on employees
ALTER TABLE employees ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'Überweisung';
