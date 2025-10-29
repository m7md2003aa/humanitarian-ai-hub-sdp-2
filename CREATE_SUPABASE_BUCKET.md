# Create Supabase Storage Bucket - Step by Step

## The Problem
Your app is trying to upload images to a bucket called `donation-images`, but that bucket doesn't exist yet in your Supabase project.

**Error you're seeing:**
```
❌ Supabase upload error: StorageApiError: Bucket not found
```

## Solution: Create the Bucket via SQL

This is the **most reliable** method. Follow these exact steps:

---

## Step 1: Open Supabase SQL Editor

1. Go to: https://supabase.com
2. Log in
3. Click on your project: `vfzuavexhkheduttyylc`
4. In the left sidebar, click **SQL Editor**
5. Click **New Query**

---

## Step 2: Run This SQL Command

Copy and paste this EXACT SQL command into the editor:

```sql
-- Create the donation-images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'donation-images',
  'donation-images',
  true,
  52428800,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;
```

Click **RUN** (or press Ctrl+Enter / Cmd+Enter)

**Expected result:** You should see "Success. No rows returned" - that's GOOD!

---

## Step 3: Set Bucket Policies

Now run this SQL to allow uploads/downloads:

```sql
-- Policy 1: Allow anyone to view images (public access)
CREATE POLICY "Public Access to donation-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'donation-images');

-- Policy 2: Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload donation-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'donation-images' AND auth.role() = 'authenticated');

-- Policy 3: Allow public uploads (if you want anyone to upload, even without auth)
CREATE POLICY "Anyone can upload donation-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'donation-images');

-- Policy 4: Allow users to update their own images
CREATE POLICY "Users can update own donation-images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'donation-images');

-- Policy 5: Allow users to delete their own images
CREATE POLICY "Users can delete own donation-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'donation-images');
```

**Note:** If you get errors about policies already existing, that's OK - just means they're already there.

---

## Step 4: Verify Bucket Was Created

Run this SQL to check:

```sql
SELECT * FROM storage.buckets WHERE name = 'donation-images';
```

**Expected result:** You should see 1 row with:
- `id`: donation-images
- `name`: donation-images
- `public`: true

---

## Step 5: Test in Your App

1. **Close the Vibecode app completely** (force quit)
2. **Reopen the Vibecode app**
3. Go to Donor → Upload Donation
4. Take a photo of a clothing item
5. Fill in the form
6. Submit

---

## Step 6: Check the Logs

In the LOGS tab of your Vibecode app, you should now see:

```
✅ Upload successful, path: donation-images/...
Public URL: https://vfzuavexhkheduttyylc.supabase.co/storage/v1/object/public/donation-images/...
```

Instead of:

```
❌ Supabase upload error: Bucket not found
```

---

## Alternative: Create Bucket via UI (If SQL Doesn't Work)

If the SQL method doesn't work for some reason, try the UI:

1. Go to Supabase Dashboard
2. Click **Storage** in left sidebar
3. Click **New Bucket** button
4. Enter:
   - **Name**: `donation-images` (EXACTLY this, no spaces, no uppercase)
   - **Public bucket**: Toggle ON (very important!)
   - **File size limit**: 50 MB
   - **Allowed MIME types**: Leave empty or add: `image/jpeg, image/png, image/jpg, image/gif, image/webp`
5. Click **Create Bucket**

Then go to the bucket settings:
1. Click on the `donation-images` bucket
2. Click **Policies** tab
3. Click **New Policy**
4. Click **For full customization** → **Create policy**
5. Enter:
   - **Policy name**: `Public Access`
   - **Policy definition**: `true`
   - **Target roles**: Leave default
   - **Operation**: SELECT
6. Click **Save**
7. Repeat for INSERT, UPDATE, DELETE operations

---

## Troubleshooting

### If you get "relation 'storage.buckets' does not exist"

This means Storage is not enabled in your project. To enable:

1. Go to Supabase Dashboard
2. Click **Storage** in left sidebar
3. If you see "Enable Storage" button, click it
4. Wait 2-3 minutes for it to initialize
5. Then try the SQL commands again

### If you get "permission denied for schema storage"

This means you don't have permission. Try:

1. Go to **Settings** → **API** in Supabase
2. Copy the **service_role key** (NOT the anon key!)
3. Use that key for this setup (temporarily)
4. Then switch back to anon key

### If the bucket exists but uploads still fail

1. Check bucket is PUBLIC:
   ```sql
   UPDATE storage.buckets
   SET public = true
   WHERE id = 'donation-images';
   ```

2. Check policies exist:
   ```sql
   SELECT * FROM storage.policies
   WHERE bucket_id = 'donation-images';
   ```

---

## What Happens After This Works

Once the bucket is created:

✅ Images upload to Supabase successfully
✅ Images get public URLs
✅ Images are visible on ALL devices
✅ Admin can see images when reviewing donations
✅ Beneficiaries can see images when browsing items
✅ Images persist even if device is reset

---

## Next Steps

After the bucket is working, we need to set up the **Supabase database tables** so donations/listings sync across devices. But let's get the bucket working first!

**Let me know when you've run the SQL commands and I'll help verify everything is working.**
