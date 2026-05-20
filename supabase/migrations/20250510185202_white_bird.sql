/*
  # Update bookings policies to allow public read access
  
  1. Changes
    - Allow public read access to bookings
    - Maintain authenticated-only access for modifications
    - Reset all policies to ensure clean state
  
  2. Security
    - Anyone can view bookings
    - Only authenticated users can modify or delete bookings
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON bookings;
DROP POLICY IF EXISTS "Enable read access for all users" ON bookings;
DROP POLICY IF EXISTS "Enable insert access for all users" ON bookings;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON bookings;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON bookings;

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

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