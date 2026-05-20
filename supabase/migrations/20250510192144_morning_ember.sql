/*
  # Fix announcements table and add constraints
  
  1. Changes
    - Drop and recreate announcements table with proper constraints
    - Add index for faster retrieval of active announcements
    - Set up RLS policies for proper access control
  
  2. Security
    - Enable RLS on announcements table
    - Allow public read access
    - Restrict modifications to authenticated users
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS announcements;

-- Create announcements table with proper constraints
CREATE TABLE announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  active boolean DEFAULT true,
  priority integer DEFAULT 0
);

-- Enable RLS
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users"
  ON announcements
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable write access for authenticated users"
  ON announcements
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for faster retrieval of active announcements
CREATE INDEX idx_announcements_active ON announcements(active, priority DESC);