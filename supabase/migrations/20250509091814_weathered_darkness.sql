/*
  # Fix timezone handling and improve appointment validation
  
  1. Changes
    - Set database timezone to Europe/Prague
    - Add index for faster appointment lookups
    - Improve appointment overlap check function
    - Add time format validation
  
  2. Security
    - Ensure proper timezone handling for all operations
    - Prevent double bookings through database constraints
*/

-- Set timezone for the database
ALTER DATABASE postgres SET timezone TO 'Europe/Prague';

-- Create index for faster appointment lookups
CREATE INDEX IF NOT EXISTS idx_bookings_appointment 
ON bookings(appointment_date, appointment_time);

-- Create or replace function to check for overlapping appointments
CREATE OR REPLACE FUNCTION check_appointment_overlap()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if there's already a booking at this time
  IF EXISTS (
    SELECT 1 FROM bookings
    WHERE appointment_date = NEW.appointment_date
    AND appointment_time = NEW.appointment_time
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
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