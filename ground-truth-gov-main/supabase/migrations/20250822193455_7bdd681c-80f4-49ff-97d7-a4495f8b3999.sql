-- Fix security issue: Create secure public view for issues without contact_info
-- This ensures citizens' personal contact information is only visible to authorities and issue creators

-- Create a public view that excludes sensitive contact information
CREATE OR REPLACE VIEW public.issues_public AS
SELECT 
  id,
  title,
  description,
  category,
  location,
  status,
  priority,
  image_url,
  user_id,
  assigned_to,
  created_at,
  updated_at
FROM public.issues;

-- Enable RLS on the view
ALTER VIEW public.issues_public SET (security_barrier = true);

-- Grant access to the public view
GRANT SELECT ON public.issues_public TO anon, authenticated;

-- Create RLS policies for the public view
CREATE POLICY "Anyone can view public issues data" 
ON public.issues_public 
FOR SELECT 
USING (true);

-- Update the main issues table policies to be more restrictive
-- Drop the overly permissive "Anyone can view issues" policy
DROP POLICY IF EXISTS "Anyone can view issues" ON public.issues;

-- Create more specific policies for the main issues table

-- Only authenticated users can view issues with contact_info (for their own issues)
CREATE POLICY "Users can view their own issues with contact info" 
ON public.issues 
FOR SELECT 
USING (auth.uid() = user_id);

-- Authorities can view all issues with contact_info
CREATE POLICY "Authorities can view all issues with contact info" 
ON public.issues 
FOR SELECT 
USING (public.get_current_user_role() IN ('authority', 'admin'));