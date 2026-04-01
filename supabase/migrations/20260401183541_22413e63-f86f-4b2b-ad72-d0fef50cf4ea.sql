CREATE TABLE public.patient_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  age integer,
  blood_group text,
  height numeric,
  weight numeric,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.patient_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to patient_profiles"
  ON public.patient_profiles FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert access to patient_profiles"
  ON public.patient_profiles FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public update access to patient_profiles"
  ON public.patient_profiles FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);