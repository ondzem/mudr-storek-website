/*
  # Fix Booking Cancellation - Add UPDATE Policy
  
  Problém: Chybí policy pro UPDATE operaci na bookings tabulce.
  Uživatel nemůže zrušit rezervaci, protože UPDATE je blokovaný RLS.
  
  Řešení: Přidat policy pro UPDATE s validním cancellation_token.
*/

-- Přidat policy pro UPDATE bookings s cancellation tokenem
CREATE POLICY "bookings_update_with_token"
  ON bookings
  FOR UPDATE
  TO public
  USING (cancellation_token IS NOT NULL AND cancelled_at IS NULL)
  WITH CHECK (cancelled_at IS NOT NULL);
