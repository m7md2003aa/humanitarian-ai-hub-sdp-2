-- ============================================
-- QUICK FIX for Supabase RLS Infinite Recursion
-- Copy this ENTIRE file and paste into Supabase SQL Editor
-- Then click RUN
-- ============================================

-- Step 1: Drop problematic policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "users_select_own" ON public.users;
DROP POLICY IF EXISTS "users_update_own" ON public.users;
DROP POLICY IF EXISTS "users_insert_own" ON public.users;
DROP POLICY IF EXISTS "users_select_policy" ON public.users;
DROP POLICY IF EXISTS "users_update_policy" ON public.users;
DROP POLICY IF EXISTS "users_insert_policy" ON public.users;
DROP POLICY IF EXISTS "users_admin_update_policy" ON public.users;

-- Step 2: Create admin check function (avoids recursion)
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

-- Step 3: Grant permission to use function
GRANT EXECUTE ON FUNCTION public.is_admin_metadata() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin_metadata() TO anon;

-- Step 4: Create new SAFE policies
CREATE POLICY "users_select_policy"
ON public.users
FOR SELECT
USING (
  auth.uid() = id 
  OR is_admin_metadata()
);

CREATE POLICY "users_update_policy"
ON public.users
FOR UPDATE
USING (auth.uid() = id OR is_admin_metadata())
WITH CHECK (auth.uid() = id OR is_admin_metadata());

CREATE POLICY "users_insert_policy"
ON public.users
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Done! You should see "Success. No rows returned"
