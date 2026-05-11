-- ═══════════════════════════════════════════════════════════
-- Migration 18: bar_betrag in payment_status
-- Actual BAR amount paid this month (overrides employees.bar_gehalt)
-- Run in OKYU HRM Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════

ALTER TABLE payment_status ADD COLUMN IF NOT EXISTS bar_betrag NUMERIC;
