
CREATE TABLE public.authorizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  medicine_id UUID REFERENCES public.medicines(id) ON DELETE CASCADE NOT NULL,
  patient_name TEXT NOT NULL,
  insurance_provider TEXT NOT NULL DEFAULT 'General Insurance',
  status TEXT NOT NULL DEFAULT 'pending',
  request_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  diagnosis TEXT,
  clinical_justification TEXT,
  ai_generated_summary TEXT,
  policy_check_result TEXT,
  submission_package JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.authorizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to authorizations"
  ON public.authorizations FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert access to authorizations"
  ON public.authorizations FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public update access to authorizations"
  ON public.authorizations FOR UPDATE TO anon, authenticated
  USING (true) WITH CHECK (true);
