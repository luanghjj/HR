-- ═══════════════════════════════════════════════════════════
-- Migration 17: closed_months + bar_comment
-- Run in OKYU HRM Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════

-- 1. Table: closed_months (Inhaber locks a month for managers)
CREATE TABLE IF NOT EXISTS closed_months (
  id         BIGSERIAL PRIMARY KEY,
  month      DATE NOT NULL UNIQUE,   -- e.g. '2025-04-01'
  closed_by  TEXT,
  closed_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE closed_months ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_all" ON closed_months
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 2. Add bar_comment column to payment_status
ALTER TABLE payment_status ADD COLUMN IF NOT EXISTS bar_comment TEXT DEFAULT '';
