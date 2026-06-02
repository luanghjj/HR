-- ═══════════════════════════════════════════════════════════
-- OKYU HRM – Aushilfe Settings
-- Migration: 24_aushilfe_settings.sql
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS aushilfe_settings (
  id                   INT DEFAULT 1 PRIMARY KEY CHECK (id = 1), -- singleton row
  max_shifts_per_week  INT DEFAULT 1 NOT NULL,
  updated_at           TIMESTAMPTZ DEFAULT now(),
  updated_by           TEXT DEFAULT 'system'
);

-- Insert default row (only once)
INSERT INTO aushilfe_settings (id, max_shifts_per_week)
VALUES (1, 1)
ON CONFLICT (id) DO NOTHING;

-- RLS
ALTER TABLE aushilfe_settings ENABLE ROW LEVEL SECURITY;

-- Authenticated (Owner/Manager): read + update
CREATE POLICY "auth_read_settings"
  ON aushilfe_settings FOR SELECT TO authenticated USING (true);

CREATE POLICY "auth_update_settings"
  ON aushilfe_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Anonymous: read only (to show limit on public page)
CREATE POLICY "anon_read_settings"
  ON aushilfe_settings FOR SELECT TO anon USING (true);
