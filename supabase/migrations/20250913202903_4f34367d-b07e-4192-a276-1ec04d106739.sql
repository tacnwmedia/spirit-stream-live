-- Create function to automatically delete old topics and events (older than 90 days)
CREATE OR REPLACE FUNCTION public.cleanup_old_records()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Delete topics older than 90 days
  DELETE FROM public.topics 
  WHERE topic_date < CURRENT_DATE - INTERVAL '90 days';
  
  -- Delete events older than 90 days
  DELETE FROM public.events 
  WHERE event_date < CURRENT_DATE - INTERVAL '90 days';
END;
$$;

-- Create a trigger to run the cleanup function daily
-- This will automatically clean up old records every day at midnight
SELECT cron.schedule(
  'cleanup-old-records',
  '0 0 * * *', -- Daily at midnight
  $$
  SELECT public.cleanup_old_records();
  $$
);