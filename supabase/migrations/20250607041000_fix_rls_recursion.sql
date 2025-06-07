
-- Fix RLS policies to avoid infinite recursion
BEGIN;

-- Remove problematic policies that cause recursion
DROP POLICY IF EXISTS "Users can view business users from their business" ON public.business_users;
DROP POLICY IF EXISTS "Users can manage business users in their business" ON public.business_users;
DROP POLICY IF EXISTS "Business users can view their own business" ON public.business_users;

-- Create simple, non-recursive policies for business_users
CREATE POLICY "Users can view their own business user record" ON public.business_users
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own business user record" ON public.business_users
FOR UPDATE USING (user_id = auth.uid());

-- Owners can manage all business users in their business
CREATE POLICY "Owners can manage business users" ON public.business_users
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.business_users bu
    WHERE bu.user_id = auth.uid()
      AND bu.business_id = business_users.business_id
      AND bu.role IN ('owner', 'admin')
      AND bu.status = 'active'::user_status
  )
);

-- Ensure business_users table has RLS enabled
ALTER TABLE public.business_users ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_business_users_user_id ON public.business_users(user_id);
CREATE INDEX IF NOT EXISTS idx_business_users_business_id ON public.business_users(business_id);
CREATE INDEX IF NOT EXISTS idx_business_users_user_business ON public.business_users(user_id, business_id);

COMMIT;
