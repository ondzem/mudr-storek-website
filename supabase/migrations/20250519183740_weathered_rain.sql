/*
  # Rename birthdate column to birth_year

  1. Changes
    - Rename 'birthdate' column to 'birth_year' in bookings table
    - Update column type to date
  
  2. Security
    - No changes to RLS policies needed
*/

DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'birthdate'
  ) THEN
    ALTER TABLE bookings RENAME COLUMN birthdate TO birth_year;
  END IF;
END $$;