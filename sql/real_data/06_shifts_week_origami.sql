-- ══════════════════════════════════════════════════════════
-- OKYU HRM — Lịch làm tuần 13.04–19.04.2026 cho Origami
-- 1 ca duy nhất mỗi ngày (pause 15–17h không cần lưu)
-- ══════════════════════════════════════════════════════════

-- Xóa cũ trước (tránh trùng)
DELETE FROM shifts
WHERE location = 'origami'
  AND shift_date BETWEEN '2026-04-13' AND '2026-04-19';

-- Di 14.04 / Mi 15.04 / Do 16.04 → 10:30–22:00 (tất cả)
INSERT INTO shifts (emp_id, emp_name, dept, location, shift_date, shift_from, shift_to, label)
SELECT e.id, e.name, e.dept, 'origami', d.dt, '10:30', '22:00', ''
FROM employees e
CROSS JOIN (VALUES
  ('2026-04-14'::DATE),
  ('2026-04-15'::DATE),
  ('2026-04-16'::DATE)
) AS d(dt)
WHERE e.location = 'origami' AND e.status = 'active';

-- Fr 17.04 → 11:30–23:00 (tất cả)
INSERT INTO shifts (emp_id, emp_name, dept, location, shift_date, shift_from, shift_to, label)
SELECT e.id, e.name, e.dept, 'origami', '2026-04-17', '11:30', '23:00', ''
FROM employees e
WHERE e.location = 'origami' AND e.status = 'active';

-- Sa 18.04 + So 19.04 → Service/Verwaltung/Ausbildung: 16:00–23:00
INSERT INTO shifts (emp_id, emp_name, dept, location, shift_date, shift_from, shift_to, label)
SELECT e.id, e.name, e.dept, 'origami', d.dt, '16:00', '23:00', ''
FROM employees e
CROSS JOIN (VALUES ('2026-04-18'::DATE), ('2026-04-19'::DATE)) AS d(dt)
WHERE e.location = 'origami' AND e.status = 'active'
  AND e.dept IN ('Service', 'Verwaltung', 'Ausbildung');

-- Sa 18.04 + So 19.04 → Küche/Sushi: 15:00–23:00
INSERT INTO shifts (emp_id, emp_name, dept, location, shift_date, shift_from, shift_to, label)
SELECT e.id, e.name, e.dept, 'origami', d.dt, '15:00', '23:00', ''
FROM employees e
CROSS JOIN (VALUES ('2026-04-18'::DATE), ('2026-04-19'::DATE)) AS d(dt)
WHERE e.location = 'origami' AND e.status = 'active'
  AND e.dept IN ('Küche', 'Sushi');

-- Kiểm tra kết quả
SELECT shift_date, COUNT(*) as so_luong_shifts
FROM shifts
WHERE location = 'origami'
  AND shift_date BETWEEN '2026-04-13' AND '2026-04-19'
GROUP BY shift_date ORDER BY shift_date;
