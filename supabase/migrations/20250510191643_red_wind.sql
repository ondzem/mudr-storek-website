/*
  # Add announcements table
  
  1. New Tables
    - `announcements`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `content` (text, not null) 
      - `created_at` (timestamptz)
      - `active` (boolean) - to control visibility
      - `priority` (integer) - for ordering announcements
  
  2. Security
    - Enable RLS
    - Allow public read access
    - Restrict write operations to authenticated users
*/

-- Create announcements table
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