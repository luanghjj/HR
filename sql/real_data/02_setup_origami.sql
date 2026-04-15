-- ══════════════════════════════════════════════════════════
-- OKYU HRM — Locations & Departments (Origami only)
-- Chạy SAU 01_cleanup.sql
-- ══════════════════════════════════════════════════════════

-- ─── LOCATION ───
INSERT INTO locations (id, name, city) VALUES
  ('origami', 'Origami Sushi & Asian Cuisine', 'Göppingen')
ON CONFLICT (id) DO NOTHING;

-- ─── DEPARTMENTS ───
INSERT INTO departments (name, location, head, count, color) VALUES
  ('Küche',      'origami', 'Nguyen Hai My', 0, '#fdcb6e'),
  ('Service',    'origami', 'Nguyen Hai My', 0, '#74b9ff'),
  ('Bar',        'origami', '—',             0, '#00b894'),
  ('Ausbildung', 'origami', '—',             0, '#e17055'),
  ('Verwaltung', 'origami', 'Nguyen Hai My', 0, '#a29bfe'),
  ('Sushi',      'origami', '—',             0, '#fd79a8');

SELECT 'Locations & Departments OK' AS result;
