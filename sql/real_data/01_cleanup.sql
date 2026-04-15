-- ══════════════════════════════════════════════════════════
-- OKYU HRM — CLEANUP: Xóa data test
-- Giữ nguyên: zeiterfassung_daily, zeiterfassung_monthly
-- Giữ nguyên: 2 tài khoản Inhaber (PN + Admin)
-- Chạy trong: Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════════════════

-- BƯỚC 0: Kiểm tra 2 tài khoản Inhaber trước khi xóa
-- (Chạy lệnh này trước để xác nhận đúng 2 người cần giữ)
/*
SELECT user_id, name, role, location
FROM user_profiles
WHERE role = 'inhaber';
*/

-- ══════════════════════════════════════════════════════════
-- BƯỚC 1: Xóa data tables (thứ tự: child → parent)
-- KHÔNG đụng đến: zeiterfassung_daily, zeiterfassung_monthly
-- ══════════════════════════════════════════════════════════

TRUNCATE TABLE documents        RESTART IDENTITY CASCADE;
TRUNCATE TABLE sick_leaves      RESTART IDENTITY CASCADE;
TRUNCATE TABLE vacations        RESTART IDENTITY CASCADE;
TRUNCATE TABLE employees        RESTART IDENTITY CASCADE;
TRUNCATE TABLE departments      RESTART IDENTITY CASCADE;
TRUNCATE TABLE shift_templates  RESTART IDENTITY CASCADE; -- FK → locations
DELETE FROM locations;

-- ══════════════════════════════════════════════════════════
-- BƯỚC 2: Xóa user_permissions (trừ 2 Inhaber)
-- ══════════════════════════════════════════════════════════

DELETE FROM user_permissions
WHERE user_id NOT IN (
  SELECT user_id FROM user_profiles WHERE role = 'inhaber'
);

-- ══════════════════════════════════════════════════════════
-- BƯỚC 3: Xóa user_profiles (trừ 2 Inhaber)
-- ══════════════════════════════════════════════════════════

DELETE FROM user_profiles WHERE role != 'inhaber';

-- ══════════════════════════════════════════════════════════
-- BƯỚC 4: Xóa auth.users (trừ 2 Inhaber)
-- Supabase SQL Editor chạy với quyền service role → OK
-- ══════════════════════════════════════════════════════════

DELETE FROM auth.users
WHERE id NOT IN (
  SELECT auth_user_id
  FROM user_profiles
  WHERE role = 'inhaber'
    AND auth_user_id IS NOT NULL
);

-- ══════════════════════════════════════════════════════════
-- KIỂM TRA SAU KHI CLEANUP
-- ══════════════════════════════════════════════════════════

SELECT
  'user_profiles còn lại' AS check_item,
  COUNT(*) AS count
FROM user_profiles
UNION ALL
SELECT 'auth.users còn lại', COUNT(*) FROM auth.users
UNION ALL
SELECT 'employees còn lại', COUNT(*) FROM employees;
