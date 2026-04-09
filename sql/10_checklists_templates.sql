-- ═══════════════════════════════════════════════════════════
-- OKYU HRM – Checklists & Shift Templates persistence
-- Run in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════

-- ─── CHECKLISTS ───
CREATE TABLE IF NOT EXISTS checklists (
  id          SERIAL PRIMARY KEY,
  type        TEXT NOT NULL,     -- 'onboarding' | 'hygiene' | 'training' | 'safety'
  emp_id      INTEGER REFERENCES employees(id) ON DELETE CASCADE,
  emp_name    TEXT NOT NULL DEFAULT 'Alle Mitarbeiter',
  location    TEXT REFERENCES locations(id),
  items       JSONB NOT NULL DEFAULT '[]',  -- [{text, done}]
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast type/location queries
CREATE INDEX IF NOT EXISTS idx_checklists_type     ON checklists(type);
CREATE INDEX IF NOT EXISTS idx_checklists_location ON checklists(location);
CREATE INDEX IF NOT EXISTS idx_checklists_emp      ON checklists(emp_id);

-- RLS
ALTER TABLE checklists ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "checklists_read"  ON checklists;
DROP POLICY IF EXISTS "checklists_write" ON checklists;
CREATE POLICY "checklists_read"  ON checklists FOR SELECT TO authenticated USING (true);
CREATE POLICY "checklists_write" ON checklists FOR ALL    TO authenticated USING (true) WITH CHECK (true);

-- ─── SHIFT TEMPLATES ───
CREATE TABLE IF NOT EXISTS shift_templates (
  id          SERIAL PRIMARY KEY,
  location    TEXT REFERENCES locations(id),
  name        TEXT NOT NULL,
  shifts      JSONB NOT NULL DEFAULT '[]',  -- [{dept, from, to, label}]
  created_by  TEXT,    -- user_id who created it
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE shift_templates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "templates_read"  ON shift_templates;
DROP POLICY IF EXISTS "templates_write" ON shift_templates;
CREATE POLICY "templates_read"  ON shift_templates FOR SELECT TO authenticated USING (true);
CREATE POLICY "templates_write" ON shift_templates FOR ALL    TO authenticated USING (true) WITH CHECK (true);

-- ─── SEED: Migrate existing static data ───

-- Checklists (from data.js)
INSERT INTO checklists (type, emp_id, emp_name, location, items) VALUES
  ('onboarding', 4, 'Max Weber', 'origami',
   '[{"text":"Arbeitsvertrag unterzeichnet","done":true},{"text":"Gesundheitszeugnis vorgelegt","done":true},{"text":"Steuer-ID & SV-Nummer erhalten","done":true},{"text":"Arbeitskleidung ausgegeben","done":true},{"text":"Einweisung Küchenhygiene","done":true},{"text":"Einweisung Brandschutz","done":false},{"text":"Einweisung Kassensystem","done":false},{"text":"Probeschicht absolviert","done":true},{"text":"Schlüssel/Zugang erhalten","done":false}]'),
  ('hygiene', NULL, 'Alle Mitarbeiter', 'origami',
   '[{"text":"Händehygiene-Schulung (Q1)","done":true},{"text":"HACCP-Dokumentation aktualisiert","done":true},{"text":"Temperaturkontrollen Kühlräume","done":true},{"text":"Reinigungsplan überprüft","done":false},{"text":"Schädlingsbekämpfung (Quartal)","done":true},{"text":"Lebensmittelhygiene-Schulung (jährlich)","done":false}]'),
  ('hygiene', NULL, 'Alle Mitarbeiter', 'enso',
   '[{"text":"Händehygiene-Schulung (Q1)","done":true},{"text":"HACCP-Dokumentation aktualisiert","done":false},{"text":"Temperaturkontrollen Kühlräume","done":true},{"text":"Reinigungsplan überprüft","done":true},{"text":"Schädlingsbekämpfung (Quartal)","done":false},{"text":"Lebensmittelhygiene-Schulung (jährlich)","done":false}]'),
  ('safety', NULL, 'Alle Mitarbeiter', 'origami',
   '[{"text":"Brandschutzunterweisung (jährlich)","done":true},{"text":"Erste-Hilfe-Kasten geprüft","done":true},{"text":"Fluchtweg-Beschilderung geprüft","done":true},{"text":"Unfallverhütungsvorschriften besprochen","done":false},{"text":"Arbeitsschutz-Begehung","done":false}]')
ON CONFLICT DO NOTHING;

-- Shift Templates (from data.js)
INSERT INTO shift_templates (location, name, shifts) VALUES
  ('origami', 'Origami Standard Mo-Fr',
   '[{"dept":"Küche","from":"09:00","to":"15:00","label":"Frühschicht"},{"dept":"Küche","from":"15:00","to":"23:00","label":"Spätschicht"},{"dept":"Service","from":"11:00","to":"15:00","label":"Mittag"},{"dept":"Service","from":"17:00","to":"23:00","label":"Abend"},{"dept":"Bar","from":"17:00","to":"23:00","label":"Abend"}]'),
  ('origami', 'Origami Wochenende',
   '[{"dept":"Küche","from":"10:00","to":"22:00","label":"Ganztags"},{"dept":"Service","from":"10:00","to":"16:00","label":"Früh"},{"dept":"Service","from":"16:00","to":"23:00","label":"Spät"},{"dept":"Bar","from":"16:00","to":"23:00","label":"Spät"}]'),
  ('enso', 'Enso Standard',
   '[{"dept":"Küche","from":"10:00","to":"15:00","label":"Frühschicht"},{"dept":"Küche","from":"15:00","to":"23:00","label":"Spätschicht"},{"dept":"Service","from":"11:00","to":"23:00","label":"Ganztags"}]')
ON CONFLICT DO NOTHING;

SELECT 'Checklists & Templates tables created!' AS result;
