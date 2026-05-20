/*
  # Create vacations table and policies
  
  1. Changes
    - Create vacations table for storing holiday dates
    - Drop existing policies to avoid conflicts
    - Create new policies for access control
  
  2. Security
    - Enable RLS on vacations table
    - Allow public read access
    - Restrict modifications to authenticated users
*/

-- Create vacations table if it doesn't exist
CREATE TABLE IF NOT EXISTS vacations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE vacations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
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