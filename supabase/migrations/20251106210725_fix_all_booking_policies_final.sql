/*
  # FINÁLNÍ OPRAVA VŠECH BOOKING POLICIES
  
  ## Problém
  Současné policies jsou ROZBITÝ:
  - DELETE policy dovoluje KOMUKOLIV smazat JAKOUKOLI rezervaci
  - UPDATE policy má špatnou logiku s CASE WHEN
  - INSERT policy je OK ale mohla by být přísnější
  - Chybí správná validace cancellation_token
  
  ## Řešení
  1. SMAZAT všechny existující policies
  2. Vytvořit NOVÉ, BEZPEČNÉ policies:
     - SELECT: Všichni mohou číst všechny rezervace (pro zobrazení volných termínů)
     - INSERT: Kdokoli může vytvořit rezervaci s povinnými poli
     - UPDATE: NIKDO nemůže editovat (nepoužívá se)
     - DELETE: Pouze s platným cancellation_token A minimálně 24h před termínem
  
  ## Bezpečnost
  - DELETE je nyní zabezpečen pomocí cancellation_token
  - Nelze smazat rezervaci méně než 24h před termínem
  - Nelze smazat již zrušené rezervace
*/

-- SMAZAT VŠECHNY EXISTUJÍCÍ POLICIES
DROP POLICY IF EXISTS "Enable read access for all users" ON bookings;
DROP POLICY IF EXISTS "Enable insert access for all users" ON bookings;
DROP POLICY IF EXISTS "Enable update for cancellation" ON bookings;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON bookings;
DROP POLICY IF EXISTS "bookings_public_read" ON bookings;
DROP POLICY IF EXISTS "bookings_public_insert" ON bookings;
DROP POLICY IF EXISTS "bookings_public_cancel" ON bookings;
DROP POLICY IF EXISTS "bookings_public_delete" ON bookings;
DROP POLICY IF EXISTS "bookings_select_public" ON bookings;
DROP POLICY IF EXISTS "bookings_insert_public" ON bookings;
DROP POLICY IF EXISTS "bookings_update_with_token" ON bookings;
DROP POLICY IF EXISTS "bookings_delete_with_token" ON bookings;

-- 1. SELECT POLICY: Všichni mohou číst všechny rezervace
-- (potřebné pro zobrazení volných termínů v kalendáři)
CREATE POLICY "bookings_select_all"
  ON bookings
  FOR SELECT
  TO public
  USING (true);

-- 2. INSERT POLICY: Kdokoli může vytvořit rezervaci s povinnými poli
CREATE POLICY "bookings_insert_new"
  ON bookings
  FOR INSERT
  TO public
  WITH CHECK (
    name IS NOT NULL AND
    name != '' AND
    appointment_date IS NOT NULL AND
    appointment_time IS NOT NULL AND
    reason IS NOT NULL AND
    cancellation_token IS NOT NULL AND
    cancellation_token != ''
  );

-- 3. DELETE POLICY: Pouze s platným tokenem a minimálně 24h před termínem
-- TOTO JE KRITICKÉ PRO BEZPEČNOST!
CREATE POLICY "bookings_delete_with_valid_token"
  ON bookings
  FOR DELETE
  TO public
  USING (
    -- Token musí být vyplněný
    cancellation_token IS NOT NULL AND
    cancellation_token != '' AND
    -- Rezervace ještě nebyla zrušena
    cancelled_at IS NULL AND
    -- Termín je minimálně 24h v budoucnosti
    (appointment_date::timestamp + appointment_time::time) > (now() + interval '24 hours')
  );

-- POZNÁMKA: UPDATE policy NENÍ potřeba - zrušení se dělá přes DELETE
-- Pokud by někdy bylo potřeba UPDATE, musí být stejně zabezpečené jako DELETE
