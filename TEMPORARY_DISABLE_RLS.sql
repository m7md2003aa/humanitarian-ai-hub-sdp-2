-- ============================================
-- TEMPORARY FIX: Disable RLS on users table
-- ⚠️ WARNING: This makes the users table PUBLIC
-- Only use for DEVELOPMENT/TESTING
-- ============================================

-- Disable Row Level Security on users table
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- That's it! Now try the app again.
-- You should see all users in User Management.

-- ============================================
-- To RE-ENABLE security later, run:
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- Then run QUICK_SUPABASE_FIX.sql
-- ============================================
