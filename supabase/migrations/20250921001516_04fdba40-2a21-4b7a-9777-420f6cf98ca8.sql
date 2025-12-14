-- Create month-only optimized RPCs and functional indexes for birthdays and anniversaries

-- Functional indexes for faster EXTRACT(MONTH ...) filtering
CREATE INDEX IF NOT EXISTS idx_birthdays_month
  ON public.birthdays ((EXTRACT(MONTH FROM birthday)));

CREATE INDEX IF NOT EXISTS idx_wedding_anniversaries_month
  ON public.wedding_anniversaries ((EXTRACT(MONTH FROM anniversary_date)));

-- RPC: Current month birthdays (ignoring year)
CREATE OR REPLACE FUNCTION public.get_current_month_birthdays()
RETURNS TABLE (id uuid, name text, birthday date)
LANGUAGE sql
STABLE
AS $$
  SELECT b.id, b.name, b.birthday
  FROM public.birthdays b
  WHERE EXTRACT(MONTH FROM b.birthday) = EXTRACT(MONTH FROM now())
  ORDER BY EXTRACT(DAY FROM b.birthday), b.name;
$$;

-- RPC: Current month wedding anniversaries (ignoring year)
CREATE OR REPLACE FUNCTION public.get_current_month_anniversaries()
RETURNS TABLE (id uuid, name text, anniversary_date date)
LANGUAGE sql
STABLE
AS $$
  SELECT w.id, w.name, w.anniversary_date
  FROM public.wedding_anniversaries w
  WHERE EXTRACT(MONTH FROM w.anniversary_date) = EXTRACT(MONTH FROM now())
  ORDER BY EXTRACT(DAY FROM w.anniversary_date), w.name;
$$;