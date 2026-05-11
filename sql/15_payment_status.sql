-- ═══════════════════════════════════════════════════════════
-- Migration: Payment Status (per month per employee)
-- Run in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS payment_status (
  id          BIGSERIAL PRIMARY KEY,
  emp_id      INT NOT NULL,
  month       DATE NOT NULL,         -- stored as first day of month: '2025-05-01'
  bar_status  TEXT DEFAULT 'ausstehend',  -- 'ausstehend' | 'bezahlt'
  ueb_status  TEXT DEFAULT 'ausstehend',  -- 'ausstehend' | 'bezahlt'
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_by  TEXT,
  UNIQUE (emp_id, month)
);

ALTER TABLE payment_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_all" ON payment_status
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
