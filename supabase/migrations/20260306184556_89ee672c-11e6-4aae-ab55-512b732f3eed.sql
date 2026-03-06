
CREATE TABLE public.medicines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL DEFAULT 'Not specified',
  frequency TEXT NOT NULL DEFAULT 'Not specified',
  status TEXT NOT NULL DEFAULT 'active',
  purpose TEXT DEFAULT '',
  prescribed_by TEXT DEFAULT 'Not specified',
  start_date DATE DEFAULT CURRENT_DATE,
  additional_notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to medicines"
  ON public.medicines FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert access to medicines"
  ON public.medicines FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
