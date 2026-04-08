-- Fix: bỏ cột email (nó tự generate)
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider,
  last_sign_in_at, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'a1111111-1111-1111-1111-111111111111',
  'a1111111-1111-1111-1111-111111111111',
  '{"sub":"a1111111-1111-1111-1111-111111111111","email":"inhaber@okyu.de","email_verified":true}',
  'email',
  NOW(), NOW(), NOW()
);

-- 3 users còn lại
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, confirmation_token, recovery_token, email_change_token_new)
VALUES
('00000000-0000-0000-0000-000000000000', 'b2222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated', 'manager@okyu.de', crypt('Okyu2026!', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Yuki Tanaka"}', false, '', '', ''),
('00000000-0000-0000-0000-000000000000', 'c3333333-3333-3333-3333-333333333333', 'authenticated', 'authenticated', 'anna@okyu.de', crypt('Okyu2026!', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Anna Schmidt"}', false, '', '', ''),
('00000000-0000-0000-0000-000000000000', 'd4444444-4444-4444-4444-444444444444', 'authenticated', 'authenticated', 'azubi@okyu.de', crypt('Okyu2026!', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Max Weber"}', false, '', '', '');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at) VALUES
(gen_random_uuid(), 'b2222222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222', '{"sub":"b2222222-2222-2222-2222-222222222222","email":"manager@okyu.de","email_verified":true}', 'email', NOW(), NOW(), NOW()),
(gen_random_uuid(), 'c3333333-3333-3333-3333-333333333333', 'c3333333-3333-3333-3333-333333333333', '{"sub":"c3333333-3333-3333-3333-333333333333","email":"anna@okyu.de","email_verified":true}', 'email', NOW(), NOW(), NOW()),
(gen_random_uuid(), 'd4444444-4444-4444-4444-444444444444', 'd4444444-4444-4444-4444-444444444444', '{"sub":"d4444444-4444-4444-4444-444444444444","email":"azubi@okyu.de","email_verified":true}', 'email', NOW(), NOW(), NOW());

-- Kiểm tra
SELECT email, email_confirmed_at IS NOT NULL as confirmed FROM auth.users ORDER BY email;
