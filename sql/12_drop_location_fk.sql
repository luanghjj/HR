-- ═══════════════════════════════════════════════════════════
-- Migration: Drop location FK constraints for multi-location support
-- employees.location can now be 'all' or comma-separated IDs
-- ═══════════════════════════════════════════════════════════

-- Drop FK on employees.location
ALTER TABLE employees DROP CONSTRAINT IF EXISTS employees_location_fkey;

-- Drop FK on user_profiles.location (if exists — user_profiles already uses 'all')
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_location_fkey;
