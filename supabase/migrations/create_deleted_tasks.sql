/*
  # Create deleted_tasks table to track task deletion history
  
  1. New Tables
    - `deleted_tasks`
      - `id` (uuid, primary key) 
      - `task_id` (uuid) - Original task ID
      - `text` (text) - Task content
      - `completed` (boolean) - Task completion status at deletion
      - `deleted_at` (timestamptz) - When the task was deleted
      - `created_at` (timestamptz) - Original task creation time

  2. Security
    - Enable RLS
    - Add policy for public access
*/

CREATE TABLE deleted_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL,
  text text NOT NULL,
  completed boolean DEFAULT false,
  deleted_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE deleted_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON deleted_tasks
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON deleted_tasks
  FOR INSERT WITH CHECK (true);