/*
  # Update RLS policies to allow public read access for bookings
  
  1. Changes
    - Update Row Level Security (RLS) policies to allow public read access
    - This changes the security model to allow reading bookings without authentication
    - Important for demonstration purposes, but should be reconsidered for production
  
  2. Security
    - Allows PUBLIC access for SELECT operations (viewing bookings)
    - Maintains public access for INSERT operations
    - Keeps authenticated-only restrictions for UPDATE and DELETE
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON bookings;
DROP POLICY IF EXISTS "Enable read access for all users" ON bookings;
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