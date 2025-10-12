-- Fix email protection without using problematic views

-- Remove the view completely since RLS doesn't work on views the way we need
DROP VIEW IF EXISTS public.safe_profiles;

-- Create a more secure email access function that validates access properly
CREATE OR REPLACE FUNCTION public.get_secure_email(target_user_id uuid DEFAULT NULL)
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  requesting_user_id uuid;
  target_id uuid;
  user_email text;
  is_requesting_user_admin boolean;
BEGIN
  requesting_user_id := auth.uid();
  target_id := COALESCE(target_user_id, requesting_user_id);
  
  -- Check if user is authenticated
  IF requesting_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Check if requesting user is admin
  SELECT is_admin() INTO is_requesting_user_admin;
  
  -- Only allow access if user is admin or accessing their own email
  IF NOT (is_requesting_user_admin OR requesting_user_id = target_id) THEN
    -- Log the unauthorized access attempt
    INSERT INTO public.security_audit_log (user_id, action, details)
    VALUES (
      requesting_user_id,
      'unauthorized_email_access_attempt',
      jsonb_build_object(
        'target_user_id', target_id,
        'timestamp', now()
      )
    );
    RAISE EXCEPTION 'Unauthorized access to email data';
  END IF;
  
  -- Get the email securely
  SELECT email INTO user_email
  FROM public.profiles 
  WHERE user_id = target_id;
  
  -- Log successful access
  INSERT INTO public.security_audit_log (user_id, action, details)
  VALUES (
    requesting_user_id,
    'email_access_granted',
    jsonb_build_object(
      'target_user_id', target_id,
      'is_admin_access', is_requesting_user_admin,
      'timestamp', now()
    )
  );
  
  RETURN user_email;
END;
$$;

-- Create a function to check if current user can access a specific profile's email
CREATE OR REPLACE FUNCTION public.can_access_email(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  requesting_user_id uuid;
BEGIN
  requesting_user_id := auth.uid();
  
  -- Must be authenticated
  IF requesting_user_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Can access if admin or own profile
  RETURN (is_admin() OR requesting_user_id = target_user_id);
END;
$$;

-- Add a comment to the profiles table about email security
COMMENT ON COLUMN public.profiles.email IS 'Email addresses are protected by RLS policies and should only be accessed via secure functions like get_secure_email()';