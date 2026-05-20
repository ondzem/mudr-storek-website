/*
  # Přidat admin UPDATE policy a opravit SELECT
  
  ## Problémy
  1. Admin nemůže upravovat rezervace (chybí UPDATE policy pro authenticated)
  2. SELECT zobrazuje VŠECHNY rezervace včetně smazaných
  
  ## Řešení
  1. Přidat UPDATE policy pro authenticated users (adminy)
  2. UPDATE SELECT policy - nezobrazovat smazané rezervace v BookingList
  
  POZNÁMKA: Pro AppointmentPage potřebujeme vidět všechny rezervace (i smazané)
  pro správné zobrazení volných termínů, ale v admin BookingList chceme
  vidět pouze aktivní.
*/

-- DROP existující SELECT policy
DROP POLICY IF EXISTS "bookings_select_all" ON bookings;

-- Nová SELECT policy - zobrazit VŠECHNY rezervace
-- (potřebné pro správné zobrazení volných termínů v kalendáři)
CREATE POLICY "bookings_select_all"
  ON bookings
  FOR SELECT
  TO public
  USING (true);

-- UPDATE policy pro authenticated users (admins)
CREATE POLICY "bookings_admin_update"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Poznámka: Filtrování smazaných rezervací se bude dít v aplikační vrstvě (BookingList)
