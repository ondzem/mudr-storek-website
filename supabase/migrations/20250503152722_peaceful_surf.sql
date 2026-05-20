/*
  # Add note column to bookings table

  1. Changes
    - Add `note` column to the `bookings` table
      - This column was referenced in the code but missing in the database schema
      - The column is nullable to maintain compatibility with existing code
*/

-- Add the note column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'note'
  ) THEN
    ALTER TABLE bookings ADD COLUMN note text;
  END IF;
END $$;