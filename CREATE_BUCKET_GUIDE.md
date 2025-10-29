# CREATE SUPABASE STORAGE BUCKET - Step by Step

## ⚠️ You're Getting "Bucket not found" Error

This means the `donation-images` storage bucket doesn't exist yet in your Supabase project.

## 📸 Follow These Steps EXACTLY:

### STEP 1: Go to Supabase Storage

1. Open your browser
2. Go to: **https://supabase.com**
3. Click **Sign in**
4. Log in with your account
5. You'll see your projects list
6. Click on your project (the one with URL: `vfzuavexhkheduttyylc.supabase.co`)

### STEP 2: Open Storage Section

1. Look at the LEFT sidebar
2. Find and click on **"Storage"** (icon looks like a folder/box)
3. You should see a page titled "Storage"
4. If you see existing buckets, that's fine
5. If you see "No buckets yet", that's also fine

### STEP 3: Create New Bucket

1. Look for a green button that says **"New bucket"** or **"Create a new bucket"**
2. Click that button
3. A form/modal will appear

### STEP 4: Fill in Bucket Settings

**IMPORTANT: Fill these in EXACTLY as shown:**

```
Name: donation-images
```
(Type exactly: donation-images with a dash, no spaces, all lowercase)

**Public bucket:** Click the toggle to turn it **ON** ✅
- The toggle should be GREEN or BLUE when ON
- If it's gray, click it to turn it on

**File size limit:**
- Set to: 50 MB (or leave default)

**Allowed MIME types:**
- Leave EMPTY or put: `image/*`

### STEP 5: Create the Bucket

1. Click the **"Create bucket"** button (usually green)
2. Wait 2-3 seconds
3. The modal should close
4. You should now see `donation-images` in your buckets list

### STEP 6: Verify It's Public

1. Find `donation-images` in the buckets list
2. You should see a **globe icon** 🌐 or text saying "Public"
3. If you see a **lock icon** 🔒, click on the bucket name
4. Look for "Public bucket" toggle and make sure it's **ON**

### STEP 7: Set Bucket Policy (IMPORTANT!)

1. Click on the `donation-images` bucket name
2. Look for tabs at the top: **Items**, **Configuration**, **Policies**
3. Click **"Policies"** tab
4. You'll see "No policies" or existing policies
5. Click **"New Policy"** button
6. Click **"For full customization"** (not the templates)

**Fill in the policy form:**

```
Policy name: Allow public uploads
Allowed operation: Check ALL boxes (SELECT, INSERT, UPDATE, DELETE)
  OR from dropdown select: ALL

Policy definition (in the text box):
true

Target roles:
Select: public
```

7. Click **"Save policy"** or **"Create policy"**

### STEP 8: Test in the App

1. Go back to your Vibecode app
2. Try uploading a donation again
3. Check the LOGS tab

**You should now see:**
```
📤 Starting image upload to Supabase...
Base64 string length: [number]
ArrayBuffer created, size: [number]
Uploading to path: [path]
✅ Upload successful, path: [path]
Public URL: https://vfzuavexhkheduttyylc.supabase.co/storage/v1/object/public/donation-images/...
```

**If you still see "Bucket not found":**
- Check bucket name is EXACTLY: `donation-images` (with dash)
- Check it's marked as Public (globe icon)
- Try refreshing the app
- Check your `.env` file has the correct Supabase URL

---

## 🎯 Visual Checklist

After completing all steps, verify:

✅ Go to Supabase Dashboard → Storage
✅ See bucket named: `donation-images`
✅ Bucket shows globe icon 🌐 or says "Public"
✅ Click bucket → Policies tab → See "Allow public uploads" policy
✅ Policy shows "All operations" or has all checkboxes checked

---

## 🐛 Still Having Issues?

### Issue: Can't find "New bucket" button
**Solution:**
- Make sure you're in the **Storage** section (left sidebar)
- Scroll down on the page
- Look for ANY button that says "New" or "Create"

### Issue: Don't see "Policies" tab
**Solution:**
- Make sure you CLICKED on the bucket name (not just hovering)
- The bucket detail page should open
- Tabs should appear at the top: Items, Configuration, Policies

### Issue: Policy form is confusing
**Solution:**
- Just copy these EXACT values:
  - Policy name: `Allow public uploads`
  - In the text area that says "Policy definition", type: `true`
  - In "Target roles", select: `public`
  - In "Allowed operation", select: `ALL` or check all boxes
  - Click Save

### Issue: Bucket created but still getting error
**Solution:**
- Wait 30 seconds and try again (Supabase may need to propagate)
- Refresh your app
- Check `.env` file:
  ```
  EXPO_PUBLIC_SUPABASE_URL=https://vfzuavexhkheduttyylc.supabase.co
  EXPO_PUBLIC_SUPABASE_ANON_KEY=[your-key]
  ```

---

## ⏱️ Estimated Time: 5 minutes

Once the bucket is created with the policy, images will upload successfully and work on all devices!

---

## 📱 Quick Test After Setup

1. **Upload donation** → Check logs for "✅ Upload successful"
2. **Copy the Public URL** from logs
3. **Paste URL in browser** → Should show the image
4. **Open admin on different device** → Image should display

If all 4 work, you're done! ✅
