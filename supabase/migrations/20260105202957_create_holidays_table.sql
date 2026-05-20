/*
  # Create holidays table for Czech state holidays

  1. New Tables
    - `holidays`
      - `id` (uuid, primary key) - Unique identifier
      - `date` (date) - Full date of the holiday
      - `name` (text) - Name of the holiday
      - `year` (integer) - Year for easy filtering
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on `holidays` table
    - Add policy for public read access (everyone can view holidays)
    - Add policy for authenticated admin to manage holidays

  3. Data
    - Populate with Czech state holidays for years 2027-2031
*/

-- Create holidays table
CREATE TABLE IF NOT EXISTS holidays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  name text NOT NULL,
  year integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;

-- Public can view all holidays
CREATE POLICY "Anyone can view holidays"
  ON holidays
  FOR SELECT
  TO public
  USING (true);

-- Authenticated users can insert holidays
CREATE POLICY "Authenticated users can insert holidays"
  ON holidays
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update holidays
CREATE POLICY "Authenticated users can update holidays"
  ON holidays
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete holidays
CREATE POLICY "Authenticated users can delete holidays"
  ON holidays
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert holidays for 2027
INSERT INTO holidays (date, name, year) VALUES
  ('2027-01-01', 'Nový rok / Den obnovy samostatného českého státu', 2027),
  ('2027-03-26', 'Velký pátek', 2027),
  ('2027-03-29', 'Velikonoční pondělí', 2027),
  ('2027-05-01', 'Svátek práce', 2027),
  ('2027-05-08', 'Den vítězství', 2027),
  ('2027-07-05', 'Den slovanských věrozvěstů Cyrila a Metoděje', 2027),
  ('2027-07-06', 'Den upálení mistra Jana Husa', 2027),
  ('2027-09-28', 'Den české státnosti', 2027),
  ('2027-10-28', 'Den vzniku samostatného československého státu', 2027),
  ('2027-11-17', 'Den boje za svobodu a demokracii', 2027),
  ('2027-12-24', 'Štědrý den', 2027),
  ('2027-12-25', '1. svátek vánoční', 2027),
  ('2027-12-26', '2. svátek vánoční', 2027);

-- Insert holidays for 2028
INSERT INTO holidays (date, name, year) VALUES
  ('2028-01-01', 'Nový rok / Den obnovy samostatného českého státu', 2028),
  ('2028-04-14', 'Velký pátek', 2028),
  ('2028-04-17', 'Velikonoční pondělí', 2028),
  ('2028-05-01', 'Svátek práce', 2028),
  ('2028-05-08', 'Den vítězství', 2028),
  ('2028-07-05', 'Den slovanských věrozvěstů Cyrila a Metoděje', 2028),
  ('2028-07-06', 'Den upálení mistra Jana Husa', 2028),
  ('2028-09-28', 'Den české státnosti', 2028),
  ('2028-10-28', 'Den vzniku samostatného československého státu', 2028),
  ('2028-11-17', 'Den boje za svobodu a demokracii', 2028),
  ('2028-12-24', 'Štědrý den', 2028),
  ('2028-12-25', '1. svátek vánoční', 2028),
  ('2028-12-26', '2. svátek vánoční', 2028);

-- Insert holidays for 2029
INSERT INTO holidays (date, name, year) VALUES
  ('2029-01-01', 'Nový rok / Den obnovy samostatného českého státu', 2029),
  ('2029-03-30', 'Velký pátek', 2029),
  ('2029-04-02', 'Velikonoční pondělí', 2029),
  ('2029-05-01', 'Svátek práce', 2029),
  ('2029-05-08', 'Den vítězství', 2029),
  ('2029-07-05', 'Den slovanských věrozvěstů Cyrila a Metoděje', 2029),
  ('2029-07-06', 'Den upálení mistra Jana Husa', 2029),
  ('2029-09-28', 'Den české státnosti', 2029),
  ('2029-10-28', 'Den vzniku samostatného československého státu', 2029),
  ('2029-11-17', 'Den boje za svobodu a demokracii', 2029),
  ('2029-12-24', 'Štědrý den', 2029),
  ('2029-12-25', '1. svátek vánoční', 2029),
  ('2029-12-26', '2. svátek vánoční', 2029);

-- Insert holidays for 2030
INSERT INTO holidays (date, name, year) VALUES
  ('2030-01-01', 'Nový rok / Den obnovy samostatného českého státu', 2030),
  ('2030-04-19', 'Velký pátek', 2030),
  ('2030-04-22', 'Velikonoční pondělí', 2030),
  ('2030-05-01', 'Svátek práce', 2030),
  ('2030-05-08', 'Den vítězství', 2030),
  ('2030-07-05', 'Den slovanských věrozvěstů Cyrila a Metoděje', 2030),
  ('2030-07-06', 'Den upálení mistra Jana Husa', 2030),
  ('2030-09-28', 'Den české státnosti', 2030),
  ('2030-10-28', 'Den vzniku samostatného československého státu', 2030),
  ('2030-11-17', 'Den boje za svobodu a demokracii', 2030),
  ('2030-12-24', 'Štědrý den', 2030),
  ('2030-12-25', '1. svátek vánoční', 2030),
  ('2030-12-26', '2. svátek vánoční', 2030);

-- Insert holidays for 2031
INSERT INTO holidays (date, name, year) VALUES
  ('2031-01-01', 'Nový rok / Den obnovy samostatného českého státu', 2031),
  ('2031-04-11', 'Velký pátek', 2031),
  ('2031-04-14', 'Velikonoční pondělí', 2031),
  ('2031-05-01', 'Svátek práce', 2031),
  ('2031-05-08', 'Den vítězství', 2031),
  ('2031-07-05', 'Den slovanských věrozvěstů Cyrila a Metoděje', 2031),
  ('2031-07-06', 'Den upálení mistra Jana Husa', 2031),
  ('2031-09-28', 'Den české státnosti', 2031),
  ('2031-10-28', 'Den vzniku samostatného československého státu', 2031),
  ('2031-11-17', 'Den boje za svobodu a demokracii', 2031),
  ('2031-12-24', 'Štědrý den', 2031),
  ('2031-12-25', '1. svátek vánoční', 2031),
  ('2031-12-26', '2. svátek vánoční', 2031);
