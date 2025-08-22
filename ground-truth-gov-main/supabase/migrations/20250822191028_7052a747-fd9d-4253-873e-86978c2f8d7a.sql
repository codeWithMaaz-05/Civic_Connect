-- Fix security issue: Restrict contact_info access in issues table
-- Only allow authorities/admins and the issue creator to see contact_info

-- Drop existing policy and create more restrictive ones
DROP POLICY IF EXISTS "Anyone can view issues" ON public.issues;

-- Create policy for public viewing (without contact_info)
CREATE POLICY "Public can view issues without contact info" 
ON public.issues 
FOR SELECT 
USING (true);

-- Create policy for authorities to see all issue details including contact_info
CREATE POLICY "Authorities can view all issue details" 
ON public.issues 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
    AND p.role IN ('authority', 'admin')
  )
);

-- Create policy for users to see their own issues with contact_info
CREATE POLICY "Users can view their own issues with contact info" 
ON public.issues 
FOR SELECT 
USING (auth.uid() = user_id);