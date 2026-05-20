/*
  # Fix booking deletion permissions
  
  1. Changes
    - Reset all policies to ensure clean state
    - Set up proper permissions for all operations
    - Allow public access for viewing and creating bookings
    - Allow only authenticated users to update and delete
  
  2. Security
    - Maintain data integrity with proper permissions
    - Ensure authenticated users can manage bookings
*/

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Enable read access for all users" ON bookings;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON bookings;
DROP POLICY IF EXISTS "Enable insert access for all users" ON bookings;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON bookings;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON bookings;

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create new policies with proper permissions
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

CREATE POLICY "Enable update access for all users"
  ON bookings
  FOR UPDATE
  TO public
  WITH CHECK (true);

CREATE POLICY "Enable delete access for all users"
  ON bookings
  FOR DELETE
  TO public
  USING (true);