/*
  # Obnovení autentizace pro přehled rezervací
  
  1. Změny
    - Obnovení politik tak, aby čtení dat z tabulky bookings vyžadovalo přihlášení
    - Zachování veřejného přístupu pro vkládání nových rezervací
  
  2. Security
    - Pouze přihlášení uživatelé mohou vidět rezervace
    - Pouze přihlášení uživatelé mohou upravovat nebo mazat rezervace
    - Nepřihlášení uživatelé mohou pouze přidat novou rezervaci
*/

-- Povolení RLS na tabulce
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Odstranění stávajících politik, pokud existují
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'bookings' AND policyname = 'Enable read access for all users'
  ) THEN
    DROP POLICY "Enable read access for all users" ON bookings;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'bookings' AND policyname = 'Enable insert access for all users'
  ) THEN
    DROP POLICY "Enable insert access for all users" ON bookings;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'bookings' AND policyname = 'Enable update access for authenticated users'
  ) THEN
    DROP POLICY "Enable update access for authenticated users" ON bookings;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'bookings' AND policyname = 'Enable delete access for authenticated users'
  ) THEN
    DROP POLICY "Enable delete access for authenticated users" ON bookings;
  END IF;
END $$;

-- Vytvoření nových politik pro tabulku bookings
-- Čtení povoleno pouze přihlášeným uživatelům
CREATE POLICY "Enable read access for authenticated users"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (true);

-- Vkládání povoleno všem uživatelům
CREATE POLICY "Enable insert access for all users"
  ON bookings
  FOR INSERT
  TO PUBLIC
  WITH CHECK (true);

-- Úpravy a mazání povoleno přihlášeným uživatelům
CREATE POLICY "Enable update access for authenticated users"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users"
  ON bookings
  FOR DELETE
  TO authenticated
  USING (true);