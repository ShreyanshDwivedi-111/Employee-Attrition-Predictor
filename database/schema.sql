-- Supabase Schema for Employee Attrition Prediction System

-- If using Supabase Auth (auth.users), you can link to it. 
-- For a custom users table as requested:
CREATE TABLE public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Prediction History Table
CREATE TABLE public.prediction_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    employee_data JSONB NOT NULL,
    prediction_result TEXT NOT NULL,
    probability NUMERIC NOT NULL,
    reasons JSONB,
    solutions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) setup (Optional but recommended)
-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prediction_history ENABLE ROW LEVEL SECURITY;

-- Allow inserts/selects for authenticated users (assuming custom auth, we might bypass RLS for now or set logic).
-- For this project, if we are doing logic entirely through the backend with a service key, 
-- we can just disable RLS or allow service role full access.
CREATE POLICY "Enable read/write for all" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable read/write for all" ON public.prediction_history FOR ALL USING (true) WITH CHECK (true);
