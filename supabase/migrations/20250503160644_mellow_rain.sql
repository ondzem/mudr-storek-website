/*
  # Improve Row Level Security Policies for bookings table
  
  1. Changes
    - Add UPDATE and DELETE policies for authenticated users
    - Modify existing SELECT policy to ensure authenticated users can see data
  
  2. Security
    - Maintains public INSERT access for booking creation
    - Restricts modification and viewing to authenticated users only
*/

-- Check if the policy exists and drop it to recreate with correct settings
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'bookings' AND policyname = 'Enable read access for authenticated users'
  ) THEN
    DROP POLICY "Enable read access for authenticated users" ON bookings;
  END IF;
END $$;

-- Create improved SELECT policy
CREATE POLICY "Enable read access for authenticated users"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (true);

-- Add UPDATE policy for authenticated users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'bookings' AND policyname = 'Enable update access for authenticated users'
  ) THEN
    CREATE POLICY "Enable update access for authenticated users"
      ON bookings
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Add DELETE policy for authenticated users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'bookings' AND policyname = 'Enable delete access for authenticated users'
  ) THEN
    CREATE POLICY "Enable delete access for authenticated users"
      ON bookings
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END $$;