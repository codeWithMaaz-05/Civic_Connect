-- Add authority access codes table for secure authority registration
CREATE TABLE public.authority_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  used_at timestamp with time zone,
  used_by uuid REFERENCES auth.users(id),
  is_active boolean DEFAULT true,
  description text
);

-- Enable RLS on authority codes
ALTER TABLE public.authority_codes ENABLE ROW LEVEL SECURITY;

-- Only allow system access to authority codes (no public access)
CREATE POLICY "Authority codes are system-only" ON public.authority_codes
FOR ALL USING (false);

-- Insert some predefined authority codes
INSERT INTO public.authority_codes (code, description) VALUES 
('CIVIC_AUTH_2024', 'General authority access code'),
('ADMIN_ACCESS_001', 'Admin access code'),
('AUTHORITY_KEY_1', 'Authority key for officials');

-- Create function to validate authority code and register authority user
CREATE OR REPLACE FUNCTION public.validate_authority_code(access_code text, user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  code_record public.authority_codes;
BEGIN
  -- Check if code exists and is active
  SELECT * INTO code_record 
  FROM public.authority_codes 
  WHERE code = access_code AND is_active = true AND used_at IS NULL;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Mark code as used
  UPDATE public.authority_codes 
  SET used_at = now(), used_by = auth.uid()
  WHERE code = access_code;
  
  RETURN true;
END;
$$;