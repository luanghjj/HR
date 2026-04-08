-- ═══════════════════════════════════════════════════════════
-- CHECK & FIX: Locations + Shifts RLS
-- ═══════════════════════════════════════════════════════════

-- 1. Check locations data
SELECT * FROM locations ORDER BY id;

-- 2. Fix shifts RLS (drop duplicates, recreate clean)
DROP POLICY IF EXISTS "auth_read" ON shifts;
DROP POLICY IF EXISTS "auth_write" ON shifts;
DROP POLICY IF EXISTS "service_all" ON shifts;
DROP POLICY IF EXISTS "allow_all_read" ON shifts;
DROP POLICY IF EXISTS "allow_all_insert" ON shifts;
DROP POLICY IF EXISTS "allow_all_update" ON shifts;
DROP POLICY IF EXISTS "allow_all_delete" ON shifts;

CREATE POLICY "shifts_read" ON shifts FOR SELECT USING (true);
CREATE POLICY "shifts_insert" ON shifts FOR INSERT WITH CHECK (true);
CREATE POLICY "shifts_update" ON shifts FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "shifts_delete" ON shifts FOR DELETE USING (true);

-- 3. Fix vacations RLS (same pattern)
DROP POLICY IF EXISTS "auth_read" ON vacations;
DROP POLICY IF EXISTS "auth_write" ON vacations;
DROP POLICY IF EXISTS "service_all" ON vacations;
CREATE POLICY "vac_read" ON vacations FOR SELECT USING (true);
CREATE POLICY "vac_insert" ON vacations FOR INSERT WITH CHECK (true);
CREATE POLICY "vac_update" ON vacations FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "vac_delete" ON vacations FOR DELETE USING (true);

-- 4. Fix sick_leaves RLS
DROP POLICY IF EXISTS "auth_read" ON sick_leaves;
DROP POLICY IF EXISTS "auth_write" ON sick_leaves;
DROP POLICY IF EXISTS "service_all" ON sick_leaves;
CREATE POLICY "sick_read" ON sick_leaves FOR SELECT USING (true);
CREATE POLICY "sick_insert" ON sick_leaves FOR INSERT WITH CHECK (true);
CREATE POLICY "sick_update" ON sick_leaves FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "sick_delete" ON sick_leaves FOR DELETE USING (true);

-- 5. Fix employees RLS
DROP POLICY IF EXISTS "auth_read" ON employees;
DROP POLICY IF EXISTS "auth_write" ON employees;
DROP POLICY IF EXISTS "service_all" ON employees;
CREATE POLICY "emp_read" ON employees FOR SELECT USING (true);
CREATE POLICY "emp_insert" ON employees FOR INSERT WITH CHECK (true);
CREATE POLICY "emp_update" ON employees FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "emp_delete" ON employees FOR DELETE USING (true);

-- 6. Fix departments RLS
DROP POLICY IF EXISTS "auth_read" ON departments;
DROP POLICY IF EXISTS "auth_write" ON departments;
DROP POLICY IF EXISTS "service_all" ON departments;
CREATE POLICY "dept_read" ON departments FOR SELECT USING (true);
CREATE POLICY "dept_insert" ON departments FOR INSERT WITH CHECK (true);
CREATE POLICY "dept_update" ON departments FOR UPDATE USING (true) WITH CHECK (true);

-- Done
SELECT 'RLS policies fixed!' as status;
