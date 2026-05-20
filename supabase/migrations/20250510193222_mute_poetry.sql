/*
  # Fix announcements ordering and display
  
  1. Changes
    - Drop existing index
    - Create new index for proper ordering
    - Add NOT NULL constraints where needed
  
  2. Security
    - Maintain existing RLS policies
*/

-- Drop existing index
DROP INDEX IF EXISTS idx_announcements_active;

-- Add NOT NULL constraints
ALTER TABLE announcements 
  ALTER COLUMN active SET NOT NULL,
  ALTER COLUMN priority SET NOT NULL;

-- Create new composite index for proper ordering
CREATE INDEX idx_announcements_ordering ON announcements(
  active DESC,
  priority DESC,
  created_at DESC
);