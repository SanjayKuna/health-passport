
-- Add user_id to all tables
ALTER TABLE public.patient_profiles ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.medicines ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.weight_history ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.authorizations ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop old permissive RLS policies
DROP POLICY IF EXISTS "Allow public insert access to patient_profiles" ON public.patient_profiles;
DROP POLICY IF EXISTS "Allow public read access to patient_profiles" ON public.patient_profiles;
DROP POLICY IF EXISTS "Allow public update access to patient_profiles" ON public.patient_profiles;

DROP POLICY IF EXISTS "Allow public insert access to medicines" ON public.medicines;
DROP POLICY IF EXISTS "Allow public read access to medicines" ON public.medicines;

DROP POLICY IF EXISTS "Allow public insert access to weight_history" ON public.weight_history;
DROP POLICY IF EXISTS "Allow public read access to weight_history" ON public.weight_history;

DROP POLICY IF EXISTS "Allow public insert access to authorizations" ON public.authorizations;
DROP POLICY IF EXISTS "Allow public read access to authorizations" ON public.authorizations;
DROP POLICY IF EXISTS "Allow public update access to authorizations" ON public.authorizations;

-- New RLS: patient_profiles
CREATE POLICY "Users can read own profile" ON public.patient_profiles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own profile" ON public.patient_profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.patient_profiles FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- New RLS: medicines
CREATE POLICY "Users can read own medicines" ON public.medicines FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own medicines" ON public.medicines FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- New RLS: weight_history
CREATE POLICY "Users can read own weight_history" ON public.weight_history FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own weight_history" ON public.weight_history FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- New RLS: authorizations
CREATE POLICY "Users can read own authorizations" ON public.authorizations FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own authorizations" ON public.authorizations FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own authorizations" ON public.authorizations FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Allow anon to read patient_profiles for QR/doctor view (public sharing)
CREATE POLICY "Anon can read profiles for doctor view" ON public.patient_profiles FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can read medicines for doctor view" ON public.medicines FOR SELECT TO anon USING (true);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.patient_profiles (user_id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
