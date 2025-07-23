-- Create hymns table to store the CSV data
CREATE TABLE public.hymns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hymn_number INTEGER NOT NULL,
  line_number INTEGER NOT NULL,
  line_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries by hymn number
CREATE INDEX idx_hymns_number ON public.hymns(hymn_number);

-- Create compound index for ordering lines within hymns
CREATE INDEX idx_hymns_number_line ON public.hymns(hymn_number, line_number);

-- Enable Row Level Security
ALTER TABLE public.hymns ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (everyone can view hymns)
CREATE POLICY "Hymns are publicly readable" 
ON public.hymns 
FOR SELECT 
USING (true);

-- Create policy for admin insert/update (you'll need auth later)
CREATE POLICY "Admins can manage hymns" 
ON public.hymns 
FOR ALL
USING (true)
WITH CHECK (true);

-- Create other tables for the admin panel
CREATE TABLE public.church_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for church settings
ALTER TABLE public.church_settings ENABLE ROW LEVEL SECURITY;

-- Public read policy for church settings
CREATE POLICY "Church settings are publicly readable" 
ON public.church_settings 
FOR SELECT 
USING (true);

-- Admin management policy for church settings
CREATE POLICY "Admins can manage church settings" 
ON public.church_settings 
FOR ALL
USING (true)
WITH CHECK (true);

-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Public read policy for events
CREATE POLICY "Events are publicly readable" 
ON public.events 
FOR SELECT 
USING (true);

-- Admin management policy for events
CREATE POLICY "Admins can manage events" 
ON public.events 
FOR ALL
USING (true)
WITH CHECK (true);

-- Create birthdays table
CREATE TABLE public.birthdays (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  birthday DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for birthdays
ALTER TABLE public.birthdays ENABLE ROW LEVEL SECURITY;

-- Public read policy for birthdays
CREATE POLICY "Birthdays are publicly readable" 
ON public.birthdays 
FOR SELECT 
USING (true);

-- Admin management policy for birthdays
CREATE POLICY "Admins can manage birthdays" 
ON public.birthdays 
FOR ALL
USING (true)
WITH CHECK (true);

-- Create daily hymns table to track opening/closing hymns
CREATE TABLE public.daily_hymns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hymn_date DATE NOT NULL DEFAULT CURRENT_DATE,
  opening_hymn_number INTEGER,
  closing_hymn_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for daily hymns
ALTER TABLE public.daily_hymns ENABLE ROW LEVEL SECURITY;

-- Public read policy for daily hymns
CREATE POLICY "Daily hymns are publicly readable" 
ON public.daily_hymns 
FOR SELECT 
USING (true);

-- Admin management policy for daily hymns
CREATE POLICY "Admins can manage daily hymns" 
ON public.daily_hymns 
FOR ALL
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_hymns_updated_at
  BEFORE UPDATE ON public.hymns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_church_settings_updated_at
  BEFORE UPDATE ON public.church_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_birthdays_updated_at
  BEFORE UPDATE ON public.birthdays
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_daily_hymns_updated_at
  BEFORE UPDATE ON public.daily_hymns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial church settings
INSERT INTO public.church_settings (setting_key, setting_value) VALUES
('watchword', 'Trust in the Lord with all your heart and lean not on your own understanding.'),
('current_opening_hymn', '25'),
('current_closing_hymn', '134');

-- Insert initial daily hymns for today
INSERT INTO public.daily_hymns (opening_hymn_number, closing_hymn_number) VALUES (25, 134);

-- Insert some sample events
INSERT INTO public.events (title, event_date, event_time, description) VALUES
('Sunday Morning Service', '2025-01-26', '10:00', 'Weekly worship service'),
('Bible Study', '2025-01-29', '19:00', 'Midweek Bible study and prayer'),
('Youth Meeting', '2025-02-01', '18:00', 'Monthly youth gathering');

-- Insert some sample birthdays
INSERT INTO public.birthdays (name, birthday) VALUES
('John Smith', '1980-03-15'),
('Mary Johnson', '1975-03-22'),
('David Wilson', '1990-03-08');