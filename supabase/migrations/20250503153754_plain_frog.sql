/*
  # Oprava schématu tabulky bookings

  1. Změny
    - Vytvoření tabulky `bookings`, pokud neexistuje
    - Zajištění existence sloupce `note` v tabulce `bookings`
    - Nastavení Row Level Security pro tabulku `bookings`
    - Vytvoření potřebných politik přístupu

  2. Security
    - Zachování RLS na tabulce `bookings`
    - Zajištění politik pro čtení pro přihlášené uživatele
    - Zajištění politik pro vkládání pro všechny uživatele
*/

-- Vytvoření tabulky bookings, pokud neexistuje
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now() NOT NULL,
  name text NOT NULL,
  birthdate date NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  insurance text NOT NULL,
  note text NOT NULL,
  appointment_date date NOT NULL,
  appointment_time text NOT NULL,
  reason text NOT NULL
);

-- Přidání sloupce note, pokud neexistuje
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'note'
  ) THEN
    ALTER TABLE bookings ADD COLUMN note text;
  END IF;
END $$;

-- Povolení Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Vytvoření politik pro přístup k datům
DO $$
BEGIN
  -- Politika pro čtení - pouze přihlášení uživatelé
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'bookings' AND policyname = 'Enable read access for authenticated users'
  ) THEN
    CREATE POLICY "Enable read access for authenticated users"
      ON bookings
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
  
  -- Politika pro vkládání - všichni uživatelé
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'bookings' AND policyname = 'Enable insert access for all users'
  ) THEN
    CREATE POLICY "Enable insert access for all users"
      ON bookings
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;
END $$;