-- Add explicit policy to deny anonymous access to profiles table
-- This ensures only authenticated users can access profile data

-- Policy to explicitly deny anonymous SELECT access
CREATE POLICY "Deny anonymous access to profiles" 
ON public.profiles 
FOR SELECT 
TO anon 
USING (false);

-- Policy to explicitly deny anonymous INSERT access  
CREATE POLICY "Deny anonymous insert to profiles" 
ON public.profiles 
FOR INSERT 
TO anon 
WITH CHECK (false);

-- Policy to explicitly deny anonymous UPDATE access
CREATE POLICY "Deny anonymous update to profiles" 
ON public.profiles 
FOR UPDATE 
TO anon 
USING (false);

-- Policy to explicitly deny anonymous DELETE access
CREATE POLICY "Deny anonymous delete to profiles" 
ON public.profiles 
FOR DELETE 
TO anon 
USING (false);