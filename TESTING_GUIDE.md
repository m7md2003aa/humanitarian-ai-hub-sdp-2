# 🚀 Quick Testing Guide

## 🔐 Login Credentials
All test accounts work with **any password**:

```
Donor:        donor@test.com
Beneficiary:  beneficiary@test.com
Business:     business@test.com
Admin:        admin@test.com
```

---

## ✅ What to Test

### 1. Dark Mode (All Users)
**Location**: Profile tab (bottom right)
- Toggle the "Dark Mode" switch
- Navigate through all screens
- Verify colors change appropriately

### 2. Donor Upload Flow
**User**: `donor@test.com`
**Location**: Upload tab (middle)

**Steps**:
1. Tap "Upload" tab in bottom navigation
2. Choose "Take Photo" or "Choose from Gallery"
3. Capture/select an image
4. Tap "Continue"
5. Fill in:
   - Title (required) - e.g., "Winter Jacket"
   - Description (optional)
   - Category (required) - Clothing or Other
6. Tap "Submit Donation"
7. See success screen
8. Tap "Done" or "Upload Another"
9. Check "History" tab to see uploaded item

### 3. Business Upload Flow
**User**: `business@test.com`
**Location**: Upload tab (middle)

**Steps**:
1. Tap "Upload" tab in bottom navigation
2. Choose "Take Photo" or "Choose from Gallery"
3. Capture/select an image
4. Tap "Continue"
5. Fill in:
   - Title (required) - e.g., "Grocery Bundle"
   - Description (optional)
   - Category (required) - Clothing or Other
   - Retail Price (optional) - e.g., "25.00"
   - Credit Cost (required) - e.g., "15"
   - Pickup Location (optional) - e.g., "123 Main St"
6. Tap "List Item"
7. See success screen
8. Tap "Done" or "Upload Another"

### 4. Camera Features (Both Upload Screens)
- **Take Photo**: Opens full-screen camera
- **Flip Camera**: Toggle between front/back
- **Close**: Exit camera without taking photo
- **Capture**: White button at bottom - takes photo
- **Remove Photo**: Delete captured image and choose again
- **Choose from Gallery**: Pick existing photo

### 5. Beneficiary Features
**User**: `beneficiary@test.com`
**Locations**: Browse tab, Credits tab

**Test**:
- Browse items with search and filters
- View credit balance
- Claim items (if enough credits)
- View credit transaction history

### 6. Admin Features
**User**: `admin@test.com`
**Locations**: Verify tab, Users tab

**Test**:
- View pending donations
- Approve/reject donations
- Assign credit values
- View and manage users
- Filter users by role

---

## 🎨 What's Different (Redesign Highlights)

### Visual Improvements
- ✅ Role-specific gradient colors
- ✅ Smooth staggered animations
- ✅ Modern card-based layouts
- ✅ Proper shadows and depth
- ✅ Consistent spacing and typography
- ✅ Native iOS feel throughout

### Functional Improvements
- ✅ Dark mode support (all screens)
- ✅ Bottom sheet modals (no more alerts)
- ✅ Loading states during actions
- ✅ Empty states with helpful messages
- ✅ Success screens with clear actions
- ✅ Form validation feedback

### Technical Improvements
- ✅ Type-safe TypeScript
- ✅ Zustand state management
- ✅ AsyncStorage persistence
- ✅ Native camera integration
- ✅ Safe area handling
- ✅ Keyboard avoidance

---

## 📱 Screen-by-Screen Checklist

### Guest/Landing ✅
- [x] Modern hero section
- [x] Role-based navigation cards
- [x] Test account info
- [x] Dark mode ready

### Donor Dashboard ✅
- [x] Gradient hero card
- [x] Quick stats row
- [x] Recent donations list
- [x] Upload button prominent
- [x] Dark mode

### Donor Upload ✅ **NEW**
- [x] Camera integration
- [x] Gallery picker
- [x] Multi-step form
- [x] Success screen
- [x] Dark mode

### Donor History ✅
- [x] Status filters
- [x] Donation cards with images
- [x] Empty state
- [x] Dark mode

