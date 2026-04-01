CREATE TABLE public.weight_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name text NOT NULL,
  weight numeric NOT NULL,
  recorded_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.weight_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to weight_history"
  ON public.weight_history FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert access to weight_history"
  ON public.weight_history FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);