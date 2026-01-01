-- Create daily_other_hymns table for storing additional hymns beyond opening/closing
CREATE TABLE IF NOT EXISTS public.daily_other_hymns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hymn_date DATE NOT NULL,
  hymn_number INTEGER NOT NULL,
  label TEXT DEFAULT 'Other Hymn',
  display_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for efficient date lookups
CREATE INDEX IF NOT EXISTS idx_daily_other_hymns_date ON public.daily_other_hymns(hymn_date);

-- Enable Row Level Security
ALTER TABLE public.daily_other_hymns ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access
CREATE POLICY "Allow public read access to daily_other_hymns"
  ON public.daily_other_hymns
  FOR SELECT
  TO public
  USING (true);

-- Policy: Allow authenticated admins to insert
CREATE POLICY "Allow admins to insert daily_other_hymns"
  ON public.daily_other_hymns
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Allow authenticated admins to update
CREATE POLICY "Allow admins to update daily_other_hymns"
  ON public.daily_other_hymns
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Allow authenticated admins to delete
CREATE POLICY "Allow admins to delete daily_other_hymns"
  ON public.daily_other_hymns
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

