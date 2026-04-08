-- Add file columns to documents table
ALTER TABLE documents
  ADD COLUMN IF NOT EXISTS file_url TEXT,
  ADD COLUMN IF NOT EXISTS file_size INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS file_name TEXT;

-- Add AU columns to sick_leaves table
ALTER TABLE sick_leaves
  ADD COLUMN IF NOT EXISTS au_url TEXT;

-- Add vac_half column to shifts table
ALTER TABLE shifts
  ADD COLUMN IF NOT EXISTS vac_half BOOLEAN DEFAULT false;
