/*
  # Add cancellation fields to bookings table
  
  1. Changes
    - Add cancellation_token column for unique cancellation links
    - Add cancelled_at column for tracking cancellation time
    - Add index for faster token lookups
    - Update RLS policies to handle cancellations
  
  2. Security
    - Enable secure cancellation via tokens
    - Maintain existing RLS policies
    - Add new policies for cancellation
*/

-- Add new columns
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS cancellation_token uuid DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS cancelled_at timestamptz;

-- Create index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_bookings_cancellation 
ON bookings(cancellation_token) 
WHERE cancelled_at IS NULL;

-- Update RLS policies
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON bookings;
DROP POLICY IF EXISTS "Enable insert access for all users" ON bookings;
DROP POLICY IF EXISTS "Enable update access for all users" ON bookings;
DROP POLICY IF EXISTS "Enable delete access for all users" ON bookings;

-- Create new policies
CREATE POLICY "Enable read access for all users"
  ON bookings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable insert access for all users"
  ON bookings
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Enable update for cancellation"
  ON bookings
  FOR UPDATE
  TO public
  USING (
    CASE 
      WHEN current_setting('request.jwt.claims', true)::json->>'role' = 'authenticated' THEN true
      WHEN cancelled_at IS NULL AND 
           appointment_date > CURRENT_DATE + interval '1 day' THEN true
      ELSE false
    END
  )
  WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users"
  ON bookings
  FOR DELETE
  TO authenticated
  USING (true);