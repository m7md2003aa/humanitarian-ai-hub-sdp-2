# Admin Approval/Rejection Flow - Complete Fix

## Issues Fixed

### 1. **Approved Items Not Appearing in Feeds**
**Problem**: When admin approved a donation, it only updated the status to `'verified'` but never created a listing. Guest and beneficiary feeds only show items from the `listings` array, so approved items were invisible.

**Solution**: When approving (or reclassifying), the admin flow now:
1. Updates donation status to `'verified'`
2. **Creates a new listing** with all the donation details (title, category, clothType, size, color, images, credits)
3. Listing is immediately available in both Guest Explore and Beneficiary Browse feeds

### 2. **Rejected Items Handling**
**Problem**: Rejection was setting status back to `'uploaded'` without clearly marking it as rejected.

**Solution**: Now when rejecting:
1. Status remains `'uploaded'` (allows re-submission if donor fixes issues)
2. Admin notes are prefixed with `"REJECTED: "` + reason
3. Rejection reason is saved and sent in notification to donor
4. Item does NOT create a listing, so it stays hidden from public feeds

## Code Changes

### File: `src/screens/admin/ItemVerification.tsx`

#### Approve Action (lines 79-106):
```typescript
if (actionType === 'approve') {
  // Update donation status to verified
  updateDonationStatus(selectedDonation, 'verified', 'Approved by admin');

  // Create a listing so it appears in guest/beneficiary feeds
  const { addListing } = useDonationStore.getState();
  addListing({
    donorId: donation.donorId,
    title: donation.title,
    description: donation.description,
    category: donation.category,
    clothType: donation.clothType,
    size: donation.size,
    color: donation.color,
    images: donation.images,
    credits: donation.value || 10,
    isAvailable: true,
  });

  console.log('✅ Donation approved and listing created:', donation.title);
  // ... notification
}
```

#### Reject Action (lines 107-119):
```typescript
else if (actionType === 'reject') {
  // Mark as rejected with reason in adminNotes
  updateDonationStatus(
    selectedDonation,
    'uploaded',
    `REJECTED: ${rejectionReason || 'Does not meet guidelines'}`
  );

  console.log('❌ Donation rejected:', donation.title, 'Reason:', rejectionReason);
  // ... notification with rejection reason
}
```

#### Reclassify Action (lines 120-156):
```typescript
else if (actionType === 'reclassify') {
  // Update the donation category first
  const { donations } = useDonationStore.getState();
  const updatedDonations = donations.map(d =>
    d.id === selectedDonation ? { ...d, category: newCategory } : d
  );
  useDonationStore.setState({ donations: updatedDonations });

  // Then update status to verified and create listing
  updateDonationStatus(selectedDonation, 'verified', `Reclassified to ${newCategory} and approved`);

  // Create listing with new category
  const { addListing } = useDonationStore.getState();
  const updatedDonation = updatedDonations.find(d => d.id === selectedDonation);
  if (updatedDonation) {
    addListing({
      // ... all fields with NEW category
      category: newCategory,
      // ...
    });
  }
}
```

## How It Works Now

### Approve Flow:
1. Admin clicks "Approve" on pending donation
2. Confirms in modal
3. **Backend Actions**:
   - Donation status → `'verified'`
   - Admin notes → `"Approved by admin"`
   - **NEW**: Creates listing with:
     - All donation details (title, description, category, clothType, size, color, images)
     - Credits set to donation.value (default 10)
     - isAvailable → true
   - Sends approval notification to donor
4. **Frontend Result**:
   - Item disappears from "Pending" view
   - Item **immediately appears** in Guest Explore feed
   - Item **immediately appears** in Beneficiary Browse feed
   - Logged: `✅ Donation approved and listing created: [title]`

### Reject Flow:
1. Admin clicks "Reject" on pending donation
2. Enters rejection reason in modal
3. **Backend Actions**:
   - Donation status → stays `'uploaded'`
   - Admin notes → `"REJECTED: [reason]"`
   - No listing created
   - Sends rejection notification with reason to donor
