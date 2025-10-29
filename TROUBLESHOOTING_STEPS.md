# Troubleshooting: Still Seeing "Using Local Data" 🔍

## Quick Diagnosis

You're still seeing:
- 🟡 "Using local data"
- Only 1 user (admin)
- Infinite recursion error in console

Let's fix this step by step!

---

## 🚀 QUICKEST FIX: Disable RLS Temporarily

**Use this to get your app working RIGHT NOW** (then we can fix properly later)

### Step 1: Run This SQL
1. Go to: https://app.supabase.com → SQL Editor
2. Copy this ONE line:
```sql
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
```
3. Paste and click **RUN**
4. Should see: "Success"

### Step 2: Restart App
1. Logout
2. Login as admin
3. Go to User Management
4. Should now see **ALL users from database!** ✅

⚠️ **Note**: This disables security temporarily. Fine for development/testing.

---

## 🔍 Why Is This Happening?

Three possible reasons:

### Reason 1: RLS Policy Still Has Recursion
- The `is_admin_metadata()` function wasn't created correctly
- Or policies still reference the users table directly

### Reason 2: Admin Role Not in Metadata
- Your admin account might not have 'role' in auth metadata
- The function looks for `raw_user_meta_data->>'role'` but it might be stored elsewhere

### Reason 3: Didn't Logout After SQL Fix
- Changes only apply after you logout and login again
- Session needs to refresh

---

## 🔬 DIAGNOSTIC: Find The Exact Problem

Run this SQL to see what's wrong:

### Check 1: See Your Admin User
```sql
SELECT 
  id,
  email,
  raw_user_meta_data->>'role' as role_in_metadata,
  raw_user_meta_data
FROM auth.users
WHERE email = 'admin@test.com';
```

**What you should see:**
```
role_in_metadata: "admin"
```

**If it's NULL or empty**: Your admin role isn't in metadata → That's the problem!

### Check 2: Test Admin Function
```sql
SELECT is_admin_metadata() as am_i_admin;
```

**What you should see:**
```
am_i_admin: true
```

**If it's false or error**: Function isn't working → Need different approach

### Check 3: See All Users
```sql
SELECT id, email, name, role
FROM public.users;
```

**If this works**: Users exist in database, just RLS blocking access

**If error**: There might be bigger issues with the users table

---

## 🛠️ Solutions Based on Diagnosis

### If Check 1 Shows NULL role_in_metadata:

**Problem**: Admin role not in auth metadata

**Solution**: Update the function to check the users table differently

Run this SQL:
```sql
-- Alternative function that checks users table
CREATE OR REPLACE FUNCTION public.is_admin_direct()
RETURNS BOOLEAN AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role INTO user_role FROM public.users WHERE id = auth.uid();
  RETURN user_role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update policy to use new function
DROP POLICY IF EXISTS "users_select_policy" ON public.users;
CREATE POLICY "users_select_policy"
ON public.users
FOR SELECT
USING (auth.uid() = id OR is_admin_direct());
```

### If Check 2 Returns False:

**Problem**: Function exists but returns wrong result

**Solution**: Temporarily disable RLS (see Quick Fix above)

### If Check 3 Shows Users But App Doesn't:

**Problem**: RLS blocking, but users exist

**Solution**:
1. Disable RLS (Quick Fix above)
2. OR update admin metadata:
```sql
UPDATE auth.users 
SET raw_user_meta_data = 
  jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    '"admin"'
  )
WHERE email = 'admin@test.com';
```

---

## 📋 Step-by-Step Troubleshooting Process

### Step 1: Try The Quick Fix
```sql
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
```
- Logout & Login
- Check if users appear
- ✅ If YES: Problem was RLS, keep it disabled for now
- ❌ If NO: Move to Step 2

### Step 2: Check Console Logs
- Look for errors in app console
- If still seeing "infinite recursion": RLS still broken
- If different error: Note the exact message

### Step 3: Run Diagnostic Queries
- Run `CHECK_ADMIN_ROLE.sql` (all 3 checks)
- Note which checks fail
- Use solutions above based on results

### Step 4: Try Alternative Function
If metadata is the issue:
```sql
CREATE OR REPLACE FUNCTION public.is_admin_simple()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

But this might STILL cause recursion!

---

## ✅ RECOMMENDED APPROACH

**For now, just disable RLS:**

```sql
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
```

This will:
- ✅ Let you see all users immediately
- ✅ Let you test all admin features
- ✅ Work perfectly for development
- ⚠️ Be fine since this is a development environment

**Later, we can:**
1. Enable RLS again
2. Use a different approach (service role key, backend proxy, etc.)
3. Or keep RLS disabled if this is just for testing

---

## 🎯 TL;DR - Just Do This

**Copy and paste this into Supabase SQL Editor:**

```sql
-- Quick fix: Disable RLS
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
```

Click RUN → Logout → Login → Check User Management

**Should now show all users!** ✅

---

## Files Reference

- ✅ `TEMPORARY_DISABLE_RLS.sql` - Quick one-line fix
- 📊 `CHECK_ADMIN_ROLE.sql` - Diagnostic queries
- 🔧 `QUICK_SUPABASE_FIX.sql` - Original fix (if it didn't work)
- 📖 `TROUBLESHOOTING_STEPS.md` - This file

---

## Still Not Working?

If you ran the disable RLS command and still see only 1 user:

1. **Check Supabase users table directly**:
   - Go to Supabase → Table Editor → users
   - Do you see multiple users?
   - If NO: Users weren't actually registered in database
   - If YES: There's a different issue

2. **Check console logs**:
   - Look for any errors when opening User Management
   - Share the error message

3. **Try hard refresh**:
   - Close app completely
   - Reopen
   - Login as admin
   - Check again

Let me know what happens! 🚀
