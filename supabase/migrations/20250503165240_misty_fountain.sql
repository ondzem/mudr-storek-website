/*
  # Update RLS policies for bookings table to allow public read access
  
  1. Changes
    - Allow public read access to bookings table
    - Maintain existing policies for other operations
  
  2. Security
    - Enable public SELECT access for viewing bookings
    - Keep INSERT public for creating new bookings
    - Maintain authenticated-only access for UPDATE and DELETE
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON bookings;
DROP POLICY IF EXISTS "Enable insert access for all users" ON bookings;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON bookings;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON bookings;

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create new policies with public read access
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