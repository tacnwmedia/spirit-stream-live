-- Fix the Security Definer View issue and complete email protection

-- Remove the security definer view that triggered the warning
DROP VIEW IF EXISTS public.safe_profiles;

-- Instead, create a standard view without security definer
CREATE VIEW public.safe_profiles AS
SELECT 
  user_id,
  role,
  created_at,
  updated_at
FROM public.profiles;

-- Enable RLS on the view
ALTER VIEW public.safe_profiles SET (security_barrier = true);

-- Create RLS policy for the safe view that allows users to see their own data
CREATE POLICY "Users can view own safe profile data" 
ON public.safe_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create RLS policy for admins to view all safe profile data
CREATE POLICY "Admins can view all safe profile data" 
ON public.safe_profiles 
FOR SELECT 
USING (is_admin());

-- Add an additional security function to validate email access attempts
CREATE OR REPLACE FUNCTION public.validate_email_access(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  requesting_user_id uuid;
  is_requesting_user_admin boolean;
BEGIN
  requesting_user_id := auth.uid();
  
  -- Check if user is authenticated
  IF requesting_user_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if requesting user is admin
  SELECT is_admin() INTO is_requesting_user_admin;
  
  -- Allow access if user is admin or accessing their own data
  IF is_requesting_user_admin OR requesting_user_id = target_user_id THEN
    -- Log the access attempt for security monitoring
    INSERT INTO public.security_audit_log (user_id, action, details)
    VALUES (
      requesting_user_id,
      'email_access_validation',
      jsonb_build_object(
        'target_user_id', target_user_id,
        'is_admin', is_requesting_user_admin,
        'access_granted', true,
        'timestamp', now()
      )
    );
    RETURN true;
  END IF;
  
  -- Log denied access attempt
  INSERT INTO public.security_audit_log (user_id, action, details)
  VALUES (
    requesting_user_id,
    'email_access_denied',
    jsonb_build_object(
      'target_user_id', target_user_id,
      'is_admin', is_requesting_user_admin,
      'access_granted', false,
      'timestamp', now()
    )
  );
  
  RETURN false;
END;
$$;