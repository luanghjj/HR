-- ═══════════════════════════════════════════════════════════
-- Drop ALL location FK constraints for multi-location support
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════

ALTER TABLE departments DROP CONSTRAINT IF EXISTS departments_location_fkey;
ALTER TABLE employees DROP CONSTRAINT IF EXISTS employees_location_fkey;
ALTER TABLE vacations DROP CONSTRAINT IF EXISTS vacations_location_fkey;
ALTER TABLE sick_leaves DROP CONSTRAINT IF EXISTS sick_leaves_location_fkey;
ALTER TABLE shifts DROP CONSTRAINT IF EXISTS shifts_location_fkey;
ALTER TABLE time_records DROP CONSTRAINT IF EXISTS time_records_location_fkey;
ALTER TABLE checklists DROP CONSTRAINT IF EXISTS checklists_location_fkey;
ALTER TABLE shift_templates DROP CONSTRAINT IF EXISTS shift_templates_location_fkey;
