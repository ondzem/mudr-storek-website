-- supabase/migrations/20250519190000_alter_birthdate_to_integer.sql
/*
  # Change birthdate column type to integer

  1. Changes
    - Add a new column `birthyear` of type integer to the `bookings` table.
    - Populate the `birthyear` column with the year extracted from the `birthdate` column.
    - Drop the `birthdate` column.

  2. Rationale
    - The application only needs to store the birth year, not the full date.
    - Changing the column type to integer simplifies data handling and avoids date formatting issues.
*/

-- Add the birthyear column
ALTER TABLE bookings ADD COLUMN birthyear integer;

-- Update the birthyear column with the year from birthdate
UPDATE bookings SET birthyear = EXTRACT(YEAR FROM birthdate);

-- Make the birthyear column NOT NULL
ALTER TABLE bookings ALTER COLUMN birthyear SET NOT NULL;

-- Drop the birthdate column
ALTER TABLE bookings DROP COLUMN birthdate;