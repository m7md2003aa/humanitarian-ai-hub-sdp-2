-- =====================================================
-- Supabase Storage Setup for Donation Images
-- =====================================================

-- Step 1: Create the storage bucket (Do this in Supabase Dashboard UI)
-- Go to: Storage → New Bucket
-- Name: donation-images
-- Public: YES (checked)
-- File size limit: 50MB
-- Allowed MIME types: image/jpeg, image/png, image/webp

-- Step 2: Set up RLS policies for the bucket

-- Policy 1: Allow public read access to all images
CREATE POLICY "Public read access for donation images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'donation-images');

-- Policy 2: Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload donation images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'donation-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 3: Allow users to update their own images
CREATE POLICY "Users can update own donation images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'donation-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 4: Allow users to delete their own images
CREATE POLICY "Users can delete own donation images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'donation-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- =====================================================
-- Verification Queries
-- =====================================================

-- Check if bucket exists
SELECT * FROM storage.buckets WHERE name = 'donation-images';

-- Check bucket policies
SELECT * FROM storage.policies WHERE bucket_id = 'donation-images';

-- List all uploaded images
SELECT * FROM storage.objects WHERE bucket_id = 'donation-images' ORDER BY created_at DESC;

-- Count images per user
SELECT 
  (storage.foldername(name))[1] as user_id,
  COUNT(*) as image_count
FROM storage.objects 
WHERE bucket_id = 'donation-images'
GROUP BY user_id
ORDER BY image_count DESC;

-- =====================================================
-- Cleanup Queries (Use with caution!)
-- =====================================================

-- Delete all images in bucket (CAREFUL!)
-- DELETE FROM storage.objects WHERE bucket_id = 'donation-images';

-- Delete images older than 30 days
-- DELETE FROM storage.objects 
-- WHERE bucket_id = 'donation-images' 
-- AND created_at < NOW() - INTERVAL '30 days';

-- =====================================================
-- Notes
-- =====================================================

/*
Image URL Format:
https://{project-ref}.supabase.co/storage/v1/object/public/donation-images/{userId}/{timestamp}_filename.jpg

Example:
https://abcdefg.supabase.co/storage/v1/object/public/donation-images/550e8400-e29b-41d4-a716-446655440000/1729688400000_donation_1.jpg

Folder Structure:
donation-images/
  ├── {userId}/
  │     ├── 1729688400000_donation_1.jpg
  │     ├── 1729688450000_donation_2.jpg
  │     └── ...
  └── {userId2}/
        └── ...
*/
