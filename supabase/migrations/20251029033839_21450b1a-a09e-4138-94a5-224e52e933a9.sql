-- Create function to cleanup old admin logs and daily hymns
CREATE OR REPLACE FUNCTION public.cleanup_old_admin_data()
RETURNS TABLE(deleted_admin_logs integer, deleted_daily_hymns integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  admin_log_count integer := 0;
  daily_hymn_count integer := 0;
BEGIN
  -- Delete admin_logs older than 90 days
  WITH deleted_logs_cte AS (
    DELETE FROM public.admin_logs 
    WHERE created_at < CURRENT_DATE - INTERVAL '90 days'
    RETURNING id
  )
  SELECT COUNT(*) INTO admin_log_count FROM deleted_logs_cte;
  
  -- Delete daily_hymns older than 90 days
  WITH deleted_hymns_cte AS (
    DELETE FROM public.daily_hymns 
    WHERE hymn_date < CURRENT_DATE - INTERVAL '90 days'
    RETURNING id
  )
  SELECT COUNT(*) INTO daily_hymn_count FROM deleted_hymns_cte;
  
  RETURN QUERY SELECT admin_log_count, daily_hymn_count;
END;
$$;

-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the cleanup to run daily at 2 AM
SELECT cron.schedule(
  'cleanup-old-admin-data',
  '0 2 * * *', -- Every day at 2 AM
  $$
  SELECT public.cleanup_old_admin_data();
  $$
);