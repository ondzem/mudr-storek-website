/*
  # Update RLS policies for bookings table
  
  1. Changes
    - Ensure Row Level Security is enabled for bookings table
    - Configure policies to match business requirements
    - Allow viewing and management of booking data for authenticated users only
  
  2. Security
    - Allow public access for creating bookings
    - Restrict viewing, updating, and deleting bookings to authenticated users only
*/

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bookings') THEN
    DROP POLICY IF EXISTS "Enable read access for all users" ON bookings;
    DROP POLICY IF EXISTS "Enable read access for authenticated users" ON bookings;
    DROP POLICY IF EXISTS "Enable insert access for all users" ON bookings;
    DROP POLICY IF EXISTS "Enable update access for authenticated users" ON bookings;
    DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON bookings;
  END IF;
END $$;

-- Create SELECT policy for authenticated users only
CREATE POLICY "Enable read access for authenticated users"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (true);
  
-- Create INSERT policy for all users (including unauthenticated)
CREATE POLICY "Enable insert access for all users"
  ON bookings
  FOR INSERT
  TO PUBLIC
  WITH CHECK (true);
  
-- Create UPDATE policy for authenticated users only
CREATE POLICY "Enable update access for authenticated users"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
  
-- Create DELETE policy for authenticated users only
CREATE POLICY "Enable delete access for authenticated users"
  ON bookings
  FOR DELETE
  TO authenticated
  USING (true);