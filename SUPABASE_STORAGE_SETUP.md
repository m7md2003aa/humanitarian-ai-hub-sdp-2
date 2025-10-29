# Supabase Storage Setup Guide

## Issue
Images are not uploading to Supabase Storage because the storage bucket needs to be created and configured.

## Solution: Create the Storage Bucket

### Step 1: Go to Supabase Dashboard
1. Open your browser and go to https://supabase.com
2. Log in to your account
3. Select your project (the one with URL: `https://vfzuavexhkheduttyylc.supabase.co`)

### Step 2: Create Storage Bucket
1. In the left sidebar, click on **Storage**
2. Click **New bucket** button
3. Configure the bucket:
   - **Name**: `donation-images`
   - **Public bucket**: Toggle this **ON** (very important!)
   - **File size limit**: 50MB (recommended)
   - **Allowed MIME types**: `image/jpeg,image/jpg,image/png,image/webp`
4. Click **Create bucket**

### Step 3: Set Bucket Policies (Important!)
After creating the bucket, you need to set up policies to allow uploads:

1. Click on the `donation-images` bucket
2. Go to **Policies** tab
3. Click **New Policy**

#### Policy 1: Allow Public Reads
- **Policy name**: `Public read access`
- **Allowed operation**: `SELECT`
- **Target roles**: `public`
- **Policy definition**:
```sql
true
```
This allows anyone to view/read images (needed for displaying images in the app)

#### Policy 2: Allow Authenticated Users to Upload
- **Policy name**: `Authenticated users can upload`
- **Allowed operation**: `INSERT`
- **Target roles**: `authenticated`
- **Policy definition**:
```sql
true
```
This allows logged-in users to upload images

#### Policy 3: Allow Users to Update Their Own Images
- **Policy name**: `Users can update their own images`
- **Allowed operation**: `UPDATE`
- **Target roles**: `authenticated`
- **Policy definition**:
```sql
(storage.foldername(name))[1] = auth.uid()::text
```
This allows users to update only images in their own folder

#### Policy 4: Allow Users to Delete Their Own Images
- **Policy name**: `Users can delete their own images`
- **Allowed operation**: `DELETE`
- **Target roles**: `authenticated`
- **Policy definition**:
```sql
(storage.foldername(name))[1] = auth.uid()::text
```
This allows users to delete only images in their own folder

### Step 4: Verify Setup
1. Go back to **Storage** → `donation-images`
2. You should see the bucket with policies enabled
3. The bucket should show as **Public**

## Alternative: Simple Policy Setup (Less Secure but Easier)

If the above policies are too complex, you can use a simpler approach for development:

1. Create the `donation-images` bucket as **Public**
2. Add just one policy:
   - **Policy name**: `Allow all operations`
   - **Allowed operation**: `ALL`
   - **Target roles**: `public`
   - **Policy definition**: `true`

⚠️ **Warning**: This allows anyone to upload/delete images. Only use for development/testing!

## Testing

After setup, try uploading a donation in the app:

1. Open the Vibecode app
2. Log in as a donor
3. Go to "Upload Donation"
4. Take/select a photo
5. Fill in details and submit

Check the logs in the LOGS tab for:
```
📤 Starting image upload to Supabase...
Image URI: file://...
Blob created, size: [number]
Uploading to path: [userId]/[timestamp]_donation_[timestamp].jpg
✅ Upload successful, path: [path]
Public URL: https://vfzuavexhkheduttyylc.supabase.co/storage/v1/object/public/donation-images/...
```

If you see errors, check:
1. Bucket name is exactly `donation-images`
2. Bucket is public
3. Policies are properly configured
4. Your Supabase project is active

## Current Configuration

Your app is configured with:
- **Supabase URL**: `https://vfzuavexhkheduttyylc.supabase.co`
- **Storage Bucket**: `donation-images`
- **Upload Path Format**: `{userId}/{timestamp}_{filename}`

## Updated Code

The image upload code has been enhanced with better logging to help debug issues. When you upload an image, you'll see detailed logs showing:
- When upload starts
- Image URI being used
- Blob size created
- Upload path
- Success/error messages
- Final public URL

Check these logs in the LOGS tab of the Vibecode app to see exactly what's happening during upload.

## Need Help?

If images still don't upload after following these steps:
1. Check the LOGS tab for detailed error messages
2. Verify the bucket exists and is public
3. Check that policies are correctly configured
4. Ensure your Supabase project is active and not paused
