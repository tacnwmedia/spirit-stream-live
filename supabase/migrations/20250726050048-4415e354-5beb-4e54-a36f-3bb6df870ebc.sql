-- Create user profiles table with roles
CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- Profiles policies
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = user_id);

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, role)
  VALUES (
    NEW.id, 
    NEW.email,
    CASE 
      WHEN NEW.email = 'admin@church.com' THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update RLS policies to use proper authentication

-- Fix birthdays policies
DROP POLICY IF EXISTS "Admins can manage birthdays" ON public.birthdays;
DROP POLICY IF EXISTS "Birthdays are publicly readable" ON public.birthdays;

CREATE POLICY "Everyone can view birthdays" 
  ON public.birthdays FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can manage birthdays" 
  ON public.birthdays FOR ALL 
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Fix church_settings policies  
DROP POLICY IF EXISTS "Admins can manage church settings" ON public.church_settings;
DROP POLICY IF EXISTS "Church settings are publicly readable" ON public.church_settings;

CREATE POLICY "Everyone can view church settings" 
  ON public.church_settings FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can manage church settings" 
  ON public.church_settings FOR ALL 
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Fix daily_hymns policies
DROP POLICY IF EXISTS "Admins can manage daily hymns" ON public.daily_hymns;
DROP POLICY IF EXISTS "Daily hymns are publicly readable" ON public.daily_hymns;

CREATE POLICY "Everyone can view daily hymns" 
  ON public.daily_hymns FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can manage daily hymns" 
  ON public.daily_hymns FOR ALL 
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Fix events policies
DROP POLICY IF EXISTS "Admins can manage events" ON public.events;
DROP POLICY IF EXISTS "Events are publicly readable" ON public.events;

CREATE POLICY "Everyone can view events" 
  ON public.events FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can manage events" 
  ON public.events FOR ALL 
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Fix hymns policies
DROP POLICY IF EXISTS "Admins can manage hymns" ON public.hymns;
DROP POLICY IF EXISTS "Hymns are publicly readable" ON public.hymns;

CREATE POLICY "Everyone can view hymns" 
  ON public.hymns FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can manage hymns" 
  ON public.hymns FOR ALL 
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Add trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();