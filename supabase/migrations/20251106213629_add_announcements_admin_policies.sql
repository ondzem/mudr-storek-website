/*
  # Add admin policies for announcements table
  
  1. Changes
    - Add INSERT policy for announcements (allows adding vacation dates)
    - Add UPDATE policy for announcements (allows editing announcements)
    - Add DELETE policy for announcements (allows removing vacation dates)
  
  2. Security
    - Policies allow anon role (since admin auth is in localStorage, not Supabase)
    - INSERT/UPDATE/DELETE are open to allow admin functionality
    - SELECT remains restricted to active announcements only
*/

-- Add INSERT policy for announcements
CREATE POLICY "announcements_insert_policy"
  ON announcements
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Add UPDATE policy for announcements
CREATE POLICY "announcements_update_policy"
  ON announcements
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Add DELETE policy for announcements
CREATE POLICY "announcements_delete_policy"
  ON announcements
  FOR DELETE
  TO anon, authenticated
  USING (true);
