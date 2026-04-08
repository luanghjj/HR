-- ═══════════════════════════════════════════════════════════
-- OKYU HRM – FULL RESET + 4 Auth Users + 10 Mitarbeiter
-- Chạy TOÀN BỘ trong Supabase Dashboard → SQL Editor
-- KHÔNG CẦN LÀM GÌ THÊM – tất cả tự động!
-- ═══════════════════════════════════════════════════════════

-- ─── BƯỚC 1: XOÁ SẠCH TẤT CẢ ───
TRUNCATE shifts CASCADE;
TRUNCATE ausbildungsnachweise CASCADE;
TRUNCATE azubi_bewertungen CASCADE;
TRUNCATE schule_schedule CASCADE;
TRUNCATE documents CASCADE;
TRUNCATE sick_leaves CASCADE;
TRUNCATE vacations CASCADE;
TRUNCATE employees CASCADE;
TRUNCATE user_profiles CASCADE;

ALTER SEQUENCE employees_id_seq RESTART WITH 1;
ALTER SEQUENCE vacations_id_seq RESTART WITH 1;
ALTER SEQUENCE sick_leaves_id_seq RESTART WITH 1;
ALTER SEQUENCE documents_id_seq RESTART WITH 1;
ALTER SEQUENCE shifts_id_seq RESTART WITH 1;
ALTER SEQUENCE schule_schedule_id_seq RESTART WITH 1;
ALTER SEQUENCE ausbildungsnachweise_id_seq RESTART WITH 1;
ALTER SEQUENCE azubi_bewertungen_id_seq RESTART WITH 1;

-- ─── BƯỚC 2: XOÁ AUTH USERS CŨ ───
DELETE FROM auth.users;

-- ─── BƯỚC 3: TẠO 4 AUTH USERS ───
INSERT INTO auth.users (
  instance_id, id, aud, role, email,
  encrypted_password,
  email_confirmed_at, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new,
  raw_app_meta_data, raw_user_meta_data
) VALUES
-- 1. Inhaber: inhaber@okyu.de / Okyu2026!
(
  '00000000-0000-0000-0000-000000000000',
  'a1111111-1111-1111-1111-111111111111',
  'authenticated', 'authenticated',
  'inhaber@okyu.de',
  crypt('Okyu2026!', gen_salt('bf')),
  NOW(), NOW(), NOW(),
  '', '', '',
  '{"provider":"email","providers":["email"]}',
  '{"name":"Linh Nguyen"}'
),
-- 2. Manager: manager@okyu.de / Okyu2026!
(
  '00000000-0000-0000-0000-000000000000',
  'b2222222-2222-2222-2222-222222222222',
  'authenticated', 'authenticated',
  'manager@okyu.de',
  crypt('Okyu2026!', gen_salt('bf')),
  NOW(), NOW(), NOW(),
  '', '', '',
  '{"provider":"email","providers":["email"]}',
  '{"name":"Yuki Tanaka"}'
),
-- 3. Mitarbeiter: anna@okyu.de / Okyu2026!
(
  '00000000-0000-0000-0000-000000000000',
  'c3333333-3333-3333-3333-333333333333',
  'authenticated', 'authenticated',
  'anna@okyu.de',
  crypt('Okyu2026!', gen_salt('bf')),
  NOW(), NOW(), NOW(),
  '', '', '',
  '{"provider":"email","providers":["email"]}',
  '{"name":"Anna Schmidt"}'
),
-- 4. Azubi: azubi@okyu.de / Okyu2026!
(
  '00000000-0000-0000-0000-000000000000',
  'd4444444-4444-4444-4444-444444444444',
  'authenticated', 'authenticated',
  'azubi@okyu.de',
  crypt('Okyu2026!', gen_salt('bf')),
  NOW(), NOW(), NOW(),
  '', '', '',
  '{"provider":"email","providers":["email"]}',
  '{"name":"Max Weber"}'
);

