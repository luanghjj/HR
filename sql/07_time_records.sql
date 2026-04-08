-- ═══════════════════════════════════════════════════════════
-- GPS Zeiterfassung – time_records table
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS time_records (
  id SERIAL PRIMARY KEY,
  emp_id INT REFERENCES employees(id),
  location TEXT REFERENCES locations(id),
  check_in TIMESTAMPTZ NOT NULL DEFAULT now(),
  check_out TIMESTAMPTZ,
  check_in_lat FLOAT,
  check_in_lng FLOAT,
  check_out_lat FLOAT,
  check_out_lng FLOAT,
  distance_m INT DEFAULT 0,
  shift_id INT,
  is_late BOOLEAN DEFAULT false,
  late_min INT DEFAULT 0,
  total_hours FLOAT,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE time_records ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "time_records_all" ON time_records;
CREATE POLICY "time_records_all" ON time_records FOR ALL USING (true) WITH CHECK (true);

-- Index für schnelle Abfragen
CREATE INDEX IF NOT EXISTS idx_time_records_emp ON time_records(emp_id);
CREATE INDEX IF NOT EXISTS idx_time_records_date ON time_records(check_in);
CREATE INDEX IF NOT EXISTS idx_time_records_location ON time_records(location);

SELECT 'time_records table created!' AS result;
