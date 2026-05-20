/*
  # Vrátit původní funkční policies
  
  Vrací policies z 20250521193536_spring_resonance.sql které fungovaly.
*/

-- Smazat všechny nefunkční policies
DROP POLICY IF EXISTS "bookings_public_read" ON bookings;
DROP POLICY IF EXISTS "bookings_public_insert" ON bookings;
DROP POLICY IF EXISTS "bookings_public_cancel" ON bookings;
DROP POLICY IF EXISTS "bookings_public_delete" ON bookings;
DROP POLICY IF EXISTS "bookings_select_public" ON bookings;
DROP POLICY IF EXISTS "bookings_insert_public" ON bookings;
DROP POLICY IF EXISTS "bookings_update_with_token" ON bookings;
DROP POLICY IF EXISTS "bookings_delete_with_token" ON bookings;

-- Vrátit původní funkční policies
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

CREATE POLICY "Enable update for cancellation"
  ON bookings
  FOR UPDATE
  TO public
  USING (
    CASE 
      WHEN current_setting('request.jwt.claims', true)::json->>'role' = 'authenticated' THEN true
      WHEN cancelled_at IS NULL AND 
           appointment_date > CURRENT_DATE + interval '1 day' THEN true
      ELSE false
    END
  )
  WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users"
  ON bookings
  FOR DELETE
  TO authenticated
  USING (true);