-- Auth identities (email is generated column – do NOT include it)
INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at) VALUES
  (gen_random_uuid(), 'a1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111',
   '{"sub":"a1111111-1111-1111-1111-111111111111","email":"inhaber@okyu.de","email_verified":true}', 'email', NOW(), NOW(), NOW()),
  (gen_random_uuid(), 'b2222222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222',
   '{"sub":"b2222222-2222-2222-2222-222222222222","email":"manager@okyu.de","email_verified":true}', 'email', NOW(), NOW(), NOW()),
  (gen_random_uuid(), 'c3333333-3333-3333-3333-333333333333', 'c3333333-3333-3333-3333-333333333333',
   '{"sub":"c3333333-3333-3333-3333-333333333333","email":"anna@okyu.de","email_verified":true}', 'email', NOW(), NOW(), NOW()),
  (gen_random_uuid(), 'd4444444-4444-4444-4444-444444444444', 'd4444444-4444-4444-4444-444444444444',
   '{"sub":"d4444444-4444-4444-4444-444444444444","email":"azubi@okyu.de","email_verified":true}', 'email', NOW(), NOW(), NOW());

-- ─── BƯỚC 4: USER PROFILES (liên kết auth → employee) ───
INSERT INTO user_profiles (auth_user_id, user_id, name, role, location, avatar, emp_id) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'emp_linh_nguyen',  'Linh Nguyen',  'inhaber',      'okyu_central', 'LN', 1),
  ('b2222222-2222-2222-2222-222222222222', 'emp_yuki_tanaka',  'Yuki Tanaka',  'manager',      'origami',      'YT', 2),
  ('c3333333-3333-3333-3333-333333333333', 'emp_anna_schmidt', 'Anna Schmidt', 'mitarbeiter',  'origami',      'AS', 3),
  ('d4444444-4444-4444-4444-444444444444', 'emp_max_weber',    'Max Weber',    'azubi',        'origami',      'MW', 4);

-- ─── BƯỚC 5: DEPARTMENTS (mit Sushi!) ───
TRUNCATE departments CASCADE;
ALTER SEQUENCE departments_id_seq RESTART WITH 1;
INSERT INTO departments (name, location, head, count, color) VALUES
  ('Sushi',       'origami',      'Yuki Tanaka',  2, '#e84393'),
  ('Küche',       'origami',      'Tuan Le',      2, '#fdcb6e'),
  ('Service',     'origami',      'Anna Schmidt', 2, '#74b9ff'),
  ('Bar',         'origami',      'Kevin Pham',   1, '#00b894'),
  ('Ausbildung',  'origami',      'Yuki Tanaka',  1, '#e17055'),
  ('Sushi',       'enso',         'Minh Tran',    2, '#e84393'),
  ('Küche',       'enso',         'Hana Yamamoto',1, '#fdcb6e'),
  ('Service',     'enso',         'Sarah Klein',  2, '#74b9ff'),
  ('Ausbildung',  'enso',         'Sarah Klein',  1, '#e17055'),
  ('Verwaltung',  'okyu_central', 'Linh Nguyen',  1, '#a29bfe');

-- ─── BƯỚC 6: 10 NHÂN VIÊN ───

-- === OKYU ZENTRALE ===
INSERT INTO employees (id, name, location, dept, position, status, start_date, avatar, vac_total, vac_used, sick_days, late_count, soll_stunden, brutto_gehalt, schule_tage, birthday)
VALUES (1, 'Linh Nguyen', 'okyu_central', 'Verwaltung', 'Geschäftsführer', 'active', '2024-01-01', 'LN', 30, 0, 0, 0, 160, 5000, 0, '1990-05-15');

-- === ORIGAMI SUSHI – Göppingen ===
INSERT INTO employees (id, name, location, dept, position, status, start_date, avatar, vac_total, vac_used, sick_days, late_count, soll_stunden, brutto_gehalt, schule_tage, birthday)
VALUES (2, 'Yuki Tanaka', 'origami', 'Sushi', 'Sushi-Meister', 'active', '2024-06-01', 'YT', 28, 2, 1, 0, 170, 3500, 0, '1988-11-22');

INSERT INTO employees (id, name, location, dept, position, status, start_date, avatar, vac_total, vac_used, sick_days, late_count, soll_stunden, brutto_gehalt, schule_tage, birthday)
VALUES (3, 'Anna Schmidt', 'origami', 'Service', 'Kellnerin', 'active', '2025-02-01', 'AS', 26, 3, 0, 1, 120, 2200, 0, '1997-03-10');

