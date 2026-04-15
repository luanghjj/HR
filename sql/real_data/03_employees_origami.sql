-- ══════════════════════════════════════════════════════════
-- OKYU HRM — 23 Nhân Viên Origami (Dữ liệu thật)
-- Chạy SAU 02_setup_origami.sql
-- ══════════════════════════════════════════════════════════
-- Ghi chú:
--   dept     → tạm thời, có thể chỉnh lại trong app
--   position → tạm thời theo loại hợp đồng
--   vac_total → Vollzeit/Teilzeit: 26, Azubi: 24, Minijob: 0
--   soll_stunden → Vollzeit: 169, Teilzeit: 86, Minijob: 0, Azubi: 169
--   ⚠ Duong Quoc Trung: không có ngày vào → dùng '2024-01-01' tạm
-- ══════════════════════════════════════════════════════════

INSERT INTO employees
  (name, location, dept, position, status, start_date, avatar,
   vac_total, vac_used, sick_days, late_count, soll_stunden,
   brutto_gehalt, schule_tage, birthday, prob_end)
VALUES

-- ─── Vollzeit ───
('Ibrahim Alakhel',      'origami', 'Küche',      'Koch',         'active', '2024-11-27', 'IA', 26, 0, 0, 0, 169, 3400.00, 0, '1991-01-01',  NULL),
('Quoc Trung Duong',     'origami', 'Küche',      'Koch',         'active', '2024-01-01', 'QD', 26, 0, 0, 0, 169, 2800.00, 0, NULL,          NULL), -- ⚠ ngày vào tạm
('Mohamed Fousseni',     'origami', 'Küche',      'Koch',         'active', '2021-11-05', 'FM', 26, 0, 0, 0, 169, 2800.00, 0, '1988-05-08',  NULL),
('Besmir Murati',        'origami', 'Verwaltung', 'Manager',      'active', '2024-12-03', 'BM', 28, 0, 0, 0, 169, 4000.00, 0, NULL,          NULL),
('Hai My Nguyen',        'origami', 'Verwaltung', 'Manager',      'active', '2024-11-15', 'HM', 30, 0, 0, 0, 169, 5700.00, 0, '1991-11-14',  NULL),
('Thi Hong Nguyen',      'origami', 'Verwaltung', 'Manager',      'active', '2024-12-03', 'NH', 30, 0, 0, 0, 169, 5000.00, 0, NULL,          NULL),
('Mustafa Shirni',       'origami', 'Küche',      'Koch',         'active', '2025-01-03', 'MS', 26, 0, 0, 0, 169, 2400.00, 0, '1983-08-21',  NULL),
('Nimatullah Stanikzai', 'origami', 'Küche',      'Koch',         'active', '2026-03-15', 'NI', 26, 0, 0, 0, 169, 2800.00, 0, '1998-01-01',  '2026-09-15'),

-- ─── Teilzeit ───
('Thi Huong Nguyen',     'origami', 'Service',    'Mitarbeiterin','active', '2025-06-01', 'HU', 26, 0, 0, 0, 86,  1250.00, 0, '2000-01-14',  NULL),
('Tuan Hai Nguyen',      'origami', 'Service',    'Mitarbeiter',  'active', '2025-06-01', 'TU', 26, 0, 0, 0, 86,  1250.00, 0, '1995-08-13',  NULL),

-- ─── Azubi ───
('Dinh Son Nguyen',      'origami', 'Ausbildung', 'Azubi',        'active', '2024-10-01', 'DS', 24, 0, 0, 0, 169, 1255.00, 2, NULL,          NULL),
('Ha Linh Nguyen',       'origami', 'Ausbildung', 'Azubi',        'active', '2025-11-10', 'HL', 24, 0, 0, 0, 169,  955.00, 2, NULL,          NULL),

-- ─── Minijob / Aushilfe ───
('Chi Linh Nguyen',      'origami', 'Service',    'Aushilfe',     'active', '2025-04-01', 'CL', 0,  0, 0, 0, 0,    603.00, 0, NULL,          NULL),
('Duc Sieu Nguyen',      'origami', 'Service',    'Aushilfe',     'active', '2026-01-01', 'DC', 0,  0, 0, 0, 0,    603.00, 0, NULL,          NULL),
('Thanh Ha Nguyen',      'origami', 'Service',    'Aushilfe',     'active', '2025-11-21', 'TH', 0,  0, 0, 0, 0,    600.00, 0, NULL,          NULL),
('Thi Tuyet Nguyen',     'origami', 'Service',    'Aushilfe',     'active', '2026-02-01', 'TY', 0,  0, 0, 0, 0,    603.00, 0, NULL,          NULL),
('Van Tung Nguyen',      'origami', 'Service',    'Aushilfe',     'active', '2026-01-01', 'VT', 0,  0, 0, 0, 0,    603.00, 0, '1994-10-14',  NULL),
('Vanessa Paulino',      'origami', 'Service',    'Aushilfe',     'active', '2026-01-01', 'VP', 0,  0, 0, 0, 0,    600.00, 0, '1991-01-10',  NULL),
('Ngoc Anh Pham',        'origami', 'Service',    'Aushilfe',     'active', '2025-05-01', 'NA', 0,  0, 0, 0, 0,    603.00, 0, NULL,          NULL),
('Ina Rau',              'origami', 'Service',    'Aushilfe',     'active', '2023-05-02', 'IR', 0,  0, 0, 0, 0,    520.00, 0, '1976-01-01',  NULL),
('Quang Tung Truong',    'origami', 'Service',    'Aushilfe',     'active', '2025-12-17', 'QT', 0,  0, 0, 0, 0,    603.00, 0, '2005-07-17',  NULL),
('Hoang Ngoc Minh Vu',   'origami', 'Service',    'Aushilfe',     'active', '2024-12-03', 'VM', 0,  0, 0, 0, 0,    603.00, 0, '2001-03-16',  NULL),
('Thi Ngoc Vu',          'origami', 'Service',    'Aushilfe',     'active', '2025-03-04', 'VN', 0,  0, 0, 0, 0,    603.00, 0, '2005-01-16',  NULL);

-- Reset sequence
SELECT setval('employees_id_seq', COALESCE((SELECT MAX(id) FROM employees), 1));

-- Kiểm tra
SELECT COUNT(*) AS total_employees FROM employees;
SELECT dept, COUNT(*) FROM employees GROUP BY dept ORDER BY dept;
