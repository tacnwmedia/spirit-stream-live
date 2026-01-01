-- Create announcements table for displaying messages on the main page
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for efficient queries
CREATE INDEX IF NOT EXISTS idx_announcements_active ON public.announcements(is_active, expires_at);

-- Enable Row Level Security
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to active announcements
CREATE POLICY "Allow public read access to announcements"
  ON public.announcements
  FOR SELECT
  TO public
  USING (true);

-- Policy: Allow authenticated admins to insert
CREATE POLICY "Allow admins to insert announcements"
  ON public.announcements
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Policy: Allow authenticated admins to update
CREATE POLICY "Allow admins to update announcements"
  ON public.announcements
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Policy: Allow authenticated admins to delete
CREATE POLICY "Allow admins to delete announcements"
  ON public.announcements
  FOR DELETE
  TO authenticated
  USING (is_admin());

