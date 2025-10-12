-- Ensure a profile exists for the authenticated user; create if missing
CREATE OR REPLACE FUNCTION public.ensure_profile_exists()
RETURNS TABLE (user_id uuid, role text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_uuid uuid;
  user_email text;
BEGIN
  user_uuid := auth.uid();
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Read email from auth.users for this user
  SELECT email INTO user_email FROM auth.users WHERE id = user_uuid;

  -- Create profile if missing
  IF NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = user_uuid) THEN
    INSERT INTO public.profiles (user_id, email, role)
    VALUES (
      user_uuid,
      user_email,
      CASE 
        WHEN user_email = 'admin@church.com' THEN 'admin'
        ELSE 'user'
      END
    );
  END IF;

  -- Return the (now ensured) profile basics
  RETURN QUERY
  SELECT p.user_id, p.role
  FROM public.profiles p
  WHERE p.user_id = user_uuid;
END;
$$;

GRANT EXECUTE ON FUNCTION public.ensure_profile_exists() TO authenticated;