INSERT INTO employees (id, name, location, dept, position, status, start_date, avatar, vac_total, vac_used, sick_days, late_count, soll_stunden, brutto_gehalt, schule_tage, birthday)
VALUES (4, 'Max Weber', 'origami', 'Ausbildung', 'Azubi Koch', 'active', '2025-09-01', 'MW', 25, 0, 0, 0, 160, 1100, 2, '2006-08-20');

INSERT INTO employees (id, name, location, dept, position, status, start_date, avatar, vac_total, vac_used, sick_days, late_count, soll_stunden, brutto_gehalt, schule_tage, birthday)
VALUES (5, 'Kevin Pham', 'origami', 'Bar', 'Barkeeper', 'active', '2024-09-15', 'KP', 26, 1, 2, 0, 140, 2400, 0, '1995-07-03');

INSERT INTO employees (id, name, location, dept, position, status, start_date, avatar, vac_total, vac_used, sick_days, late_count, soll_stunden, brutto_gehalt, schule_tage, birthday)
VALUES (6, 'Tuan Le', 'origami', 'Küche', 'Koch', 'active', '2025-01-15', 'TL', 26, 0, 1, 0, 160, 2600, 0, '1994-09-12');

-- === ENSO SUSHI & GRILL – Stuttgart ===
INSERT INTO employees (id, name, location, dept, position, status, start_date, avatar, vac_total, vac_used, sick_days, late_count, soll_stunden, brutto_gehalt, schule_tage, birthday)
VALUES (7, 'Sarah Klein', 'enso', 'Service', 'Restaurantleiterin', 'active', '2024-03-01', 'SK', 28, 4, 1, 0, 170, 3200, 0, '1992-12-08');

INSERT INTO employees (id, name, location, dept, position, status, start_date, avatar, vac_total, vac_used, sick_days, late_count, soll_stunden, brutto_gehalt, schule_tage, birthday)
VALUES (8, 'Minh Tran', 'enso', 'Sushi', 'Sushi-Koch', 'active', '2024-08-01', 'MT', 26, 0, 3, 2, 160, 2800, 0, '1993-04-18');

INSERT INTO employees (id, name, location, dept, position, status, start_date, avatar, vac_total, vac_used, sick_days, late_count, soll_stunden, brutto_gehalt, schule_tage, birthday)
VALUES (9, 'Hana Yamamoto', 'enso', 'Küche', 'Köchin', 'active', '2025-03-01', 'HY', 26, 0, 0, 0, 150, 2500, 0, '1996-06-30');

INSERT INTO employees (id, name, location, dept, position, status, start_date, avatar, vac_total, vac_used, sick_days, late_count, soll_stunden, brutto_gehalt, schule_tage, birthday)
VALUES (10, 'Nina Richter', 'enso', 'Ausbildung', 'Azubi Restaurantfach', 'active', '2025-09-01', 'NR', 25, 0, 0, 1, 160, 1100, 2, '2007-01-25');

ALTER SEQUENCE employees_id_seq RESTART WITH 11;

-- ─── BƯỚC 7: BERUFSSCHULE für Azubis ───
INSERT INTO schule_schedule (emp_id, wochentag, schule, klasse, von, bis) VALUES
  (4, 'Montag',    'Fritz-Erler-Schule Pforzheim', 'NK3a', '08:00', '15:00'),
  (4, 'Dienstag',  'Fritz-Erler-Schule Pforzheim', 'NK3a', '08:00', '13:00'),
  (10, 'Mittwoch',  'Louis-Leitz-Schule Stuttgart', 'RS2b', '08:00', '15:30'),
  (10, 'Donnerstag','Louis-Leitz-Schule Stuttgart', 'RS2b', '08:00', '13:00');

-- ═══════════════════════════════════════════════════════════
-- ✅ XONG! Tất cả đã sẵn sàng.
--
-- 4 tài khoản login (password chung: Okyu2026!):
--
-- 📧 inhaber@okyu.de  → 👑 Inhaber    → Linh Nguyen  (emp_id=1)
-- 📧 manager@okyu.de  → 🏢 Manager    → Yuki Tanaka  (emp_id=2)
-- 📧 anna@okyu.de     → 👤 Mitarbeiter → Anna Schmidt (emp_id=3)
-- 📧 azubi@okyu.de    → 🎓 Azubi      → Max Weber    (emp_id=4)
-- ═══════════════════════════════════════════════════════════
