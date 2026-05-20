/*
  # Improve booking system with timezone handling and validation
  
  1. Changes
    - Set timezone to Europe/Prague
    - Add trigger to prevent duplicate bookings
    - Add check constraint for appointment times
  
  2. Security
    - Maintain existing RLS policies
    - Add validation to prevent overlapping appointments
*/

-- Set timezone for the database
ALTER DATABASE postgres SET timezone TO 'Europe/Prague';

-- Create function to check for overlapping appointments
CREATE OR REPLACE FUNCTION check_appointment_overlap()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM bookings
    WHERE appointment_date = NEW.appointment_date
    AND appointment_time = NEW.appointment_time
    AND id != COALESCE(NEW.id, -1)
  ) THEN
    RAISE EXCEPTION 'Tento termín je již obsazený';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for checking overlapping appointments
DROP TRIGGER IF EXISTS prevent_appointment_overlap ON bookings;
CREATE TRIGGER prevent_appointment_overlap
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION check_appointment_overlap();

-- Add check constraint for appointment times
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS valid_appointment_time;
ALTER TABLE bookings ADD CONSTRAINT valid_appointment_time 
  CHECK (appointment_time ~ '^([0-1][0-9]|2[0-3]):[0-5][0-9]$');

-- Make only name and birthdate required
ALTER TABLE bookings ALTER COLUMN phone DROP NOT NULL;
ALTER TABLE bookings ALTER COLUMN email DROP NOT NULL;
ALTER TABLE bookings ALTER COLUMN insurance DROP NOT NULL;