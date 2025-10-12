-- Fix the delete_all_events and delete_all_topics functions
-- The issue is that PostgreSQL requires a WHERE clause for DELETE statements

-- Drop and recreate the delete_all_events function
DROP FUNCTION IF EXISTS public.delete_all_events();

CREATE OR REPLACE FUNCTION public.delete_all_events()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  deleted_count integer := 0;
BEGIN
  -- Only admins can delete all events
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;
  
  -- Use WHERE true to satisfy PostgreSQL's requirement for a WHERE clause
  WITH deleted_cte AS (
    DELETE FROM public.events 
    WHERE true  -- This satisfies the WHERE clause requirement
    RETURNING id
  )
  SELECT COUNT(*) INTO deleted_count FROM deleted_cte;
  
  RETURN deleted_count;
END;
$function$;

-- Drop and recreate the delete_all_topics function
DROP FUNCTION IF EXISTS public.delete_all_topics();

CREATE OR REPLACE FUNCTION public.delete_all_topics()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  deleted_count integer := 0;
BEGIN
  -- Only admins can delete all topics
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;
  
  -- Use WHERE true to satisfy PostgreSQL's requirement for a WHERE clause
  WITH deleted_cte AS (
    DELETE FROM public.topics 
    WHERE true  -- This satisfies the WHERE clause requirement
    RETURNING id
  )
  SELECT COUNT(*) INTO deleted_count FROM deleted_cte;
  
  RETURN deleted_count;
END;
$function$;