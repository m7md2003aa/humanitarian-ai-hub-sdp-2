# TROUBLESHOOTING: "Bucket not found" Error

## ❌ Still Getting This Error?

If you're still seeing "Bucket not found" after trying to create the bucket, here are the possible causes and solutions:

---

## 🔍 CHECKLIST - Go Through Each Item:

### ✅ 1. Verify Supabase Credentials in .env File

**Check your .env file has the correct values:**

```bash
EXPO_PUBLIC_SUPABASE_URL=https://vfzuavexhkheduttyylc.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmenVhdmV4aGtoZWR1dHR5eWxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMDQ2NjQsImV4cCI6MjA3NTU4MDY2NH0.mvRPrQz4whfg56N36tcdNFwzlmdFhc6QXm2wTxvdPrI
```

**Action:**
1. Open `.env` file in your workspace
2. Check the URL matches your Supabase project
3. Check the anon key is correct
4. Make sure there are NO spaces before or after the values
5. Make sure the file is saved

---

### ✅ 2. Verify Bucket Name is Exactly Correct

The bucket name MUST be exactly: `donation-images`

**Common mistakes:**
- ❌ `Donation-Images` (wrong - uppercase)
- ❌ `donation_images` (wrong - underscore)
- ❌ `donation images` (wrong - space)
- ❌ `donationimages` (wrong - no dash)
- ✅ `donation-images` (CORRECT!)

**Action:**
1. Go to Supabase Dashboard → Storage
2. Check the exact name of your bucket
3. If it's wrong, delete it and create a new one with the correct name

---

### ✅ 3. Verify Bucket Actually Exists

**Action:**
1. Go to: https://supabase.com
2. Log in
3. Click on your project (vfzuavexhkheduttyylc)
4. Click **Storage** in left sidebar
5. Do you see a bucket named `donation-images`?

**If NO:**
- The bucket wasn't created successfully
- Follow the steps in `CREATE_BUCKET_GUIDE.md` again
- Make sure to click "Create bucket" button

**If YES:**
- Continue to next check

---

### ✅ 4. Verify You're in the Correct Supabase Project

**Action:**
1. In Supabase Dashboard, look at the top left
2. Check the project name/URL shown
3. It should show: `vfzuavexhkheduttyylc` or similar

**If you have multiple projects:**
- Make sure you created the bucket in the SAME project as your `.env` credentials
- Check the URL in `.env` matches the project you're in

---

### ✅ 5. Restart the App

After creating the bucket, you need to restart the app:

**Action:**
1. In the Vibecode app, close it completely
2. Reopen the app
3. Try uploading a donation again

---

### ✅ 6. Check if Supabase is Paused

Free tier Supabase projects can pause after inactivity.

**Action:**
1. Go to Supabase Dashboard
2. Look for any message about "Project paused" or "Resume project"
3. If paused, click "Resume" button
4. Wait 2-3 minutes for it to fully start
5. Try upload again

---

### ✅ 7. Verify Storage is Enabled

**Action:**
1. Go to Supabase Dashboard → Storage
2. If you see a message "Storage is not enabled" or similar:
   - Click to enable it
   - Wait for it to initialize
3. Then create the bucket

---

## 🛠️ ALTERNATIVE: Create Bucket via SQL

If the UI isn't working, try creating the bucket via SQL:

**Step 1: Go to SQL Editor**
1. Supabase Dashboard → SQL Editor
2. New query

**Step 2: Run this SQL:**
```sql
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('donation-images', 'donation-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set policy to allow all operations
CREATE POLICY "Allow all operations on donation-images"
ON storage.objects FOR ALL
USING (bucket_id = 'donation-images')
WITH CHECK (bucket_id = 'donation-images');
```

**Step 3: Verify**
```sql
-- Check if bucket exists
SELECT * FROM storage.buckets WHERE name = 'donation-images';
```

You should see a row with the bucket info.

---

## 🔄 WORKAROUND: Use Local Images Only (Temporary)

If you can't get Supabase storage working right now, you can temporarily disable it:

**This will:**
- ✅ Let you upload donations
- ✅ Images work on the same device
- ❌ Images WON'T work on other devices
- ❌ Needs to be fixed later for production

**To disable (temporary):**
I can modify the code to skip Supabase upload and just use local images. Let me know if you want this workaround.

---

## 🎯 FINAL VERIFICATION STEPS

After trying all the above, do this test:

**1. Check Supabase Dashboard:**
```
Go to: Storage → See "donation-images" bucket → Click it → Should show empty (or with test files)
```

**2. Test with SQL:**
```sql
-- In SQL Editor, run:
SELECT * FROM storage.buckets WHERE name = 'donation-images';
```
Should return 1 row.

**3. Check App Logs:**
```
Upload donation → Check logs
Look for: "Uploading to path: donation-images/..."
```

---

## 📞 Need More Help?

**Tell me:**
1. Did you see the bucket in Supabase Dashboard → Storage?
2. What is the exact bucket name you created?
3. Is your Supabase project active (not paused)?
4. Did you restart the app after creating the bucket?

Once I know these answers, I can help you fix the specific issue!

---

## 💡 Quick Diagnostic Commands

**Run these in Supabase SQL Editor to check status:**

```sql
-- Check if storage schema exists
SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'storage';

-- Check if buckets table exists
SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'storage' AND table_name = 'buckets');

-- List all buckets
SELECT * FROM storage.buckets;

-- Check Supabase project status
SELECT version();
```

Share the results and I can diagnose the exact issue!
