-- Add icon column to groups table
ALTER TABLE groups ADD COLUMN IF NOT EXISTS icon VARCHAR(10);
