-- Fix infinite recursion in RLS policies by using security definer functions

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$;

-- Drop all existing policies on issues table to start fresh
DROP POLICY IF EXISTS "Public can view issues without contact info" ON public.issues;
DROP POLICY IF EXISTS "Authorities can view all issue details" ON public.issues;
DROP POLICY IF EXISTS "Users can view their own issues with contact info" ON public.issues;
DROP POLICY IF EXISTS "Authenticated users can create issues" ON public.issues;
DROP POLICY IF EXISTS "Users can update their own issues" ON public.issues;
DROP POLICY IF EXISTS "Authorities can update any issue" ON public.issues;

-- Create new policies using the security definer function

-- Anyone can view issues (this will be the main policy for public access)
CREATE POLICY "Anyone can view issues" 
ON public.issues 
FOR SELECT 
USING (true);

-- Authenticated users can create their own issues
CREATE POLICY "Authenticated users can create issues" 
ON public.issues 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own issues
CREATE POLICY "Users can update their own issues" 
ON public.issues 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Authorities can update any issue
CREATE POLICY "Authorities can update any issue" 
ON public.issues 
FOR UPDATE 
USING (public.get_current_user_role() IN ('authority', 'admin'));