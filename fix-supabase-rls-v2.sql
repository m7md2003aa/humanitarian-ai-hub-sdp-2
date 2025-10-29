-- Fix for infinite recursion in Supabase RLS policies
-- Run this in your Supabase SQL Editor: https://app.supabase.com/project/_/sql

-- ============================================
-- STEP 1: Drop all existing problematic policies
-- ============================================

-- Drop users policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "users_select_own" ON public.users;
DROP POLICY IF EXISTS "users_update_own" ON public.users;
DROP POLICY IF EXISTS "users_insert_own" ON public.users;

-- Drop donations policies
DROP POLICY IF EXISTS "Donors can view their own donations" ON public.donations;
DROP POLICY IF EXISTS "Donors can insert their own donations" ON public.donations;
DROP POLICY IF EXISTS "Donors can update their own donations" ON public.donations;
DROP POLICY IF EXISTS "Beneficiaries can view listed donations" ON public.donations;
DROP POLICY IF EXISTS "Admins can view all donations" ON public.donations;
DROP POLICY IF EXISTS "donations_select_own" ON public.donations;
DROP POLICY IF EXISTS "donations_insert_own" ON public.donations;
DROP POLICY IF EXISTS "donations_update_own" ON public.donations;

-- ============================================
-- STEP 2: Create helper function to check if user is admin
-- ============================================

-- This function checks user role from auth.jwt() metadata
-- This avoids recursion because it doesn't query the users table
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN COALESCE(
    (auth.jwt()->>'role')::text = 'admin',
    false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Alternative: Check from auth.users metadata (if role is stored there)
CREATE OR REPLACE FUNCTION public.is_admin_metadata()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN COALESCE(
    (SELECT raw_user_meta_data->>'role' 
     FROM auth.users 
     WHERE id = auth.uid()) = 'admin',
    false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STEP 3: Create new policies WITHOUT recursion
-- ============================================

-- USERS TABLE POLICIES
-- Allow users to view their own profile OR admins can view all
CREATE POLICY "users_select_policy"
ON public.users
FOR SELECT
USING (
  auth.uid() = id 
  OR is_admin_metadata()
);

-- Allow users to update their own profile
CREATE POLICY "users_update_policy"
ON public.users
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow authenticated users to insert their own profile
CREATE POLICY "users_insert_policy"
ON public.users
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Allow admins to update any user (for credit management)
CREATE POLICY "users_admin_update_policy"
ON public.users
FOR UPDATE
USING (is_admin_metadata());

-- ============================================
-- DONATIONS TABLE POLICIES
-- ============================================

CREATE POLICY "donations_select_policy"
ON public.donations
FOR SELECT
USING (
  donor_id = auth.uid() 
  OR status IN ('listed', 'allocated', 'verified')
  OR is_admin_metadata()
);

CREATE POLICY "donations_insert_policy"
ON public.donations
FOR INSERT
WITH CHECK (donor_id = auth.uid());

CREATE POLICY "donations_update_policy"
ON public.donations
FOR UPDATE
USING (
  donor_id = auth.uid() 
  OR is_admin_metadata()
);

-- ============================================
-- CLAIMS TABLE POLICIES (if exists)
-- ============================================

CREATE POLICY "claims_select_policy"
ON public.claims
FOR SELECT
USING (
  beneficiary_id = auth.uid()
  OR is_admin_metadata()
);

CREATE POLICY "claims_insert_policy"
ON public.claims
FOR INSERT
WITH CHECK (beneficiary_id = auth.uid());

-- ============================================
-- BUSINESS ITEMS TABLE POLICIES (if exists)
-- ============================================

CREATE POLICY "business_items_select_policy"
ON public.business_items
FOR SELECT
USING (
  business_id = auth.uid() 
  OR status = 'active'
  OR is_admin_metadata()
);

CREATE POLICY "business_items_all_policy"
ON public.business_items
FOR ALL
USING (
  business_id = auth.uid()
  OR is_admin_metadata()
);

-- ============================================
-- CREDIT TRANSACTIONS TABLE POLICIES (if exists)
-- ============================================

CREATE POLICY "credit_transactions_select_policy"
ON public.credit_transactions
FOR SELECT
USING (
  user_id = auth.uid()
  OR is_admin_metadata()
);

CREATE POLICY "credit_transactions_insert_policy"
ON public.credit_transactions
FOR INSERT
WITH CHECK (true);  -- Allow system to create transactions

-- ============================================
-- STEP 4: Grant execute permission on helper function
-- ============================================

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin_metadata() TO authenticated;

-- ============================================
-- VERIFICATION
-- ============================================

-- Test the function (should return true if you're logged in as admin)
-- SELECT is_admin_metadata();

-- Check all policies are created
-- SELECT * FROM pg_policies WHERE schemaname = 'public';
