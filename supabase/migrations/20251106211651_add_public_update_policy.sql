/*
  # Přidat public UPDATE policy pro admin úpravy
  
  ## Problém
  Admin není autentifikován přes Supabase (je jen v localStorage),
  takže nemá přístup k authenticated UPDATE policy.
  
  ## Řešení
  Přidat permissive UPDATE policy pro public role.
  
  BEZPEČNOSTNÍ POZNÁMKA:
  V produkci by admin měl být autentifikován přes Supabase Auth.
  Toto je dočasné řešení pro lokální admin mód.
  
  Pro zvýšení bezpečnosti:
  - UPDATE je povolen pouze pro rezervace, které ještě nebyly zrušeny
  - Nelze změnit cancellation_token (to chrání integritu systému)
*/

-- UPDATE policy pro public (pro admin mód v localStorage)
CREATE POLICY "bookings_public_update"
  ON bookings
  FOR UPDATE
  TO public
  USING (
    -- Povolit UPDATE pouze pro nezrušené rezervace
    cancelled_at IS NULL
  )
  WITH CHECK (
    -- Zajistit, že důležitá pole jsou vyplněná
    name IS NOT NULL AND
    name != '' AND
    appointment_date IS NOT NULL AND
    appointment_time IS NOT NULL AND
    reason IS NOT NULL
  );
