/*
  # Add date column to announcements table

  1. Changes
    - Add `date` column to `announcements` table
    - Set default value to current date
    - Backfill existing rows with formatted date from created_at

  2. Notes
    - The date column will store the formatted date string (DD.MM.YYYY)
    - New announcements will automatically get the current date
*/

-- Add the date column
ALTER TABLE announcements 
ADD COLUMN IF NOT EXISTS date text;

-- Update existing rows to set date from created_at
UPDATE announcements 
SET date = to_char(created_at AT TIME ZONE 'UTC', 'DD.MM.YYYY')
WHERE date IS NULL;

-- Set default value for new rows
ALTER TABLE announcements 
ALTER COLUMN date SET DEFAULT to_char(CURRENT_DATE, 'DD.MM.YYYY');

-- Make the column NOT NULL after setting values for existing rows
ALTER TABLE announcements 
ALTER COLUMN date SET NOT NULL;