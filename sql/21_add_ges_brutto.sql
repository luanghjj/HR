-- Add ges_brutto column for actual gross salary (GES.-BRUTTO from GM)
ALTER TABLE employees ADD COLUMN IF NOT EXISTS ges_brutto NUMERIC(10,2) DEFAULT 0;
