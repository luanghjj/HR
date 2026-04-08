-- ═══════════════════════════════════════════════════════════
-- TẠO AUTH USERS – CHẠY TỪNG BƯỚC
-- ═══════════════════════════════════════════════════════════

-- Bước 1: Đảm bảo pgcrypto có sẵn
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Bước 2: Tạo 1 user test trước
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  recovery_token,
  email_change_token_new
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a1111111-1111-1111-1111-111111111111',
  'authenticated',
  'authenticated',
  'inhaber@okyu.de',
  crypt('Okyu2026!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Linh Nguyen"}',
  false,
  '',
  '',
  ''
);
