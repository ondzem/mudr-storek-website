/*
  # Add vacation date columns to announcements table
  
  1. Changes
    - Add vacationStart and vacationEnd columns for tracking vacation periods
    - Update type column to handle vacation announcements
  
  2. Security
    - Maintain existing RLS policies
    - Keep all existing data intact
*/

-- Add vacation date columns if they don't exist
DO $$ 
BEGIN
  -- Add vacationStart column
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'announcements' 
    AND column_name = 'vacation_start'
  ) THEN
    ALTER TABLE announcements 
    ADD COLUMN vacation_start date;
  END IF;

  -- Add vacationEnd column
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'announcements' 
    AND column_name = 'vacation_end'
  ) THEN
    ALTER TABLE announcements 
    ADD COLUMN vacation_end date;
  END IF;

  -- Update type column to allow vacation type
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'announcements' 
    AND column_name = 'type'
  ) THEN
    ALTER TABLE announcements 
    ALTER COLUMN type SET DEFAULT 'announcement';
  END IF;
END $$;