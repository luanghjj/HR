-- ══════════════════════════════════════════════════════════
-- OKYU HRM — User Profiles (liên kết auth.users ↔ employees)
-- File này được SCRIPT tự động tạo ra sau khi chạy:
--   node tools/create_origami_users.js
-- Copy SQL đầu ra từ script → chạy tại đây
-- ══════════════════════════════════════════════════════════
-- Template dưới là ví dụ cấu trúc. UUID thật sẽ khác!
-- Thứ tự emp_id = thứ tự INSERT trong 03_employees_origami.sql:
--   1 = Ibrahim Alakhel
--   2 = Quoc Trung Duong
--   3 = Mohamed Fousseni
--   4 = Besmir Murati
--   5 = Hai My Nguyen
--   6 = Thi Hong Nguyen
--   7 = Mustafa Shirni
--   8 = Nimatullah Stanikzai
--   9 = Thi Huong Nguyen
--  10 = Tuan Hai Nguyen
--  11 = Dinh Son Nguyen
--  12 = Ha Linh Nguyen
--  13 = Chi Linh Nguyen
--  14 = Duc Sieu Nguyen
--  15 = Thanh Ha Nguyen
--  16 = Thi Tuyet Nguyen
--  17 = Van Tung Nguyen
--  18 = Vanessa Paulino
--  19 = Ngoc Anh Pham
--  20 = Ina Rau
--  21 = Quang Tung Truong
--  22 = Hoang Ngoc Minh Vu
--  23 = Thi Ngoc Vu
-- ══════════════════════════════════════════════════════════

-- PASTE OUTPUT TỪ SCRIPT VÀO ĐÂY:
-- (Script sẽ in ra đúng format INSERT bên dưới)

/*
INSERT INTO user_profiles (auth_user_id, user_id, name, role, location, avatar, emp_id) VALUES
  ('UUID-1',  'alakhelihrahim',      'Ibrahim Alakhel',      'mitarbeiter', 'origami', 'IA', 1),
  ('UUID-2',  'duongquoctrung',      'Quoc Trung Duong',     'mitarbeiter', 'origami', 'QD', 2),
  ('UUID-3',  'foussenimohamed',     'Mohamed Fousseni',     'mitarbeiter', 'origami', 'FM', 3),
  ('UUID-4',  'muratibesmir',        'Besmir Murati',        'mitarbeiter', 'origami', 'BM', 4),
  ('UUID-5',  'nguyenhaimy',         'Hai My Nguyen',        'mitarbeiter', 'origami', 'HM', 5),
  ('UUID-6',  'nguyenthihong',       'Thi Hong Nguyen',      'mitarbeiter', 'origami', 'NH', 6),
  ('UUID-7',  'shirnimustafa',       'Mustafa Shirni',       'mitarbeiter', 'origami', 'MS', 7),
  ('UUID-8',  'stanikzainimatullah', 'Nimatullah Stanikzai', 'mitarbeiter', 'origami', 'NI', 8),
  ('UUID-9',  'nguyenthihuong',      'Thi Huong Nguyen',     'mitarbeiter', 'origami', 'HU', 9),
  ('UUID-10', 'nguyentuanhai',       'Tuan Hai Nguyen',      'mitarbeiter', 'origami', 'TU', 10),
  ('UUID-11', 'nguyendinhson',       'Dinh Son Nguyen',      'mitarbeiter', 'origami', 'DS', 11),
  ('UUID-12', 'nguyenhalinh',        'Ha Linh Nguyen',       'mitarbeiter', 'origami', 'HL', 12),
  ('UUID-13', 'nguyenchilinh',       'Chi Linh Nguyen',      'mitarbeiter', 'origami', 'CL', 13),
  ('UUID-14', 'nguyenducsieu',       'Duc Sieu Nguyen',      'mitarbeiter', 'origami', 'DC', 14),
  ('UUID-15', 'nguyenthanhha',       'Thanh Ha Nguyen',      'mitarbeiter', 'origami', 'TH', 15),
  ('UUID-16', 'nguyenthituyet',      'Thi Tuyet Nguyen',     'mitarbeiter', 'origami', 'TY', 16),
  ('UUID-17', 'nguyenvantung',       'Van Tung Nguyen',      'mitarbeiter', 'origami', 'VT', 17),
  ('UUID-18', 'paulinovanessa',      'Vanessa Paulino',      'mitarbeiter', 'origami', 'VP', 18),
  ('UUID-19', 'phamngocanh',         'Ngoc Anh Pham',        'mitarbeiter', 'origami', 'NA', 19),
  ('UUID-20', 'rauina',              'Ina Rau',              'mitarbeiter', 'origami', 'IR', 20),
  ('UUID-21', 'truongquangtung',     'Quang Tung Truong',    'mitarbeiter', 'origami', 'QT', 21),
  ('UUID-22', 'vuhoangngocminh',     'Hoang Ngoc Minh Vu',   'mitarbeiter', 'origami', 'VM', 22),
  ('UUID-23', 'vuthingoc',           'Thi Ngoc Vu',          'mitarbeiter', 'origami', 'VN', 23);
*/

-- ══════════════════════════════════════════════════════════
-- SAU KHI INSERT: Kiểm tra kết quả
-- ══════════════════════════════════════════════════════════

/*
SELECT
  u.name,
  u.role,
  u.user_id,
  u.avatar,
  e.dept,
  e.position,
  e.brutto_gehalt
FROM user_profiles u
LEFT JOIN employees e ON e.id = u.emp_id
WHERE u.location = 'origami'
ORDER BY u.name;
*/
