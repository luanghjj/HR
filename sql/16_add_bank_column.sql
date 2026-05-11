-- ═══════════════════════════════════════════════════════════
-- Migration: Add bank column to employees
-- Run in OKYU HRM Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════

ALTER TABLE employees ADD COLUMN IF NOT EXISTS bank TEXT DEFAULT '';
