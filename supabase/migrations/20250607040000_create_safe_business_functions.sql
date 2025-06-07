
-- Create safe functions to get user business ID without RLS recursion
BEGIN;

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.get_user_business_id_safe();

-- Create a new safe function that gets user's business ID
CREATE OR REPLACE FUNCTION public.get_user_business_id_safe()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  business_id_result uuid;
BEGIN
  -- Get the business ID directly from business_users table
  -- Using SECURITY DEFINER to bypass RLS
  SELECT business_id INTO business_id_result
  FROM public.business_users
  WHERE user_id = auth.uid()
    AND status = 'active'::user_status
  LIMIT 1;
  
  RETURN business_id_result;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error and return null
    RAISE WARNING 'Error in get_user_business_id_safe: %', SQLERRM;
    RETURN NULL;
END;
$$;

-- Create a function to ensure user has business access
CREATE OR REPLACE FUNCTION public.ensure_user_business_access()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_exists boolean;
  business_exists boolean;
  user_business_id uuid;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  -- Get user's business ID
  SELECT business_id INTO user_business_id
  FROM public.business_users
  WHERE user_id = auth.uid()
    AND status = 'active'::user_status
  LIMIT 1;
  
  -- If no business found, return false
  IF user_business_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if business exists
  SELECT EXISTS(
    SELECT 1 FROM public.businesses WHERE id = user_business_id
  ) INTO business_exists;
  
  RETURN business_exists;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error in ensure_user_business_access: %', SQLERRM;
    RETURN false;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_user_business_id_safe() TO authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_user_business_access() TO authenticated;

COMMIT;
