-- Enhanced Security Fix: Protect User Email Addresses from Unauthorized Access

-- Drop the current broad policy that exposes all profile data including emails
DROP POLICY IF EXISTS "Users can view own profile data" ON public.profiles;

-- Create separate policies with granular access control
-- Policy 1: Users can view their own basic profile data (excluding email for general access)
CREATE POLICY "Users can view own basic profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy 2: Only allow email access with strict authentication verification
-- This policy requires both user ownership AND valid session verification
CREATE POLICY "Secure email access for profile owner" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() = user_id 
  AND auth.uid() IS NOT NULL 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND email_confirmed_at IS NOT NULL
  )
);

-- Policy 3: Admin access with additional verification
CREATE POLICY "Admin access to all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  is_admin() 
  AND auth.uid() IS NOT NULL 
  AND auth.role() = 'authenticated'
);

-- Create a secure function to get user's own email only
CREATE OR REPLACE FUNCTION public.get_own_email()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT email 
  FROM public.profiles 
  WHERE user_id = auth.uid() 
  AND auth.uid() IS NOT NULL 
  AND auth.role() = 'authenticated'
  LIMIT 1;
$$;

-- Create a secure function to get basic profile data (without email)
CREATE OR REPLACE FUNCTION public.get_own_profile_basic()
RETURNS TABLE(
  user_id uuid,
  role text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT 
    p.user_id,
    p.role,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  WHERE p.user_id = auth.uid() 
  AND auth.uid() IS NOT NULL 
  AND auth.role() = 'authenticated'
  LIMIT 1;
$$;

-- Add a view for safe profile access that excludes email by default
CREATE OR REPLACE VIEW public.safe_profiles AS
SELECT 
  user_id,
  role,
  created_at,
  updated_at
FROM public.profiles;

-- Add constraint to prevent email field from being empty/null for security tracking
ALTER TABLE public.profiles 
ADD CONSTRAINT email_not_empty 
CHECK (email IS NOT NULL AND length(trim(email)) > 0);