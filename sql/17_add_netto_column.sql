-- ═══════════════════════════════════════════════════════════
-- Migration 17: Add netto_gehalt column to employees table
-- Netto Gesamt – Eingabe für Steuerberater
-- ═══════════════════════════════════════════════════════════

ALTER TABLE employees ADD COLUMN IF NOT EXISTS netto_gehalt NUMERIC DEFAULT 0;

COMMENT ON COLUMN employees.netto_gehalt IS 'Netto-Gehalt (Eingabe vom Steuerberater)';
