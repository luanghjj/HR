-- Migration 19: Personalnummer tùy chỉnh (editable, match Steuerberater)
ALTER TABLE employees ADD COLUMN IF NOT EXISTS personal_nr TEXT DEFAULT '';
COMMENT ON COLUMN employees.personal_nr IS 'Benutzerdefinierte Personalnummer für Steuerberater';
