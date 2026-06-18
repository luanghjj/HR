-- ═══════════════════════════════════════════════════════════
-- timetrack HRM – Priorität für Mitteilungen
-- Migration: 32_announcement_priority.sql
-- In Supabase SQL Editor ausführen. Ändert KEINE bestehenden Daten.
-- ═══════════════════════════════════════════════════════════
-- normal = grün, mittel = gelb, wichtig = rot

ALTER TABLE announcements ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal';
