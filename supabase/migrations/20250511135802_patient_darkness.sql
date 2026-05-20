/*
  # Add type column to announcements table

  1. Changes
    - Add 'type' column to announcements table with text data type
    - Set default value to 'general' for existing rows
    - Make the column non-nullable

  2. Notes
    - Uses a safe migration approach with IF NOT EXISTS check
    - Sets a default value to ensure data consistency
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'announcements' 
    AND column_name = 'type'
  ) THEN
    ALTER TABLE announcements 
    ADD COLUMN type text NOT NULL DEFAULT 'general';
  END IF;
END $$;