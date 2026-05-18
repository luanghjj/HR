-- ═══════════════════════════════════════════════════════════
-- Migration 18: Thêm cột cho Steuerberater Export
-- Tách Name → first_name + last_name
-- Tách Address → street + zip + city
-- ═══════════════════════════════════════════════════════════

-- Tách tên
ALTER TABLE employees ADD COLUMN IF NOT EXISTS first_name TEXT DEFAULT '';
ALTER TABLE employees ADD COLUMN IF NOT EXISTS last_name TEXT DEFAULT '';

-- Tách địa chỉ
ALTER TABLE employees ADD COLUMN IF NOT EXISTS street TEXT DEFAULT '';
ALTER TABLE employees ADD COLUMN IF NOT EXISTS zip TEXT DEFAULT '';
ALTER TABLE employees ADD COLUMN IF NOT EXISTS city TEXT DEFAULT '';

-- Auto-fill từ dữ liệu hiện tại (name → first_name + last_name)
-- Quy tắc: Từ cuối = last_name, phần còn lại = first_name
UPDATE employees
SET first_name = CASE
      WHEN name LIKE '% %' THEN TRIM(LEFT(name, LENGTH(name) - LENGTH(SPLIT_PART(name, ' ', array_length(string_to_array(name, ' '), 1)))))
      ELSE name
    END,
    last_name = SPLIT_PART(name, ' ', array_length(string_to_array(name, ' '), 1))
WHERE (first_name IS NULL OR first_name = '')
  AND name IS NOT NULL AND name != '';

COMMENT ON COLUMN employees.first_name IS 'Vorname (für Steuerberater Export)';
COMMENT ON COLUMN employees.last_name IS 'Nachname (für Steuerberater Export)';
COMMENT ON COLUMN employees.street IS 'Straße + Hausnummer';
COMMENT ON COLUMN employees.zip IS 'Postleitzahl';
COMMENT ON COLUMN employees.city IS 'Stadt/Ort';
