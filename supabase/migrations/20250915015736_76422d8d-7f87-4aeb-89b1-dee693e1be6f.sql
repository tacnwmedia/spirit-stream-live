-- Critical Security Fixes for Profiles Table

-- Drop existing policies that may be too permissive
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Only admins can update profiles" ON public.profiles;

-- Create secure policies for profiles table
-- Users can only view their own email, admins can view all
CREATE POLICY "Users can view own profile data" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id OR is_admin());

-- Prevent users from updating their own role - only admins can do this
CREATE POLICY "Users can update own profile except role" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id AND 
  role = (SELECT role FROM public.profiles WHERE user_id = auth.uid())
);

-- Only admins can update any profile including roles
CREATE POLICY "Admins can update any profile" 
ON public.profiles 
FOR UPDATE 
USING (is_admin())
WITH CHECK (is_admin());

-- Only admins can insert new profiles (via trigger)
CREATE POLICY "Only system can insert profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (is_admin());

-- Create audit log table for security events
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs" 
ON public.security_audit_log 
FOR SELECT 
USING (is_admin());

-- Function to log role changes
CREATE OR REPLACE FUNCTION public.log_role_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Log role changes
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    INSERT INTO public.security_audit_log (user_id, action, details)
    VALUES (
      NEW.user_id,
      'role_change',
      jsonb_build_object(
        'old_role', OLD.role,
        'new_role', NEW.role,
        'changed_by', auth.uid()
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for role change logging
DROP TRIGGER IF EXISTS audit_role_changes ON public.profiles;
CREATE TRIGGER audit_role_changes
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_role_change();

-- Add constraint to prevent direct role escalation
ALTER TABLE public.profiles 
ADD CONSTRAINT check_role_values 
CHECK (role IN ('user', 'admin'));

-- Create function to safely update user profile (excluding role)
CREATE OR REPLACE FUNCTION public.update_user_profile(
  p_email text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  current_user_id uuid;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Update only non-sensitive fields
  UPDATE public.profiles 
  SET 
    email = COALESCE(p_email, email),
    updated_at = now()
  WHERE user_id = current_user_id;
  
  RETURN true;
END;
$$;