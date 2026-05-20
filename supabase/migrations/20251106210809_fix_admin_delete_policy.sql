/*
  # Přidat admin DELETE policy
  
  ## Problém
  Admin nemůže mazat rezervace, protože DELETE policy vyžaduje token.
  Admin nepotřebuje token - musí mít právo mazat přímo.
  
  ## Řešení
  Přidat separátní DELETE policy pro authenticated uživatele (adminy)
  
  POZOR: V reálné produkci by měl být admin autentifikován pomocí Supabase Auth.
  Toto je dočasné řešení pro lokální admin v localStorage.
*/

-- DELETE policy pro authenticated users (admins)
-- Tato policy je permissive, takže se KOMBINUJE s existující public policy (OR)
CREATE POLICY "bookings_admin_delete"
  ON bookings
  FOR DELETE
  TO authenticated
  USING (true);

-- Poznámka: Nyní máme 2 DELETE policies:
-- 1. bookings_delete_with_valid_token - pro public s tokenem a 24h limitem
-- 2. bookings_admin_delete - pro authenticated bez omezení
-- Obě jsou PERMISSIVE, takže platí OR logika
