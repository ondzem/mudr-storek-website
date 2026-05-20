/*
  # Vylepšení politik pro tabulku bookings
  
  1. Změny
    - Odstranění všech stávajících politik
    - Vytvoření politik, které umožňují všem uživatelům úplný přístup k datům
    - Povolení všech operací pro všechny uživatele (čtení, vkládání, úpravy, mazání)
  
  2. Security
    - Vzhledem k povaze demo aplikace jsou všechny operace povoleny pro všechny uživatele
    - V produkčním prostředí by bylo nutné nastavit přísnější omezení pro úpravy a mazání
*/

-- Odstranění stávajících politik
DROP POLICY IF EXISTS "Enable read access for all users" ON bookings;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON bookings;
DROP POLICY IF EXISTS "Enable insert access for all users" ON bookings;
DROP POLICY IF EXISTS "Enable update access for all users" ON bookings;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON bookings;
DROP POLICY IF EXISTS "Enable delete access for all users" ON bookings;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON bookings;

-- Povolení RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Vytvoření nových politik - všechny operace pro všechny uživatele
CREATE POLICY "Enable read access for all users"
  ON bookings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable insert access for all users"
  ON bookings
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Enable update access for all users"
  ON bookings
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete access for all users"
  ON bookings
  FOR DELETE
  TO public
  USING (true);