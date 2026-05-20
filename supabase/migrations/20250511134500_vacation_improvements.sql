-- supabase/migrations/20250511134500_vacation_improvements.sql
/*
  # Improve vacations table and add unique constraint
  
  1. Changes
    - Ensure vacations table exists
    - Add unique constraint on the date column
    - Update RLS policies for better security
  
  2. Security
    - Maintain RLS settings
    - Allow public read access for vacation dates
    - Restrict modifications to authenticated users only
*/

-- Create vacations table if not exists
CREATE TABLE IF NOT EXISTS vacations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add unique constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'vacations_date_key' AND conrelid = 'vacations'::regclass
  ) THEN
    ALTER TABLE vacations ADD CONSTRAINT vacations_date_key UNIQUE (date);
  END IF;
END $$;

-- Enable RLS
ALTER TABLE vacations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON vacations;
DROP POLICY IF EXISTS "Enable insert/update/delete for authenticated users" ON vacations;

-- Create policies
CREATE POLICY "Enable read access for all users"
  ON vacations
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable insert/update/delete for authenticated users"
  ON vacations
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);