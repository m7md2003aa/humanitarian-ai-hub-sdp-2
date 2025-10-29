-- ============================================
-- Add account_status columns to users table
-- Run this in Supabase SQL Editor
-- ============================================

-- Add the columns
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS account_status text DEFAULT 'active';

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS suspended_at timestamptz;

-- Add constraint to ensure valid values
ALTER TABLE public.users 
ADD CONSTRAINT account_status_check 
CHECK (account_status IN ('active', 'suspended'));

-- Done! Now the suspend/activate feature will work.
