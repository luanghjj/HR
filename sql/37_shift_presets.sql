-- ═══════════════════════════════════════════════════════════
-- timetrack HRM – Schicht-Vorlagen (Zeiten pro Standort)
-- Migration: 37_shift_presets.sql
-- In Supabase SQL Editor ausführen. Ändert KEINE bestehenden Daten.
-- ═══════════════════════════════════════════════════════════
--
-- Bisher waren die Vorlagen-Zeiten (Frühschicht 09:00–15:00 usw.) fest in
-- js/config.js verdrahtet – für ALLE Standorte gleich. Jeder Betrieb hat
-- aber andere Öffnungszeiten. Ab jetzt pflegt der Inhaber die Zeiten pro
-- Standort unter System → Schicht-Vorlagen und kann Vorlagen anlegen
-- bzw. löschen.
--
-- WICHTIG – Namensgebung: die Tabelle heisst shift_presetS.
-- Die bereits existierende Tabelle shift_templates hat eine ANDERE
-- Bedeutung (gespeicherte komplette Wochenpläne, siehe
-- 10_checklists_templates.sql) und bleibt unberührt.
--
-- color_class trägt die Bedeutung, NICHT das Label: eine Vorlage mit
-- color_class = 'schule' wird im Arbeitsplan als blauer "S"-Block
-- dargestellt, unabhängig davon wie sie heisst.

CREATE TABLE IF NOT EXISTS shift_presets (
  id          SERIAL PRIMARY KEY,
  location    TEXT NOT NULL,          -- Standort-ID, absichtlich OHNE FK (siehe 12_drop_location_fk.sql)
  label       TEXT NOT NULL,          -- z. B. "Frühschicht"
  shift_from  TEXT NOT NULL,          -- 'HH:MM'
  shift_to    TEXT NOT NULL,          -- 'HH:MM' (darf über Mitternacht gehen)
  color_class TEXT DEFAULT '',        -- '' = Bereichsfarbe; 'schule' = Schul-Darstellung
  sort_order  INT  DEFAULT 0,         -- Reihenfolge im Dropdown (10, 20, 30, …)
  created_by  TEXT,                   -- user_id des Anlegers
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_shift_presets_location ON shift_presets(location);

-- Pro Standort darf ein Vorlagenname nur einmal vorkommen.
-- Dient gleichzeitig als Ziel für ON CONFLICT im Seed unten.
CREATE UNIQUE INDEX IF NOT EXISTS idx_shift_presets_loc_label
  ON shift_presets(location, label);

ALTER TABLE shift_presets ENABLE ROW LEVEL SECURITY;

-- Wie übrige Tabellen: eingeloggte Nutzer voll; inhaltliche Kontrolle
-- (wer darf bearbeiten) erfolgt in der App über can('manageAccess').
-- Lesen müssen ALLE Rollen können – auch Minijob/Azubi brauchen die
-- Vorlagen im "Verfügbar melden"-Dialog.
DROP POLICY IF EXISTS "shift_presets_authenticated_full" ON shift_presets;
CREATE POLICY "shift_presets_authenticated_full"
  ON shift_presets FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ─── SEED: heutige Standard-Zeiten für ALLE bestehenden Standorte ───
-- Entspricht exakt SHIFT_PRESETS_SEED in js/config.js.
-- Der frühere Eintrag "Manuell" ist ABSICHTLICH nicht dabei: das Dropdown
-- hat bereits einen festen Eintrag "Manuell" (leerer Wert) – der
-- Config-Eintrag war ein Duplikat und erschien doppelt in der Auswahl.
--
-- Standorte werden aus der locations-Tabelle gelesen, damit keiner fehlt.
-- Mehrfaches Ausführen ist unschädlich (ON CONFLICT DO NOTHING) und
-- überschreibt vom Inhaber angepasste Zeiten NICHT.
INSERT INTO shift_presets (location, label, shift_from, shift_to, color_class, sort_order)
SELECT l.id, v.label, v.f, v.t, v.cc, v.so
FROM locations l
CROSS JOIN (VALUES
  ('Frühschicht',    '09:00', '15:00', '',       10),
  ('Spätschicht',    '15:00', '23:00', '',       20),
  ('Mittagsschicht', '11:00', '15:00', '',       30),
  ('Abendschicht',   '17:00', '23:00', '',       40),
  ('Ganztags',       '10:00', '22:00', '',       50),
  ('Schule',         '08:00', '15:00', 'schule', 60)
) AS v(label, f, t, cc, so)
ON CONFLICT (location, label) DO NOTHING;

-- ─── Kontrolle ───
SELECT location, label, shift_from, shift_to, color_class, sort_order
FROM shift_presets
ORDER BY location, sort_order, id;
