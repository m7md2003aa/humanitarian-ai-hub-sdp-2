# Supabase Setup Guide for Humanitarian AI Hub

## Prerequisites
1. Create a Supabase account at https://supabase.com
2. Create a new project in your Supabase dashboard

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Click on "Settings" (gear icon) in the left sidebar
3. Go to "API" section
4. Copy the following:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJhbG...`)

## Step 2: Add Credentials to .env File

Add these two lines to your `.env` file in the project root:

```env
EXPO_PUBLIC_SUPABASE_URL=your_project_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 3: Run the Database Schema

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the entire contents of `supabase-schema.sql` file
5. Click "Run" to execute the SQL

This will create:
- ✅ All necessary tables (users, donations, claims, business_items, credit_transactions)
- ✅ Indexes for performance
- ✅ Row Level Security (RLS) policies
- ✅ Triggers and functions for automation

## Step 4: Setup Storage Buckets

### Create Image Storage Bucket
1. Go to "Storage" in the left sidebar
2. Click "New Bucket"
3. Name it: `donation-images`
4. Make it **Public** (so images can be viewed)
5. Click "Create bucket"

### Set Storage Policies
1. Click on the `donation-images` bucket
2. Go to "Policies" tab
3. Add these policies:

**Allow authenticated users to upload:**
```sql
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'donation-images');
```

**Allow public to view images:**
```sql
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'donation-images');
```

**Allow users to update their own images:**
```sql
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'donation-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

**Allow users to delete their own images:**
```sql
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'donation-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## Step 5: Enable Email Authentication

1. Go to "Authentication" → "Providers" in your Supabase dashboard
2. Make sure "Email" is enabled
3. Configure email templates (optional but recommended):
   - Go to "Authentication" → "Email Templates"
   - Customize "Confirm signup", "Magic Link", "Change Email Address", and "Reset Password" templates

## Step 6: Restart Your App

After adding the credentials to `.env`, restart your Expo dev server:
```bash
# Stop the current server (Ctrl+C)
# Then restart
bun run start
```

## Database Schema Overview

### Tables Created:

1. **users** - Extends auth.users with role, credits, avatar
2. **donations** - Stores donation items with status tracking
3. **claims** - Beneficiary claims on donations
4. **business_items** - Items from businesses (surplus/discounted)
5. **credit_transactions** - History of all credit changes

### User Roles:
- **donor** - Can upload and track donations
- **beneficiary** - Can browse and claim items (starts with 100 credits)
- **business** - Can list surplus/discounted items (requires approval)
- **admin** - Full access to manage platform

### Donation Status Flow:
1. `uploaded` - Donor uploads item
2. `verified` - Admin verifies and approves
3. `listed` - Item appears in beneficiary catalog
4. `allocated` - Beneficiary claims item
5. `received` - Beneficiary confirms receipt
6. `rejected` - Admin rejects with reason

## Testing Your Setup

Once configured, you can:
1. ✅ Sign up new users through the app
2. ✅ Sign in with email/password
3. ✅ Upload donations with images
4. ✅ Browse items as beneficiary
5. ✅ Track credit balances
6. ✅ Admin can verify/reject items

## Troubleshooting

**Problem:** "Invalid API key" error
- Check that your `.env` file has the correct credentials
- Restart the Expo server after adding credentials

**Problem:** "Row Level Security policy violation"
- Make sure you ran the entire SQL schema
- Check that RLS policies are enabled in Supabase dashboard

**Problem:** Can't upload images
- Verify the `donation-images` bucket exists
- Check that storage policies are set correctly
- Ensure the bucket is set to "Public"

**Problem:** User not created after signup
- Check that the `handle_new_user()` trigger is created
- Look at Supabase logs for any errors

## Need Help?

Check the Supabase documentation: https://supabase.com/docs
