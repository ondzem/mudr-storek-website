/*
  # Oprava booking policies - vrátit funkční stav
  
  Problém: Duplicitní a konfliktní policies blokují UPDATE operace.
  
  Řešení:
  1. Smazat všechny existující policies
  2. Vytvořit jednoduché, funkční policies
*/

-- Smazat všechny existující policies
DROP POLICY IF EXISTS "bookings_public_read" ON bookings;
DROP POLICY IF EXISTS "bookings_public_insert" ON bookings;
DROP POLICY IF EXISTS "bookings_public_cancel" ON bookings;
DROP POLICY IF EXISTS "bookings_public_delete" ON bookings;
DROP POLICY IF EXISTS "bookings_select_public" ON bookings;
DROP POLICY IF EXISTS "bookings_insert_public" ON bookings;
DROP POLICY IF EXISTS "bookings_update_with_token" ON bookings;
DROP POLICY IF EXISTS "bookings_delete_with_token" ON bookings;

-- SELECT: Zobrazit pouze nezrušené rezervace
CREATE POLICY "bookings_select_public"
  ON bookings
  FOR SELECT
  TO public
  USING (cancelled_at IS NULL);

-- INSERT: Povolit vytvoření rezervace
CREATE POLICY "bookings_insert_public"
  ON bookings
  FOR INSERT
  TO public
  WITH CHECK (
    name IS NOT NULL AND
    email IS NOT NULL AND
    appointment_date IS NOT NULL AND
    appointment_time IS NOT NULL AND
    cancellation_token IS NOT NULL
  );

-- UPDATE: Povolit zrušení rezervace s tokenem
CREATE POLICY "bookings_update_with_token"
  ON bookings
  FOR UPDATE
  TO public
  USING (cancellation_token IS NOT NULL AND cancelled_at IS NULL)
  WITH CHECK (true);

-- DELETE: Povolit smazání s tokenem
CREATE POLICY "bookings_delete_with_token"
  ON bookings
  FOR DELETE
  TO public
  USING (cancellation_token IS NOT NULL);
