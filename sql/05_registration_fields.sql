-- ═══════════════════════════════════════════════════════════
-- Add registration fields to user_profiles
-- Run in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════

-- Add status column (pending/active/rejected)
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Add registration data columns
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS reg_birthday DATE;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS reg_dept TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS reg_position TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS reg_email TEXT;

-- Set existing users to 'active'
UPDATE user_profiles SET status = 'active' WHERE status IS NULL;

SELECT 'Done! Registration fields added.' as result;
