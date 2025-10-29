# How to See All Users in User Management 👥

## Current Situation

You're seeing:
- ✅ **1 user** (admin@test.com - you)
- 🟡 **"Using local data"** indicator
- 📝 **Helper banner** with instructions

## Why Only 1 User Shows

**Reason**: You're in **local storage mode** which only shows users who logged in on THIS specific device.

**Users registered with real emails on Supabase** won't appear until you:
1. Fix the RLS policy error, OR
2. Have those users login on this device

---

## Solution: Fix Supabase RLS (5 minutes)

### Step 1: Open Supabase SQL Editor
1. Go to: **https://app.supabase.com**
2. Select your project
3. Click **"SQL Editor"** in left sidebar
4. Click **"New query"** button

### Step 2: Run the Fix
1. Open file: **`QUICK_SUPABASE_FIX.sql`** (in your project folder)
2. **Copy ALL the SQL code** (from top to bottom)
3. **Paste** into Supabase SQL Editor
4. Click **"RUN"** button (or press Ctrl+Enter)

### Step 3: Verify Success
You should see at the bottom:
```
Success. No rows returned
```
✅ This is GOOD! It means the fix worked.

### Step 4: Restart App
1. **Logout** from admin account
2. **Login** again as admin (`admin@test.com` / `password123`)
3. Go to **User Management**
4. Should now see:
   - 🟢 **"Supabase connected"** (not 🟡)
   - **ALL users** from your database
   - Helper banner disappears

---

## What the SQL Fix Does

**Problem**: Supabase Row Level Security (RLS) policy has infinite recursion

**Before (Broken)**:
```
Admin tries to view users
  ↓
Policy checks: "Is user admin?"
  ↓
Queries users table: "SELECT role..."
  ↓
Policy checks again: "Can user read users table?"
  ↓
(infinite loop!) 💥
```

**After (Fixed)**:
```
Admin tries to view users
  ↓
Uses helper function: is_admin_metadata()
  ↓
Checks auth.users metadata (different table!)
  ↓
Returns: true ✅
  ↓
Shows all users!
```

---

## Alternative: Register Users on This Device

If you don't want to run the SQL fix right now, you can test by:

1. **Logout** from admin
2. **Sign up** new test user:
   - Email: `donor1@test.com`
   - Name: Test Donor
   - Role: Donor
   - Password: `test123`
3. **Logout** from test user
4. **Login** as admin again
5. Check User Management → Test user now appears! ✅

Repeat for more test users:
- `beneficiary1@test.com` (Beneficiary)
- `business1@test.com` (Business)

---

## What You'll See After Fix

### Before (Local Mode):
```
User Management
1 user found
🟡 Using local data

- admin@test.com (you)
```

### After (Supabase Mode):
```
User Management  
5 users found
🟢 Supabase connected

- admin@test.com
- user1@example.com
- user2@example.com
- donor@test.com
- beneficiary@test.com
```

---

## Helper Banner Explained

The yellow info banner you see shows:

> **Using Local Data Mode**
> 
> Only users who logged in on THIS device appear here. To see all users from your database:
> 
> 1. Run QUICK_SUPABASE_FIX.sql in Supabase SQL Editor
> 2. Logout and login again as admin
> 3. Users will sync from Supabase automatically

You can dismiss it by clicking **"Got it"** button.

---

## Quick Summary

**Current Status**:
- ✅ App is working fine
- 🟡 Using local storage (only shows 1 user)
- 📝 Helper banner explains the situation

**To See All Users**:
1. Run `QUICK_SUPABASE_FIX.sql` in Supabase
2. Logout & login again
3. All database users will appear ✅

**Don't want to fix now?**
- App still works perfectly!
- Just register new users on this device to see them
- Helper banner can be dismissed

---

## Files to Use

✅ **`QUICK_SUPABASE_FIX.sql`** - Run this in Supabase
❌ `fix-supabase-rls.sql` - Old, ignore
❌ `fix-supabase-rls-v2.sql` - Old, ignore

Only use the **QUICK_SUPABASE_FIX.sql** file!

---

## Need Help?

If you ran the SQL and still see "🟡 Using local data":

1. Check Supabase SQL Editor for errors
2. Make sure you saw "Success. No rows returned"
3. Try logging out and back in again
4. Check console logs for any error messages

The helper banner will automatically disappear once Supabase connection works!
