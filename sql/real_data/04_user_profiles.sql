-- ══════════════════════════════════════════════════════════
-- OKYU HRM — User Profiles (UUID thật từ Supabase Auth)
-- Generated: 2026-04-15
-- Chạy tại: Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════════════════
-- Chạy SAU khi đã insert employees (03_employees_origami.sql)
-- emp_id 1–23 khớp với thứ tự INSERT trong file employees
-- ══════════════════════════════════════════════════════════

INSERT INTO user_profiles (auth_user_id, user_id, name, role, location, avatar, emp_id) VALUES
  ('39c8cf41-61ed-43d6-bdaa-a246967eee11', 'alakhelihrahim',      'Ibrahim Alakhel',      'mitarbeiter', 'origami', 'IA', 1),
  ('e6c1bf9e-22ec-46f6-a5fe-1cb35cffdd73', 'duongquoctrung',      'Quoc Trung Duong',     'mitarbeiter', 'origami', 'QD', 2),
  ('1a33ec33-8c93-49ea-bb48-82fe9989f4a5', 'foussenimohamed',     'Mohamed Fousseni',     'mitarbeiter', 'origami', 'FM', 3),
  ('a3ce1fbf-4693-4111-bc46-a4e14048e00d', 'muratibesmir',        'Besmir Murati',        'mitarbeiter', 'origami', 'BM', 4),
  ('28cb0b55-80e1-45e8-9b01-ce838a3cbf95', 'nguyenhaimy',         'Hai My Nguyen',        'mitarbeiter', 'origami', 'HM', 5),
  ('a7a0c29c-c83a-44f0-857c-1ad76e1e8f28', 'nguyenthihong',       'Thi Hong Nguyen',      'mitarbeiter', 'origami', 'NH', 6),
  ('debe45fc-1dcb-46b6-80e7-64cebeee8f21', 'shirnimustafa',       'Mustafa Shirni',       'mitarbeiter', 'origami', 'MS', 7),
  ('38542f81-5856-4b06-be3a-c7e1bedbf264', 'stanikzainimatullah', 'Nimatullah Stanikzai', 'mitarbeiter', 'origami', 'NI', 8),
  ('f028159a-025b-443b-a573-a5571c9d2b29', 'nguyenthihuong',      'Thi Huong Nguyen',     'mitarbeiter', 'origami', 'HU', 9),
  ('66f83fde-0ff3-47c2-bfba-c93e45ee887e', 'nguyentuanhai',       'Tuan Hai Nguyen',      'mitarbeiter', 'origami', 'TU', 10),
  ('b13494ac-a226-45b8-84ab-8d61b7d0a73d', 'nguyendinhson',       'Dinh Son Nguyen',      'mitarbeiter', 'origami', 'DS', 11),
  ('7658bd4e-8497-4003-a8b1-c068b2a1ee57', 'nguyenhalinh',        'Ha Linh Nguyen',       'mitarbeiter', 'origami', 'HL', 12),
  ('11fd2f6f-c990-4e87-afe2-6b69f1ab09c2', 'nguyenchilinh',       'Chi Linh Nguyen',      'mitarbeiter', 'origami', 'CL', 13),
  ('36842482-3356-4438-bd23-a2a21569caae', 'nguyenducsieu',       'Duc Sieu Nguyen',      'mitarbeiter', 'origami', 'DC', 14),
  ('5ef2e32c-1d19-42ab-9acd-f508f0014139', 'nguyenthanhha',       'Thanh Ha Nguyen',      'mitarbeiter', 'origami', 'TH', 15),
  ('2253cf61-33a3-4415-bf7a-6bba9bad1d07', 'nguyenthituyet',      'Thi Tuyet Nguyen',     'mitarbeiter', 'origami', 'TY', 16),
  ('8419ca58-b910-4562-bf66-b54bf4f0a5e2', 'nguyenvantung',       'Van Tung Nguyen',      'mitarbeiter', 'origami', 'VT', 17),
  ('2786043f-b503-4371-8c1a-dd0f52aa421a', 'paulinovanessa',      'Vanessa Paulino',      'mitarbeiter', 'origami', 'VP', 18),
  ('97ac0bb8-e22b-4cb6-803b-c46833d3b13e', 'phamngocanh',         'Ngoc Anh Pham',        'mitarbeiter', 'origami', 'NA', 19),
  ('1360b389-29ed-47a1-a618-0180681bed2f', 'rauina',              'Ina Rau',              'mitarbeiter', 'origami', 'IR', 20),
  ('71551181-fd6c-48f7-9fc7-72e592ae128a', 'truongquangtung',     'Quang Tung Truong',    'mitarbeiter', 'origami', 'QT', 21),
  ('cdd2bd4a-1e43-483a-be8a-0328d6559ac3', 'vuhoangngocminh',     'Hoang Ngoc Minh Vu',   'mitarbeiter', 'origami', 'VM', 22),
  ('3c4a639a-d711-4c1a-a52f-ff8d42688cd3', 'vuthingoc',           'Thi Ngoc Vu',          'mitarbeiter', 'origami', 'VN', 23);

-- Reset sequence
SELECT setval('user_profiles_id_seq', COALESCE((SELECT MAX(id) FROM user_profiles), 1));

-- ══════════════════════════════════════════════════════════
-- KIỂM TRA SAU KHI INSERT
-- ══════════════════════════════════════════════════════════

SELECT
  u.name,
  u.user_id,
  u.role,
  u.avatar,
  e.dept,
  e.position,
  e.brutto_gehalt
FROM user_profiles u
LEFT JOIN employees e ON e.id = u.emp_id
WHERE u.location = 'origami'
ORDER BY u.name;
