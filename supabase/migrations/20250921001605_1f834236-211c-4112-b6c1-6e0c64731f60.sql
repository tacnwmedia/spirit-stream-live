-- Fix security warnings by adding search_path to functions

-- Drop existing functions to recreate with proper security
DROP FUNCTION IF EXISTS public.get_current_month_birthdays();
DROP FUNCTION IF EXISTS public.get_current_month_anniversaries();

-- RPC: Current month birthdays (ignoring year) with secure search_path
CREATE OR REPLACE FUNCTION public.get_current_month_birthdays()
RETURNS TABLE (id uuid, name text, birthday date)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT b.id, b.name, b.birthday
  FROM public.birthdays b
  WHERE EXTRACT(MONTH FROM b.birthday) = EXTRACT(MONTH FROM now())
  ORDER BY EXTRACT(DAY FROM b.birthday), b.name;
$$;

-- RPC: Current month wedding anniversaries (ignoring year) with secure search_path
CREATE OR REPLACE FUNCTION public.get_current_month_anniversaries()
RETURNS TABLE (id uuid, name text, anniversary_date date)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT w.id, w.name, w.anniversary_date
  FROM public.wedding_anniversaries w
  WHERE EXTRACT(MONTH FROM w.anniversary_date) = EXTRACT(MONTH FROM now())
  ORDER BY EXTRACT(DAY FROM w.anniversary_date), w.name;
$$;