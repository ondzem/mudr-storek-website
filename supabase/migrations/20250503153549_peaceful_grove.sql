/*
  # Fix bookings table schema

  1. Table Structure
    - Ensures the `bookings` table exists with all required columns
    - Makes sure the `note` column exists
    
  2. Security
    - Ensures Row Level Security policies are correctly applied
*/

-- Create the bookings table if it doesn't exist
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  birthdate date NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  insurance text NOT NULL,
  note text,
  appointment_date date NOT NULL,
  appointment_time text NOT NULL,
  reason text NOT NULL
);

-- Add the note column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'note'
  ) THEN
    ALTER TABLE bookings ADD COLUMN note text;
  END IF;
END $$;

-- Ensure RLS is enabled
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Check if policies exist and create them if they don't
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'bookings' AND policyname = 'Enable read access for authenticated users'
  ) THEN
    CREATE POLICY "Enable read access for authenticated users"
      ON bookings
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'bookings' AND policyname = 'Enable insert access for all users'
  ) THEN
    CREATE POLICY "Enable insert access for all users"
      ON bookings
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;
END $$;