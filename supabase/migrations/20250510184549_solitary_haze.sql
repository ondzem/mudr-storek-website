/*
  # Update bookings table policies for admin-only access
  
  1. Changes
    - Reset all policies to ensure clean state
    - Allow public access only for creating new bookings
    - Restrict viewing, updating and deleting to authenticated users only
  
  2. Security
    - Only authenticated users can view, edit, and delete bookings
    - Public users can only create new bookings
    - This ensures admin control over booking management
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON bookings;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON bookings;
DROP POLICY IF EXISTS "Enable insert access for all users" ON bookings;
DROP POLICY IF EXISTS "Enable update access for all users" ON bookings;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON bookings;
DROP POLICY IF EXISTS "Enable delete access for all users" ON bookings;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON bookings;

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

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
  TO public
  WITH CHECK (true);

-- Create UPDATE policy for authenticated users only
CREATE POLICY "Enable update access for authenticated users"
  ON bookings
  FOR UPDATE
  TO authenticated
  WITH CHECK (true);

-- Create DELETE policy for authenticated users only
CREATE POLICY "Enable delete access for authenticated users"
  ON bookings
  FOR DELETE
  TO authenticated
  USING (true);