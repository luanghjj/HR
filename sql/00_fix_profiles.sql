-- ═══════════════════════════════════════════════════════════
-- FIX: user_profiles FK + RLS + tạo profiles
-- ═══════════════════════════════════════════════════════════

-- 1. Xoá FK constraint cũ (type mismatch uuid vs text)
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_auth_user_id_fkey;

-- 2. Fix RLS - cho phép tất cả insert/update
DROP POLICY IF EXISTS "Authenticated can insert profiles" ON user_profiles;
DROP POLICY IF EXISTS "Authenticated can update profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "auth_read" ON user_profiles;
DROP POLICY IF EXISTS "service_all" ON user_profiles;

CREATE POLICY "allow_all_read" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "allow_all_insert" ON user_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_update" ON user_profiles FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_delete" ON user_profiles FOR DELETE USING (true);

-- 3. Xem auth users hiện có
SELECT id, email FROM auth.users ORDER BY email;
