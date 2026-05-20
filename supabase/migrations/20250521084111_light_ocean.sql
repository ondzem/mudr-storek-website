/*
  # Update bookings table to make birthyear optional
  
  1. Changes
    - Make birthyear field nullable in bookings table
    - Keep validation constraints for required fields
    - Ensure name, appointment_date, appointment_time, and reason remain required
  
  2. Security
    - No changes to RLS policies
    - Preserves existing permissions
*/

-- Make birthyear nullable
ALTER TABLE bookings ALTER COLUMN birthyear DROP NOT NULL;

-- Ensure other required fields remain NOT NULL
DO $$ 
BEGIN
  -- Ensure name is NOT NULL
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'name' AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE bookings ALTER COLUMN name SET NOT NULL;
  END IF;
  
  -- Ensure appointment_date is NOT NULL
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'appointment_date' AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE bookings ALTER COLUMN appointment_date SET NOT NULL;
  END IF;
  
  -- Ensure appointment_time is NOT NULL
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'appointment_time' AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE bookings ALTER COLUMN appointment_time SET NOT NULL;
  END IF;
  
  -- Ensure reason is NOT NULL
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'reason' AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE bookings ALTER COLUMN reason SET NOT NULL;
  END IF;
END $$;