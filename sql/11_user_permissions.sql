-- ═══════════════════════════════════════════════════════════
-- OKYU HRM – Granular User Permissions
-- Allows per-user custom permissions beyond role defaults
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS user_permissions (
  id                BIGSERIAL PRIMARY KEY,
  user_id           TEXT NOT NULL UNIQUE,
  mode              TEXT NOT NULL DEFAULT 'standard' CHECK (mode IN ('standard', 'custom')),
  -- 'standard' = use PERMS[role] defaults
  -- 'custom'   = use permissions JSONB below

  permissions       JSONB DEFAULT '{}',
  -- Example: {"seeAllEmployees": true, "editEmployees": false, ...}

  allowed_locations  JSONB DEFAULT '["all"]',
  -- Example: ["origami", "enso"] or ["all"]

  allowed_depts      JSONB DEFAULT '["all"]',
  -- Example: ["Küche", "Service"] or ["all"]

  updated_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_by         TEXT
);

-- RLS
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

-- Everyone can read (needed for login flow)
DROP POLICY IF EXISTS "read_all_permissions" ON user_permissions;
CREATE POLICY "read_all_permissions" ON user_permissions
  FOR SELECT USING (true);

-- Everyone can insert/update/delete (SuperAdmin uses anon key)
DROP POLICY IF EXISTS "manage_permissions" ON user_permissions;
CREATE POLICY "manage_permissions" ON user_permissions
  FOR ALL USING (true) WITH CHECK (true);

-- Index
CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id ON user_permissions(user_id);

SELECT 'user_permissions table created!' AS result;
