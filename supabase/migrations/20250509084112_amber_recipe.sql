/*
  # Fix bookings table schema and type conversions
  
  1. Changes
    - Properly handle date type conversions
    - Maintain existing policies
    - Ensure data integrity during migration
  
  2. Security
    - Preserve RLS settings
    - Recreate all necessary policies
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON bookings;
DROP POLICY IF EXISTS "Enable insert access for all users" ON bookings;
DROP POLICY IF EXISTS "Enable update access for all users" ON bookings;
DROP POLICY IF EXISTS "Enable delete access for all users" ON bookings;

-- Recreate table with proper UUID handling
CREATE TABLE IF NOT EXISTS bookings_new (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now() NOT NULL,
  name text NOT NULL,
  birthdate date NOT NULL,
  phone text,
  email text,
  insurance text,
  note text,
  appointment_date date NOT NULL,
  appointment_time text NOT NULL,
  reason text NOT NULL
);

-- Copy data with proper type casting
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bookings') THEN
    INSERT INTO bookings_new (
      id,
      created_at,
      name,
      birthdate,
      phone,
      email,
      insurance,
      note,
      appointment_date,
      appointment_time,
      reason
    )
    SELECT
      id,
      created_at,
      name,
      birthdate::date,
      phone,
      email,
      insurance,
      note,
      appointment_date::date,
      appointment_time,
      reason
    FROM bookings;
  END IF;
END $$;

-- Drop old table and rename new one
DROP TABLE IF EXISTS bookings;
ALTER TABLE bookings_new RENAME TO bookings;

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Recreate policies
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