-- ═══════════════════════════════════════════════════════════
-- OKYU HRM – Fix RLS: Đổi tất cả policy "public" → "authenticated"
-- Chạy trong Supabase Dashboard → SQL Editor → New Query → Run
-- ═══════════════════════════════════════════════════════════

-- 1. LOCATIONS
DROP POLICY IF EXISTS "service_all" ON locations;
CREATE POLICY "auth_all" ON locations FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 2. EMPLOYEES
DROP POLICY IF EXISTS "service_all" ON employees;
CREATE POLICY "auth_all" ON employees FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. DEPARTMENTS
DROP POLICY IF EXISTS "service_all" ON departments;
CREATE POLICY "auth_all" ON departments FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. SHIFTS
DROP POLICY IF EXISTS "service_all" ON shifts;
CREATE POLICY "auth_all" ON shifts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. VACATIONS
DROP POLICY IF EXISTS "service_all" ON vacations;
CREATE POLICY "auth_all" ON vacations FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. SICK_LEAVES
DROP POLICY IF EXISTS "service_all" ON sick_leaves;
CREATE POLICY "auth_all" ON sick_leaves FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7. DOCUMENTS
DROP POLICY IF EXISTS "service_all" ON documents;
CREATE POLICY "auth_all" ON documents FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 8. TIME_RECORDS
DROP POLICY IF EXISTS "service_all" ON time_records;
CREATE POLICY "auth_all" ON time_records FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 9. USER_PROFILES
DROP POLICY IF EXISTS "service_all" ON user_profiles;
CREATE POLICY "auth_all" ON user_profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 10. CHECKLISTS (nếu có)
DROP POLICY IF EXISTS "service_all" ON checklists;
CREATE POLICY "auth_all" ON checklists FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 11. SAVED_TEMPLATES (nếu có)
DROP POLICY IF EXISTS "service_all" ON saved_templates;
CREATE POLICY "auth_all" ON saved_templates FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 12. SCHULE_SCHEDULE (nếu có)
DROP POLICY IF EXISTS "service_all" ON schule_schedule;
CREATE POLICY "auth_all" ON schule_schedule FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 13. AUSBILDUNGSNACHWEISE (nếu có)
DROP POLICY IF EXISTS "service_all" ON ausbildungsnachweise;
CREATE POLICY "auth_all" ON ausbildungsnachweise FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 14. AZUBI_BEWERTUNGEN (nếu có)
DROP POLICY IF EXISTS "service_all" ON azubi_bewertungen;
CREATE POLICY "auth_all" ON azubi_bewertungen FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Đảm bảo RLS đã bật trên tất cả bảng
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE vacations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sick_leaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Bảng có thể chưa tồn tại → bỏ qua lỗi
-- ALTER TABLE checklists ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE saved_templates ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE schule_schedule ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE ausbildungsnachweise ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE azubi_bewertungen ENABLE ROW LEVEL SECURITY;
