-- ═══════════════════════════════════════════════════════════
-- timetrack HRM – Anhang für Mitteilungen (PDF/Bild)
-- Migration: 31_announcement_attachment.sql
-- In Supabase SQL Editor ausführen. Ändert KEINE bestehenden Daten.
-- ═══════════════════════════════════════════════════════════

ALTER TABLE announcements ADD COLUMN IF NOT EXISTS attachment_url  TEXT;
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS attachment_name TEXT;
