-- ══════════════════════════════════════════════════════════
-- OKYU HRM — Shift Templates cho Origami (lịch thật)
-- Chạy tại: Supabase SQL Editor
-- ══════════════════════════════════════════════════════════
-- Cấu trúc JSONB shifts: [{dept, from, to, label}]
-- Pause 15:00–17:00 KHÔNG lưu → không hiển thị
-- ══════════════════════════════════════════════════════════

-- Cho phép anon key đọc (terminal không cần login)
DROP POLICY IF EXISTS "templates_read_anon" ON shift_templates;
CREATE POLICY "templates_read_anon" ON shift_templates
  FOR SELECT TO anon USING (true);

-- Xóa templates Origami cũ
DELETE FROM shift_templates WHERE location = 'origami';

-- ─── Thứ 2: FREI ───
INSERT INTO shift_templates (location, name, shifts) VALUES
('origami', 'Origami Mo (Frei)', '[]');

-- ─── Thứ 3–5: 10:30–15:00 / 17:00–22:00 ───
INSERT INTO shift_templates (location, name, shifts) VALUES
('origami', 'Origami Di-Do', '[
  {"dept":"Alle","from":"10:30","to":"15:00","label":"Vormittag"},
  {"dept":"Alle","from":"17:00","to":"22:00","label":"Abend"}
]');

-- ─── Thứ 6: 11:30–15:00 / 17:00–23:00 ───
INSERT INTO shift_templates (location, name, shifts) VALUES
('origami', 'Origami Fr', '[
  {"dept":"Alle","from":"11:30","to":"15:00","label":"Vormittag"},
  {"dept":"Alle","from":"17:00","to":"23:00","label":"Abend"}
]');

-- ─── Thứ 7 + CN: Service 16–23 / Küche+Sushi 15–23 ───
INSERT INTO shift_templates (location, name, shifts) VALUES
('origami', 'Origami Sa-So', '[
  {"dept":"Service","from":"16:00","to":"23:00","label":"Abend"},
  {"dept":"Küche",  "from":"15:00","to":"23:00","label":"Ganztags"},
  {"dept":"Sushi",  "from":"15:00","to":"23:00","label":"Ganztags"}
]');

-- Kiểm tra
SELECT id, name, shifts FROM shift_templates
WHERE location = 'origami'
ORDER BY id;
