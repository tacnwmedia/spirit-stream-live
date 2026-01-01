-- Fix security vulnerability: Restrict birthdays table access to authenticated users only
-- Drop the current public access policy
DROP POLICY IF EXISTS "Everyone can view birthdays" ON public.birthdays;

-- Create a new policy that requires authentication
CREATE POLICY "Authenticated users can view birthdays" 
ON public.birthdays 
FOR SELECT 
USING (auth.role() = 'authenticated'::text);