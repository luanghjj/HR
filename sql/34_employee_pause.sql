-- ═══════════════════════════════════════════════════════════
-- timetrack HRM – Pause pro Schicht (Minuten) je Mitarbeiter
-- Migration: 34_employee_pause.sql
-- In Supabase SQL Editor ausführen. Ändert KEINE bestehenden Daten.
-- ═══════════════════════════════════════════════════════════
-- Standard 30 Min/Schicht; pro Mitarbeiter im Detail anpassbar.

ALTER TABLE employees ADD COLUMN IF NOT EXISTS pause_minutes INTEGER DEFAULT 30;
