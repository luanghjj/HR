-- Thêm banner_url cho dashboard background mỗi user
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS banner_url TEXT;
