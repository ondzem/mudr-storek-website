/*
  # Opravení oprávnění RLS pro smazání rezervací
  
  1. Změny
    - Resetování všech politik pro tabulku bookings
    - Explicitní nadefinování politik pro všechny operace
    - Zajištění přístupu veřejné pro čtení a vkládání
  
  2. Security
    - Zrušení všech dříve definovaných politik
    - Zajištění správného přístupu k databázi
*/

-- Odstranění stávajících politik
DROP POLICY IF EXISTS "Enable read access for all users" ON bookings;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON bookings;
DROP POLICY IF EXISTS "Enable insert access for all users" ON bookings;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON bookings;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON bookings;

-- Povolení RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Vytvoření nových politik - čtení pro všechny
CREATE POLICY "Enable read access for all users"
  ON bookings
  FOR SELECT
  TO public
  USING (true);

-- Vytvoření politik pro vkládání - všichni uživatelé
CREATE POLICY "Enable insert access for all users"
  ON bookings
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Vytvoření politik pro úpravy - všichni uživatelé
CREATE POLICY "Enable update access for all users"
  ON bookings
  FOR UPDATE
  TO public
  WITH CHECK (true);

-- Vytvoření politik pro mazání - všichni uživatelé
CREATE POLICY "Enable delete access for all users"
  ON bookings
  FOR DELETE
  TO public
  USING (true);