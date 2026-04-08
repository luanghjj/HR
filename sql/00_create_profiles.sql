-- Tạo user_profiles cho 6 auth users hiện có
TRUNCATE user_profiles;

INSERT INTO user_profiles (auth_user_id, user_id, name, role, location, avatar, emp_id) VALUES
  ('b50d27af-c39f-431b-8ec9-480a77a21f30', 'emp_linh',    'Linh Nguyen',  'inhaber',     'okyu_central', 'LN', 1),
  ('345fb42d-cd7a-4e05-b5ed-0d35d769f921', 'emp_yuki',    'Yuki Tanaka',  'manager',     'origami',      'YT', 2),
  ('aea5d0bc-224e-472a-a125-6295d016192b', 'emp_sarah',   'Sarah Klein',  'manager',     'enso',         'SK', 7),
  ('b9c37f23-5f76-41d1-aca8-29bcc8b09365', 'emp_anna',    'Anna Schmidt', 'mitarbeiter', 'origami',      'AS', 3),
  ('aa96de1e-80eb-4e71-8c83-18ca87a1f44d', 'emp_kevin',   'Kevin Pham',   'mitarbeiter', 'origami',      'KP', 5),
  ('cf5ba57c-6d7e-41a3-978d-b818b8a54c84', 'emp_julia',   'Max Weber',    'azubi',       'origami',      'MW', 4);

-- Kiểm tra
SELECT name, role, location, emp_id FROM user_profiles ORDER BY role;
