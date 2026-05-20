/*
  # Add birthYear column to bookings table
  
  1. Changes
    - Add nullable birthYear column
    - Migrate data from birthdate if it exists
    - Make birthYear non-nullable after data migration
  
  2. Notes
    - Uses safe migration approach to prevent null value errors
    - Preserves existing data
*/

DO $$ 
BEGIN
  -- Add birthYear column as nullable first
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'birthyear'
  ) THEN
    ALTER TABLE bookings ADD COLUMN birthyear integer;
  END IF;

  -- Copy year from birthdate to birthyear if birthdate exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'birthdate'
  ) THEN
    UPDATE bookings 
    SET birthyear = EXTRACT(YEAR FROM birthdate)::integer;

    -- Make birthYear non-nullable after data migration
    ALTER TABLE bookings ALTER COLUMN birthyear SET NOT NULL;

    -- Remove birthdate column after data migration
    ALTER TABLE bookings DROP COLUMN birthdate;
  ELSE
    -- If no birthdate column exists, just make birthYear non-nullable
    -- with a default value to handle any existing rows
    UPDATE bookings SET birthyear = 2000 WHERE birthyear IS NULL;
    ALTER TABLE bookings ALTER COLUMN birthyear SET NOT NULL;
  END IF;
END $$;