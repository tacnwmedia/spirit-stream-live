-- Create wedding_anniversaries table
CREATE TABLE public.wedding_anniversaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  anniversary_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.wedding_anniversaries ENABLE ROW LEVEL SECURITY;

-- Create policies for wedding anniversaries (same as birthdays)
CREATE POLICY "Authenticated users can view wedding anniversaries" 
ON public.wedding_anniversaries 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can manage wedding anniversaries" 
ON public.wedding_anniversaries 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_wedding_anniversaries_updated_at
BEFORE UPDATE ON public.wedding_anniversaries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();