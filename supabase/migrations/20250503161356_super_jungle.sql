/*
  # Oprava RLS politik pro tabulku bookings

  1. Změny
    - Přenastavení všech politik pro tabulku bookings
    - Zajištění správných přístupových práv
    - Vyřešení problému s načítáním dat
  
  2. Security
    - Nastavení správných politik přístupu k datům
    - Povolení čtení pro všechny uživatele (pro účely demo aplikace)
*/

-- Povolení RLS na tabulce
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Odstranění stávajících politik, pokud existují
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'bookings' AND policyname = 'Enable read access for authenticated users'
  ) THEN
    DROP POLICY "Enable read access for authenticated users" ON bookings;
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
-- Pro účely demo aplikace povolíme čtení všem uživatelům
CREATE POLICY "Enable read access for all users"
  ON bookings
  FOR SELECT
  TO PUBLIC
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