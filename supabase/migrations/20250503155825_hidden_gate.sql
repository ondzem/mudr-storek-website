/*
  # Update bookings table to allow NULL in note column

  1. Changes
    - Modify `note` column in `bookings` table to allow NULL values
  
  2. Reason
    - Users should be able to submit a booking without providing a note
    - The application is designed to handle empty notes
*/

-- Modify the column to allow NULL values
ALTER TABLE bookings ALTER COLUMN note DROP NOT NULL;