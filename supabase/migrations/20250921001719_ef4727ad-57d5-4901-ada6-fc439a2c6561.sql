-- Make birthdays and anniversaries viewable by everyone (public access)
-- This allows the church app to show celebrations without requiring authentication

-- Update RLS policy for birthdays to allow public read access
DROP POLICY IF EXISTS "Authenticated users can view birthdays" ON public.birthdays;
CREATE POLICY "Everyone can view birthdays"
  ON public.birthdays
  FOR SELECT
  USING (true);

-- Update RLS policy for wedding anniversaries to allow public read access  
DROP POLICY IF EXISTS "Authenticated users can view wedding anniversaries" ON public.wedding_anniversaries;
CREATE POLICY "Everyone can view wedding anniversaries"
  ON public.wedding_anniversaries
  FOR SELECT
  USING (true);