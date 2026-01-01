-- Drop existing hymns table and create new hymn_lines structure
DROP TABLE IF EXISTS public.hymns CASCADE;

-- Create new hymn_lines table with structured verse/line tracking
CREATE TABLE public.hymn_lines (
  id SERIAL PRIMARY KEY,
  hymn_number INTEGER NOT NULL,
  verse_number INTEGER NOT NULL,
  line_number INTEGER NOT NULL,
  text TEXT NOT NULL,
  chorus BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for efficient querying
CREATE INDEX idx_hymn_lines_hymn_number ON public.hymn_lines(hymn_number);
CREATE INDEX idx_hymn_lines_verse_line ON public.hymn_lines(hymn_number, verse_number, line_number);

-- Enable RLS
ALTER TABLE public.hymn_lines ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Everyone can view hymn lines" 
ON public.hymn_lines 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage hymn lines" 
ON public.hymn_lines 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- Create trigger for updating timestamps
CREATE TRIGGER update_hymn_lines_updated_at
BEFORE UPDATE ON public.hymn_lines
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();