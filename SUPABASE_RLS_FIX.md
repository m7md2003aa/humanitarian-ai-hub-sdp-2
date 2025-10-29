# Fixing Supabase RLS "Infinite Recursion" Error 🔧

## The Error
```
Error fetching users: {"code":"42P17","message":"infinite recursion detected in policy for relation \"users\""}
```

This happens when Supabase **Row Level Security (RLS) policies** reference themselves, creating an infinite loop.

---

## Quick Summary

**Problem**: RLS policy checks user role by querying the `users` table, which requires checking the policy again → infinite loop!

**Solution**: Use a helper function that checks user role from `auth.users` metadata instead of the `users` table.

---

## Step-by-Step Fix

### Option 1: Run SQL Fix (Recommended) ✅

1. **Open Supabase Dashboard**
   - Go to: https://app.supabase.com
   - Select your project
   - Click **SQL Editor** in left sidebar

2. **Run the Fix Script**
   - Open the file: `fix-supabase-rls-v2.sql` (in your project root)
   - Copy ALL the SQL code
   - Paste into Supabase SQL Editor
   - Click **Run**

3. **Verify It Works**
   ```sql
   -- Run this to test (should return true if you're admin)
   SELECT is_admin_metadata();
   
   -- Check policies are created
   SELECT * FROM pg_policies WHERE schemaname = 'public';
   ```

4. **Refresh Your App**
   - Logout from admin account
   - Login again as admin
   - Go to User Management
   - Should now see: **"🟢 Supabase connected"**

---

### Option 2: Temporary Workaround (If SQL fix doesn't work)

If you can't run the SQL script or still getting errors, the app will automatically **fallback to local storage mode**:

**What This Means:**
- ✅ User Management still works
- ✅ Shows all registered users from local storage
- ✅ Credit updates work
- 🟡 Shows "Using local data" indicator
- ⚠️ Users only visible on the device they registered from

**No action needed** - the app handles this automatically!

---

## What the Fix Does

### Before (Broken):
```sql
-- Policy checks users.role column
CREATE POLICY "admin_can_view_all" ON users
FOR SELECT USING (
  -- This queries users table → triggers policy check → infinite loop!
  (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
);
```

### After (Fixed):
```sql
-- Helper function checks auth metadata instead
CREATE FUNCTION is_admin_metadata() 
RETURNS BOOLEAN AS $$
BEGIN
  -- Queries auth.users (different table, no recursion!)
  RETURN (SELECT raw_user_meta_data->>'role' 
          FROM auth.users 
          WHERE id = auth.uid()) = 'admin';
END;
$$ LANGUAGE plpgsql;

-- Policy uses helper function
CREATE POLICY "admin_can_view_all" ON users
FOR SELECT USING (
  auth.uid() = id OR is_admin_metadata()
);
```

---

## Understanding RLS Policies

### What Are RLS Policies?
Row Level Security policies control who can:
- **SELECT** (read)
- **INSERT** (create)
- **UPDATE** (edit)
- **DELETE** (remove)

...rows in your database tables.

### The Recursion Problem
When a policy on the `users` table checks the `users` table:
```
Admin tries to view users
  ↓
Check policy: "Is user admin?"
  ↓
Query: SELECT role FROM users WHERE id = auth.uid()
  ↓
Check policy: "Can user view this row?"
  ↓
Query: SELECT role FROM users WHERE id = auth.uid()
  ↓
Check policy: "Can user view this row?"
  ↓
(infinite loop!) 💥
```

### The Solution
Check role from `auth.users` metadata instead:
```
Admin tries to view users
  ↓
Check policy: "Is user admin?"
  ↓
Query: SELECT metadata FROM auth.users (different table!)
  ↓
Returns: role = 'admin' ✅
  ↓
Allow access!
```

---

## New Policies Created

### Users Table:
- ✅ Users can view their own profile
- ✅ Admins can view ALL users (without recursion!)
- ✅ Users can update their own profile
- ✅ Admins can update any user (for credit management)
- ✅ New users can be created