### Beneficiary Dashboard ✅
- [x] Credit balance card
- [x] Featured items grid
- [x] Quick browse button
- [x] Dark mode

### Beneficiary Browse ✅
- [x] Search bar
- [x] Category filters
- [x] Item grid with images
- [x] Claim modal
- [x] Dark mode

### Beneficiary Credits ✅
- [x] Balance hero card
- [x] Transaction list
- [x] Earned/spent labels
- [x] Dark mode

### Business Dashboard ✅
- [x] Revenue metrics
- [x] Active listings count
- [x] Recent listings
- [x] Upload button
- [x] Dark mode

### Business Upload ✅ **NEW**
- [x] Camera integration
- [x] Gallery picker
- [x] Pricing form
- [x] Location field
- [x] Success screen
- [x] Dark mode

### Admin Dashboard ✅
- [x] System stats cards
- [x] Pending items count
- [x] User stats
- [x] Quick actions
- [x] Dark mode

### Admin Verification ✅
- [x] Full-screen images
- [x] AI confidence scores
- [x] Approve/reject modals
- [x] Credit value assignment
- [x] Dark mode

### Admin Users ✅
- [x] Role filter chips
- [x] User cards with badges
- [x] Search functionality
- [x] Empty states
- [x] Dark mode

### Profile ✅
- [x] Gradient hero section
- [x] Dark mode toggle
- [x] Settings sections
- [x] Logout button
- [x] Dark mode

### Notifications ✅
- [x] All/Unread tabs
- [x] Gradient icons
- [x] Mark as read
- [x] Empty states
- [x] Dark mode

---

## 🎯 Expected Behavior

### Upload Flows
1. **Photo Selection**: Should open camera or gallery picker
2. **Form Validation**: Submit button disabled until required fields filled
3. **Loading State**: "Uploading..." or "Listing..." text during submit
4. **Success**: Green checkmark with celebratory message
5. **Navigation**: Options to go back to dashboard or upload another

### Dark Mode
1. **Toggle**: Profile screen → Dark Mode switch
2. **Persistence**: Choice saved, persists across app restarts
3. **Coverage**: All 14 screens adapt colors
4. **Contrast**: Text remains readable in both themes

### Navigation
1. **Bottom Tabs**: Role-specific tabs (Donor has Upload, Beneficiary has Browse, etc.)
2. **Back Buttons**: Always in top-left when available
3. **Modals**: Slide up from bottom (native iOS style)
4. **Transitions**: Smooth native animations

---

## 🐛 Known Behaviors (Not Bugs)

1. **Mock Data**: Listings are placeholder data (not real backend)
2. **Test Auth**: Test accounts bypass Supabase authentication
3. **Upload Simulation**: 1.5 second delay simulates network upload
4. **Camera Permissions**: May need to grant on first use
5. **Orange Menu Button**: Part of Vibecode system (ignore in screenshots)

---

## 💡 Tips

- **Reset State**: If weird behavior, log out and log back in
- **Dark Mode**: Toggle in Profile to see full theme changes
- **Upload Test**: Use gallery picker for faster testing (no camera needed)
- **Forms**: Try submitting empty forms to see validation
- **Navigation**: Bottom tabs are the main navigation method

---

## 🎊 Success Criteria

All these should work:
- ✅ Login with test accounts
- ✅ Toggle dark mode in Profile
- ✅ Upload donation as donor (camera or gallery)
- ✅ Upload item as business (camera or gallery)
- ✅ Browse items as beneficiary
- ✅ View credit history as beneficiary
- ✅ Verify items as admin
- ✅ Manage users as admin
- ✅ View notifications (all roles)
- ✅ Navigate between tabs smoothly
- ✅ See animations and transitions
- ✅ All text readable in both themes

**If all the above work, the app is functioning perfectly! 🚀**

---

## 📞 Quick Commands

```bash
# App already running on port 8081 in Vibecode
# View through Vibecode mobile app

# No additional setup needed!
```

---

**Ready to test? Start with `donor@test.com` and try the upload flow!** 🎉
