/*
  # Add cancellation_token column to bookings table
  
  1. Changes
    - Add cancellation_token column if it doesn't exist
    - Set default value to random UUID
    - Ensure existing rows get a value
    - Add index for faster lookups
  
  2. Security
    - Maintains existing RLS policies
    - Ensures each booking has a unique token for secure cancellation
*/

-- Add cancellation_token column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'cancellation_token'
  ) THEN
    -- Add the column
    ALTER TABLE bookings ADD COLUMN cancellation_token uuid DEFAULT gen_random_uuid();
    
    -- Update existing rows to have a cancellation token
    UPDATE bookings SET cancellation_token = gen_random_uuid() WHERE cancellation_token IS NULL;
    
    -- Make the column NOT NULL
    ALTER TABLE bookings ALTER COLUMN cancellation_token SET NOT NULL;
    
    -- Add index for faster lookups
    CREATE INDEX IF NOT EXISTS idx_bookings_cancellation_token ON bookings(cancellation_token);
  END IF;
END $$;