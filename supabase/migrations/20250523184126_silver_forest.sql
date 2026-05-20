/*
  # Add cancelled_at column to bookings table
  
  1. Changes
    - Add `cancelled_at` column to the `bookings` table
    - This column is used to track when a booking was cancelled
    - The column is nullable to maintain compatibility with existing code
  
  2. Security
    - No changes to RLS policies
*/

-- Add the cancelled_at column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'cancelled_at'
  ) THEN
    ALTER TABLE bookings ADD COLUMN cancelled_at timestamptz;
  END IF;
END $$;