-- Fix security issue: Restrict profiles SELECT policy to protect user email addresses
-- Drop the overly permissive policy that allows anyone to view all profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a more secure policy that only allows users to view their own profile
-- and authorities/admins to view all profiles for moderation purposes
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow authorities and admins to view all profiles for moderation
CREATE POLICY "Authorities can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
    AND p.role IN ('authority', 'admin')
  )
);