/*
  # Update todos policies for public access and remove user_id constraint
  
  1. Changes
    - Make user_id nullable
    - Update policies for public access
    - Remove user_id constraints
*/

-- Make user_id nullable
ALTER TABLE todos ALTER COLUMN user_id DROP NOT NULL;

-- Enable RLS
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can create their own todos" ON todos;
  DROP POLICY IF EXISTS "Users can view their own todos" ON todos;
  DROP POLICY IF EXISTS "Users can update their own todos" ON todos;
  DROP POLICY IF EXISTS "Users can delete their own todos" ON todos;
  DROP POLICY IF EXISTS "Enable read access for all users" ON todos;
  DROP POLICY IF EXISTS "Enable insert access for all users" ON todos;
  DROP POLICY IF EXISTS "Enable update access for all users" ON todos;
  DROP POLICY IF EXISTS "Enable delete access for all users" ON todos;
END $$;

-- Create public access policies
CREATE POLICY "Enable read access for all users"
  ON todos FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable insert access for all users"
  ON todos FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Enable update access for all users"
  ON todos FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete access for all users"
  ON todos FOR DELETE
  TO public
  USING (true);
