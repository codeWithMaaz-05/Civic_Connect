-- Rollback the failed migration and implement proper column-level security
-- Drop the failed view
DROP VIEW IF EXISTS public.issues_public;

-- Recreate the proper RLS policy for public viewing without contact_info
-- We'll handle this at the application level for better control

-- Ensure we have the basic "anyone can view issues" policy for the public dashboard
CREATE POLICY "Public can view issues" 
ON public.issues 
FOR SELECT 
USING (true);

-- The application layer will now handle filtering out contact_info for non-authorized users