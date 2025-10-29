-- ============================================
-- DIAGNOSTIC: Check how admin role is stored
-- Run this to see if your admin account has role in metadata
-- ============================================

-- Check 1: See all auth users and their metadata
SELECT 
  id,
  email,
  raw_user_meta_data->>'role' as role_in_metadata,
  raw_user_meta_data
FROM auth.users
WHERE email LIKE '%admin%'
LIMIT 5;

-- Check 2: See users table data
SELECT 
  id,
  email,
  name,
  role
FROM public.users
WHERE email LIKE '%admin%'
LIMIT 5;

-- Check 3: Test the admin function
SELECT is_admin_metadata() as am_i_admin;

-- ============================================
-- Expected Results:
-- 
-- Check 1 should show: role_in_metadata = 'admin'
-- Check 2 should show: role = 'admin'
-- Check 3 should show: am_i_admin = true (if you're logged in as admin)
-- ============================================