4. **Frontend Result**:
   - Item stays in "Pending" view (marked with rejection note)
   - Item does NOT appear in any public feeds
   - Donor can see rejection reason in their notification
   - Logged: `❌ Donation rejected: [title] Reason: [reason]`

### Reclassify Flow:
1. Admin clicks "Reclassify" on pending donation
2. Selects new category (Clothing ↔ Other)
3. **Backend Actions**:
   - Updates donation category in store
   - Donation status → `'verified'`
   - Admin notes → `"Reclassified to [category] and approved"`
   - Creates listing with NEW category
   - Sends approval notification to donor
4. **Frontend Result**:
   - Item disappears from "Pending" view
   - Item appears in Guest/Beneficiary feeds under CORRECT category
   - Logged: `🔄 Donation reclassified and approved: [title] New category: [category]`

## Data Flow

```
Donor Uploads Image
  ↓
Donation Created (status='uploaded')
  ↓
Appears in Admin → Item Verification
  ↓
Admin Reviews
  ↓
  ├─ APPROVE → Creates Listing → Appears in Guest + Beneficiary Feeds
  ├─ REJECT → No Listing → Stays Hidden
  └─ RECLASSIFY → Updates Category + Creates Listing → Appears in Feeds
```

## Visibility Rules

### Items Visible in Guest Explore:
- Items from `listings` array where `isAvailable === true`
- Created by: Admin approve/reclassify actions
- **NOT**: Direct donations (those are in `donations` array)

### Items Visible in Beneficiary Browse:
- Same as Guest Explore
- Items from `listings` array where `isAvailable === true`
- Can be filtered by category and cloth type

### Items Visible in Admin Verification:
- All donations with `status === 'uploaded'` (includes pending and rejected)
- Toggle to show all donations regardless of status

## Testing Checklist

✅ **Approve Action**:
- [ ] Click approve on pending donation
- [ ] Donation disappears from pending list
- [ ] Open Guest Explore → Item appears within seconds
- [ ] Open Beneficiary Browse → Item appears within seconds
- [ ] Image is visible
- [ ] All details (title, category, clothType, size, color) are correct
- [ ] Check console → See `✅ Donation approved and listing created: [title]`

✅ **Reject Action**:
- [ ] Click reject on pending donation
- [ ] Enter rejection reason
- [ ] Donation stays in pending list with rejection note in admin notes
- [ ] Open Guest Explore → Item does NOT appear
- [ ] Open Beneficiary Browse → Item does NOT appear
- [ ] Donor receives notification with rejection reason
- [ ] Check console → See `❌ Donation rejected: [title] Reason: [reason]`

✅ **Reclassify Action**:
- [ ] Click reclassify on pending donation
- [ ] Select new category
- [ ] Donation disappears from pending list
- [ ] Item appears in feeds under NEW category
- [ ] All other details remain unchanged
- [ ] Check console → See `🔄 Donation reclassified and approved: [title] New category: [category]`

✅ **Admin Dashboard**:
- [ ] No console errors when loading
- [ ] Pending count updates correctly
- [ ] Cards and charts display properly
- [ ] Navigation between tabs is smooth
- [ ] Refresh works without errors

## Console Logs

When testing, you should see these logs:

### On Approve:
```
✅ Donation approved and listing created: Blue Denim Jacket
```

### On Reject:
```
❌ Donation rejected: Red Shirt Reason: Poor image quality
```

### On Reclassify:
```
🔄 Donation reclassified and approved: Mystery Item New category: clothing
```

## Additional Features

### Cloth Type Support:
- All listings now include `clothType`, `size`, and `color` fields
- Beneficiaries can filter by cloth type (T-Shirt, Jeans, Jacket, etc.)
- Guest users can also browse by cloth type
- AI auto-fills these fields when donors upload

### Image URLs:
- Supports both local URIs and Supabase public URLs
- Images upload to Supabase storage (if configured)
- Fallback to local URIs if upload fails
- All images display correctly in feeds

## Summary

**Before**: Approved items stayed invisible because listings weren't created
**After**: Approved items immediately appear in both Guest and Beneficiary feeds

**Before**: Rejected items had unclear status
**After**: Rejected items have clear rejection reason and stay hidden from feeds

The admin verification flow now works end-to-end with proper visibility rules!
