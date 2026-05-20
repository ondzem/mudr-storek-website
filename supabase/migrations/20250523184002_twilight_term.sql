/*
  # Add cancelled_at column to bookings table

  1. Changes
    - Add `cancelled_at` timestamp column to the `bookings` table to track when bookings are cancelled
  
  2. Purpose
    - Support booking cancellation functionality in the application
    - Allow tracking when users cancel their appointments
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'cancelled_at'
  ) THEN
    ALTER TABLE bookings ADD COLUMN cancelled_at timestamptz DEFAULT NULL;
  END IF;
END $$;