/*
  # Add Unique Constraint for Booking Time Slots

  1. Changes
    - Add a partial unique index on (appointment_date, appointment_time)
    - Only applies to non-cancelled bookings (cancelled_at IS NULL)
    - This prevents double-booking at the database level
    - Race conditions are now impossible

  2. Security
    - No changes to RLS policies
    - Maintains existing security model

  3. Technical Details
    - Uses partial unique index to allow multiple cancelled bookings
    - Database-level constraint is atomic and prevents race conditions
    - Will return error if duplicate booking is attempted
*/

-- Create a partial unique index that prevents duplicate bookings
-- Only active (non-cancelled) bookings are considered
CREATE UNIQUE INDEX IF NOT EXISTS unique_active_booking_slot 
ON bookings (appointment_date, appointment_time) 
WHERE cancelled_at IS NULL;
