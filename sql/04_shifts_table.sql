-- ═══════════════════════════════════════════════════════════
-- OKYU HRM – Step: Shifts Table
-- Run in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS shifts (
  id          SERIAL PRIMARY KEY,
  emp_id      INTEGER REFERENCES employees(id),
  emp_name    TEXT NOT NULL,
  dept        TEXT NOT NULL,
  location    TEXT REFERENCES locations(id),
  shift_date  DATE NOT NULL,
  shift_from  TIME NOT NULL,
  shift_to    TIME NOT NULL,
  label       TEXT DEFAULT '',
  color_class TEXT DEFAULT '',
  is_sick     BOOLEAN DEFAULT false,
  is_vacation BOOLEAN DEFAULT false,
  is_late     BOOLEAN DEFAULT false,
  late_min    INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast date queries
CREATE INDEX IF NOT EXISTS idx_shifts_date ON shifts(shift_date);
CREATE INDEX IF NOT EXISTS idx_shifts_emp ON shifts(emp_id);

-- RLS
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth_read" ON shifts FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_write" ON shifts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "service_all" ON shifts FOR ALL USING (true) WITH CHECK (true);
