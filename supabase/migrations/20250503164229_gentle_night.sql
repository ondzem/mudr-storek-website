/*
  # Final fix for bookings table policies
  
  1. Changes
    - Reset and recreate all policies for bookings table
    - Ensure proper authentication requirements
    - Fix permission issues with viewing reservations
  
  2. Security
    - Authenticated users can view, update and delete bookings
    - Public users can only create new bookings
*/

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON bookings;
DROP POLICY IF EXISTS "Enable insert access for all users" ON bookings;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON bookings;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON bookings;

-- Create new policies
CREATE POLICY "Enable read access for authenticated users"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for all users"
  ON bookings
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
  ON bookings
  FOR UPDATE
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users"
  ON bookings
  FOR DELETE
  TO authenticated
  USING (true);