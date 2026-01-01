-- Create function to automatically delete old topics and events (older than 90 days)
CREATE OR REPLACE FUNCTION public.cleanup_old_records()
RETURNS TABLE(deleted_topics integer, deleted_events integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  topic_count integer := 0;
  event_count integer := 0;
BEGIN
  -- Delete topics older than 90 days
  WITH deleted_topics_cte AS (
    DELETE FROM public.topics 
    WHERE topic_date < CURRENT_DATE - INTERVAL '90 days'
    RETURNING id
  )
  SELECT COUNT(*) INTO topic_count FROM deleted_topics_cte;
  
  -- Delete events older than 90 days
  WITH deleted_events_cte AS (
    DELETE FROM public.events 
    WHERE event_date < CURRENT_DATE - INTERVAL '90 days'
    RETURNING id
  )
  SELECT COUNT(*) INTO event_count FROM deleted_events_cte;
  
  RETURN QUERY SELECT topic_count, event_count;
END;
$$;

-- Create function to delete all topics
CREATE OR REPLACE FUNCTION public.delete_all_topics()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  deleted_count integer := 0;
BEGIN
  -- Only admins can delete all topics
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;
  
  WITH deleted_cte AS (
    DELETE FROM public.topics 
    RETURNING id
  )
  SELECT COUNT(*) INTO deleted_count FROM deleted_cte;
  
  RETURN deleted_count;
END;
$$;

-- Create function to delete all events
CREATE OR REPLACE FUNCTION public.delete_all_events()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  deleted_count integer := 0;
BEGIN
  -- Only admins can delete all events
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;
  
  WITH deleted_cte AS (
    DELETE FROM public.events 
    RETURNING id
  )
  SELECT COUNT(*) INTO deleted_count FROM deleted_cte;
  
  RETURN deleted_count;
END;
$$;