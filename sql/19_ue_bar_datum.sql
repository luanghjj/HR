-- ═══════════════════════════════════════════════════════════
-- Migration 19: ue_datum + bar_datum in payment_status
-- Run in OKYU HRM Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════

ALTER TABLE payment_status ADD COLUMN IF NOT EXISTS ue_datum  DATE;
ALTER TABLE payment_status ADD COLUMN IF NOT EXISTS bar_datum DATE;