### Donations Table:
- ✅ Donors can view their own donations
- ✅ Everyone can view listed/verified donations
- ✅ Admins can view/edit all donations
- ✅ Donors can create donations

### Claims Table:
- ✅ Beneficiaries can view their own claims
- ✅ Admins can view all claims

### Credit Transactions:
- ✅ Users can view their own transactions
- ✅ Admins can view all transactions
- ✅ System can create transactions

---

## Verifying It Works

### 1. Check Supabase Logs
In Supabase Dashboard → **Logs** → **Postgres Logs**

**Before Fix:**
```
ERROR: infinite recursion detected in policy for relation "users"
```

**After Fix:**
```
(No errors)
```

### 2. Check App UI
In Admin → User Management screen:

**Supabase Working:**
```
12 users found
🟢 Supabase connected
```

**Local Fallback:**
```
5 users found
🟡 Using local data
```

### 3. Test Admin Functions
- ✅ View all users
- ✅ Filter by role
- ✅ Grant/revoke credits
- ✅ Refresh button works
- ✅ No errors in console

---

## If SQL Fix Doesn't Work

### Alternative 1: Disable RLS Temporarily
```sql
-- WARNING: Only for testing! Makes data public!
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations DISABLE ROW LEVEL SECURITY;
```

**Re-enable later:**
```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
```

### Alternative 2: Use Service Role Key
For admin operations, you can bypass RLS:

```typescript
import { createClient } from '@supabase/supabase-js';

// Admin client (bypasses RLS)
const adminClient = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Not anon key!
);

// Use for admin operations
const { data } = await adminClient.from('users').select('*');
```

⚠️ **Never expose service role key to client!** Only use in secure backend.

### Alternative 3: Use Local Storage Only
The app automatically falls back to local storage if Supabase queries fail. This works for testing but won't sync across devices.

---

## Current App Behavior

### Automatic Fallback System:
1. **Tries Supabase first**
   - Attempts to fetch from database
   - If successful → shows "🟢 Supabase connected"

2. **Falls back to local if needed**
   - If RLS error → uses local storage
   - Shows "🟡 Using local data"
   - Still fully functional!

3. **Error Handling**
   - Logs errors to console
   - Continues working without crashing
   - Shows helpful status indicators

---

## Testing Checklist

After running the SQL fix:

- [ ] Logout and login as admin
- [ ] Open User Management
- [ ] See "🟢 Supabase connected" (not 🟡)
- [ ] All registered users appear
- [ ] Filter by role works
- [ ] Can grant credits to beneficiary
- [ ] Refresh button updates from database
- [ ] No console errors
- [ ] Users registered on other devices appear

---

## Troubleshooting

### Still Getting Recursion Error?

**Check 1:** Verify admin account has role in metadata
```sql
-- Check user metadata
SELECT raw_user_meta_data->>'role' as role
FROM auth.users 
WHERE email = 'admin@test.com';
```

Should return: `admin`

**Check 2:** Verify function was created
```sql
-- List functions
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%admin%';
```

Should show: `is_admin_metadata`

**Check 3:** Test function directly
```sql
-- Should return true if you're logged in as admin
SELECT is_admin_metadata();
```

### "Function does not exist" Error?

Run this separately:
```sql
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

GRANT EXECUTE ON FUNCTION public.is_admin_metadata() TO authenticated;
```

---

## Summary

✅ **SQL fix provided** - `fix-supabase-rls-v2.sql`
✅ **Automatic fallback** - App works even if Supabase fails
✅ **Status indicator** - Shows if using Supabase or local data
✅ **Error handling** - No crashes, helpful console messages
✅ **No data loss** - Local storage preserves registered users

**Next Steps:**
1. Run the SQL fix in Supabase
2. Restart your app
3. Login as admin
4. Check for "🟢 Supabase connected"

If you still see "🟡 Using local data" after running the fix, the app still works - it just uses local storage instead of the database.
