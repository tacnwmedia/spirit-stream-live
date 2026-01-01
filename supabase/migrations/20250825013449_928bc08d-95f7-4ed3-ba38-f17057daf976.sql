
-- Ensure RLS is enabled on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Remove self-update policy to prevent privilege escalation
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Allow only admins to update profiles (including role changes)
CREATE POLICY "Only admins can update profiles"
  ON public.profiles
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
