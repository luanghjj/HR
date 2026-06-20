-- ═══════════════════════════════════════════════════════════
-- timetrack HRM – Pflicht-Mitteilungen (Vollbild, Lesebestätigung)
-- Migration: 33_announcement_mandatory.sql
-- In Supabase SQL Editor ausführen. Ändert KEINE bestehenden Daten.
-- ═══════════════════════════════════════════════════════════

-- Flag: muss vor Betreten der App gelesen & bestätigt werden
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS mandatory BOOLEAN DEFAULT false;

-- Wer hat welche Mitteilung gelesen
CREATE TABLE IF NOT EXISTS announcement_reads (
  id              BIGSERIAL PRIMARY KEY,
  announcement_id BIGINT NOT NULL,
  user_id         TEXT NOT NULL,
  emp_id          INTEGER,
  name            TEXT,
  read_at         TIMESTAMPTZ DEFAULT now()
);

-- Ein Eintrag pro Nutzer & Mitteilung
CREATE UNIQUE INDEX IF NOT EXISTS uniq_ann_read
  ON announcement_reads (announcement_id, user_id);

ALTER TABLE announcement_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ann_reads_authenticated_full"
  ON announcement_reads FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);
