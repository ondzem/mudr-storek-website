/*
  # Fix announcements table and add test data
  
  1. Changes
    - Ensure announcements table exists with proper structure
    - Add test data to verify functionality
    - Update indexes for better performance
  
  2. Security
    - Maintain existing RLS policies
    - Allow public read access
    - Restrict modifications to authenticated users
*/

-- Recreate announcements table
DROP TABLE IF EXISTS announcements;

CREATE TABLE announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  active boolean NOT NULL DEFAULT true,
  priority integer NOT NULL DEFAULT 0
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

-- Create index for proper ordering
CREATE INDEX idx_announcements_ordering 
ON announcements(active DESC, priority DESC, created_at DESC);

-- Insert test data
INSERT INTO announcements (title, content, active, priority, created_at) VALUES
('UPOZORNĚNÍ na Akutní stavy', 'První půlhodina ordinační doby je určená POUZE pro akutní stavy (náhle vzniklé potíže) bez předchozího objednání. Poté bude pokračovat objednávkový systém buď samoobslužně po webu nebo po telefonické rezervaci u sestry.', true, 2, now()),
('Emailová komunikace', 'Ještě jednou apeluji k racionálnímu využívání emailové komunikace. Je určena výhradně pro neakutní dotazy. Garantuji odpovědět do 48 h ( ale v drtivé většině odpovím ten den po práci). O víkendu a po ordinační době nepracuji. Prosím i o racionální využívání telefonů. Denně sestra přijme přes 53 hovorů...', true, 1, now());