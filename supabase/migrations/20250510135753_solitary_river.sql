/*
  # Create vacations table for storing vacation dates
  
  1. New Tables
    - `vacations`
      - `id` (uuid, primary key)
      - `date` (date, not null)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on vacations table
    - Allow public read access
    - Restrict write access to authenticated users
*/

-- Create vacations table
CREATE TABLE IF NOT EXISTS vacations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE vacations ENABLE ROW LEVEL SECURITY;

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