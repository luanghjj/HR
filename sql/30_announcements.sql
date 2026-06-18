-- ═══════════════════════════════════════════════════════════
-- timetrack HRM – Mitteilungen / Announcements
-- Migration: 30_announcements.sql
-- In Supabase SQL Editor ausführen. Ändert KEINE bestehenden Daten.
-- ═══════════════════════════════════════════════════════════
--
-- Inhaber/Manager erstellen Mitteilungen; alle (bzw. ein Standort) sehen sie
-- als Banner im Dashboard und in der Glocke.

CREATE TABLE IF NOT EXISTS announcements (
  id          BIGSERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  location    TEXT,                 -- NULL = alle Standorte
  created_by  TEXT,                 -- user_id des Erstellers
  created_at  TIMESTAMPTZ DEFAULT now(),
  active      BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_announcements_active ON announcements(active);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Wie übrige Tabellen: eingeloggte Nutzer voll; Detail-Kontrolle ("wer erstellt")
-- erfolgt in der App über can('manageAnnouncements').
CREATE POLICY "announcements_authenticated_full"
  ON announcements FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
