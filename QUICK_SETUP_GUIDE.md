# Quick Supabase Setup Guide

## ⚠️ IMPORTANT: SQL Error Fixed

If you got this error:
```
ERROR: 42P01: relation "storage.policies" does not exist
```

**Solution**: Use the new file `supabase-setup-simple.sql` instead!

---

## Step-by-Step Setup (15 minutes)

### STEP 1: Create Storage Bucket (5 minutes)

**A. Go to Supabase Storage:**
1. Open https://supabase.com
2. Log in to your account
3. Select your project
4. Click **Storage** in the left sidebar

**B. Create the Bucket:**
1. Click the green **New bucket** button
2. Fill in:
   - **Name**: `donation-images` (exactly this name!)
   - **Public bucket**: Toggle this **ON** ✅
   - **File size limit**: 50 MB
   - **Allowed MIME types**: Leave empty (allows all)
3. Click **Create bucket**

**C. Make Bucket Public (Important!):**
1. Find `donation-images` in the bucket list
2. If there's a lock icon 🔒, click on the bucket
3. Go to **Configuration** tab
4. Make sure **Public bucket** is **ON** ✅

**D. Add Bucket Policy:**
1. Still in the `donation-images` bucket
2. Click **Policies** tab
3. Click **New Policy** button
4. Select **For full customization**
5. Fill in:
   ```
   Policy name: Allow public access
   Allowed operation: Select "All" (or check all: SELECT, INSERT, UPDATE, DELETE)
   Policy definition: true
   Target roles: Select "public"
   ```
6. Click **Save policy**

✅ **Storage bucket is ready!**

---

### STEP 2: Create Database Tables (5 minutes)

**A. Go to SQL Editor:**
1. Still in Supabase Dashboard
2. Click **SQL Editor** in left sidebar (looks like </> icon)
3. Click **+ New query** button

**B. Run the SQL Script:**
1. Open the file `supabase-setup-simple.sql` (in your workspace)
2. Copy **ALL** the contents (Ctrl+A, Ctrl+C)
3. Paste into the SQL Editor
4. Click the green **Run** button (or press F5)

**C. Check for Success:**
You should see results showing:
```
✅ DATABASE SETUP COMPLETE!
Tables created: donations, listings
You can now use the app with Supabase sync
```

If you see this, you're done! ✅

**D. If There Are Errors:**
- Make sure you copied the ENTIRE file
- Try running again (the script drops tables first, so it's safe)
- Check that you're in the correct project

✅ **Database tables are ready!**

---

### STEP 3: Verify Setup (2 minutes)

**A. Check Storage:**
1. Go to **Storage** → `donation-images`
2. Bucket should show as **Public**
3. You should be able to upload a test file

**B. Check Database:**
1. Go to **Table Editor** in left sidebar
2. You should see:
   - `donations` table
   - `listings` table
3. Click on each table to see the columns

✅ **Everything is set up!**

---

### STEP 4: Test in App (3 minutes)

**A. Upload a Donation (Device A):**
1. Open the app
2. Log in as donor
3. Go to Upload Donation
4. Take/select a photo
5. Fill in details
6. Submit

**B. Check Logs:**
Look for these messages in the LOGS tab:
```
📤 Starting image upload to Supabase...
✅ Upload successful, path: [path]
Public URL: https://[your-project].supabase.co/...
📝 Adding donation...
✅ Donation saved to Supabase
```

**C. Check Admin (Device B or same device):**
1. Log in as admin
2. Go to Item Verification
3. You should see the donation you just uploaded
4. The image should be visible

**D. Approve and Check Feeds:**
1. Approve the donation
2. Log in as beneficiary → Check Browse Items
3. Log in as guest → Check Explore
4. The item should appear in both with the image

✅ **Multi-device sync is working!**

---

## Common Issues & Fixes

### Issue 1: "Bucket not found" error
**Cause**: Storage bucket not created or wrong name
**Fix**:
- Make sure bucket name is exactly: `donation-images`
- Check bucket exists in Storage section
- Make sure it's marked as Public

### Issue 2: Images don't upload
**Cause**: Bucket policies not set
**Fix**:
- Go to bucket → Policies tab
- Make sure "Allow public access" policy exists
- Policy should allow ALL operations for public role

### Issue 3: SQL script fails
**Cause**: Old tables exist or syntax error
**Fix**:
- Use `supabase-setup-simple.sql` (not the original)
- The script automatically drops old tables
- Run it again - it's safe to re-run

### Issue 4: Donations don't appear on other devices
**Cause**: Database tables not created
**Fix**:
- Go to Table Editor
- Check if `donations` and `listings` tables exist
- If not, run the SQL script again

### Issue 5: Images show on Device A but not Device B
**Cause**: Images using local file:// URIs
**Fix**:
- Complete Step 1 (storage bucket)
- Re-upload donations (old ones used local paths)
- New uploads will use Supabase public URLs

---

## Quick Verification Checklist

Before testing, make sure:

- [ ] Storage bucket `donation-images` exists
- [ ] Bucket is marked as **Public** ✅
- [ ] Bucket has policy allowing all operations
- [ ] SQL script ran without errors
- [ ] Tables `donations` and `listings` exist in Table Editor
- [ ] `.env` file has correct `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`

---

## Expected Results

After setup:

✅ **Upload on Device A** → Image uploads to Supabase
✅ **View on Device B (Admin)** → Donation appears with image
✅ **Approve on Device B** → Creates listing in database
✅ **View on Device C (Beneficiary)** → Listing appears with image
✅ **View on Device D (Guest)** → Listing appears in explore feed
✅ **Real-time updates** → Changes appear on all devices within seconds

---

## Need Help?

If you're still having issues:

1. **Check the LOGS tab** in Vibecode app for error messages
2. **Check Supabase Dashboard** → API → Logs for backend errors
3. **Verify .env file** has correct Supabase credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
   ```

The app will automatically:
- Try Supabase first (for cross-device sync)
- Fall back to local storage if Supabase is unavailable
- Upload images to Supabase storage
- Sync data across all devices in real-time

Once Steps 1 and 2 are complete, everything should work!
