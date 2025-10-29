-- Fix for infinite recursion in users table RLS policies
-- Run this in your Supabase SQL Editor

-- First, drop the problematic policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;

-- Create new, simplified policies without recursion

-- Allow users to view their own profile
CREATE POLICY "users_select_own"
ON public.users
FOR SELECT
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "users_update_own"
ON public.users
FOR UPDATE
USING (auth.uid() = id);

-- Allow authenticated users to insert (needed for new user creation)
CREATE POLICY "users_insert_own"
ON public.users
FOR INSERT
WITH CHECK (auth.uid() = id);

-- For admins, we'll use a separate query with service role key
-- Or you can create a simpler admin check if needed

-- Also simplify the other policies to avoid recursion

-- Donations policies (simplified)
DROP POLICY IF EXISTS "Donors can view their own donations" ON public.donations;
DROP POLICY IF EXISTS "Donors can insert their own donations" ON public.donations;
DROP POLICY IF EXISTS "Donors can update their own donations" ON public.donations;
DROP POLICY IF EXISTS "Beneficiaries can view listed donations" ON public.donations;
DROP POLICY IF EXISTS "Admins can view all donations" ON public.donations;

CREATE POLICY "donations_select_own"
ON public.donations
FOR SELECT
USING (donor_id = auth.uid() OR status IN ('listed', 'allocated'));

CREATE POLICY "donations_insert_own"
ON public.donations
FOR INSERT
WITH CHECK (donor_id = auth.uid());

CREATE POLICY "donations_update_own"
ON public.donations
FOR UPDATE
USING (donor_id = auth.uid());

-- Claims policies (simplified)
DROP POLICY IF EXISTS "Beneficiaries can view their own claims" ON public.claims;
DROP POLICY IF EXISTS "Beneficiaries can create claims" ON public.claims;
DROP POLICY IF EXISTS "Admins can view all claims" ON public.claims;

CREATE POLICY "claims_select_own"
ON public.claims
FOR SELECT
USING (beneficiary_id = auth.uid());

CREATE POLICY "claims_insert_own"
ON public.claims
FOR INSERT
WITH CHECK (beneficiary_id = auth.uid());

-- Business items policies (simplified)
DROP POLICY IF EXISTS "Businesses can manage their own items" ON public.business_items;
DROP POLICY IF EXISTS "All users can view active business items" ON public.business_items;
DROP POLICY IF EXISTS "Admins can view all business items" ON public.business_items;

CREATE POLICY "business_items_all_operations"
ON public.business_items
FOR ALL
USING (business_id = auth.uid() OR status = 'active');

-- Credit transactions policies (simplified)
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.credit_transactions;
DROP POLICY IF EXISTS "Admins can manage all transactions" ON public.credit_transactions;

CREATE POLICY "credit_transactions_select_own"
ON public.credit_transactions
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "credit_transactions_insert"
ON public.credit_transactions
FOR INSERT
WITH CHECK (true);  -- Allow system to create transactions
