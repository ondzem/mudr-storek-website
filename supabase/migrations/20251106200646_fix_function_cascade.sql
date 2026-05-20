/*
  # Oprava trigger a odstranění staré funkce

  1. Smazání starého triggeru
  2. Smazání staré funkce bez parametrů
  3. Nový trigger už neexistuje (kontrola duplicit v aplikaci)
*/

-- Smazat trigger pokud existuje
DROP TRIGGER IF EXISTS prevent_appointment_overlap ON public.bookings;

-- Smazat starou funkci
DROP FUNCTION IF EXISTS public.check_appointment_overlap() CASCADE;
