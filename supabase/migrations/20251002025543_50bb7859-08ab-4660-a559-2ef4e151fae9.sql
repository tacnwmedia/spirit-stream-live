-- Create admin_logs table for tracking admin activities
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- Create index for faster queries
CREATE INDEX idx_admin_logs_user_id ON public.admin_logs(user_id);
CREATE INDEX idx_admin_logs_created_at ON public.admin_logs(created_at DESC);

-- RLS Policies: Only admins can view logs, system can insert
CREATE POLICY "Admins can view all logs"
  ON public.admin_logs
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Authenticated users can insert logs"
  ON public.admin_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);