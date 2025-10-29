# 🧪 Testing Accounts

This document contains test accounts for each user role in the application. You can use these accounts to test the different dashboards and features.

## 📋 How to Use Test Accounts

The app has a **mock authentication system** that automatically determines your role based on your email address. You can use **any password** - it will be accepted!

### Quick Start
1. Open the app and tap "Sign In"
2. Use any email from the list below
3. Enter any password (e.g., "test123")
4. You'll be logged in as that role!

---

## 👤 Test Accounts by Role

### 🎁 **Donor Account**
Test the donor experience - upload donations, track their status, and see your impact.

**Email:** `donor@test.com`  
**Password:** `test123` (or any password)  
**Features:**
- View donation stats (Total, Pending, Listed, Received)
- Upload new donations
- Track donation history
- See helpful tips carousel
- View recent donation status

**Alternative emails:**
- `sarah.donor@test.com`
- `john.donor@test.com`
- `donor1@example.com`

---

### 🌟 **Beneficiary Account**
Test the beneficiary experience - browse items, claim with credits.

**Email:** `beneficiary@test.com`  
**Password:** `test123` (or any password)  
**Features:**
- View available credits (starts with 100)
- Browse available items
- Filter by category (Clothing, Other)
- Search for specific items
- Claim items using credits
- View credit history

**Alternative emails:**
- `maria.beneficiary@test.com`
- `alex.beneficiary@test.com`
- `beneficiary1@example.com`

---

### 🏪 **Business Account**
Test the business experience - upload surplus inventory, track community impact.

**Email:** `business@test.com`  
**Password:** `test123` (or any password)  
**Features:**
- View business impact metrics
- Upload surplus items
- Donate items for free
- Offer discounted sales
- Track listings (Total, Donated, Sold)
- See community impact (credits given)
- Business verification status

**Alternative emails:**
- `store.business@test.com`
- `shop.business@test.com`
- `business1@example.com`

---

### 🛡️ **Admin Account**
Test the admin dashboard - verify donations, manage users, view system health.

**Email:** `admin@test.com`  
**Password:** `test123` (or any password)  
**Features:**
- View system overview metrics
- Verify pending donations
- Manage user accounts
- Credit management
- View analytics
- System health monitoring
- Approve/Reject donations
- 98% AI accuracy display

**Alternative emails:**
- `system.admin@test.com`
- `superadmin@test.com`
- `admin1@example.com`

---

## 🎨 **Guest Mode**
No account needed! Just open the app without signing in.

**Features:**
- Browse all available items
- Filter by category
- View item details
- See sign-in prompts for claiming
- Beautiful read-only experience

---

## 🔄 **How Mock Auth Works**

The system checks your email and assigns a role:
- Contains `admin` → **Admin** role
- Contains `business` → **Business** role  
- Contains `beneficiary` → **Beneficiary** role
- Everything else → **Donor** role

### Example:
- `admin@anything.com` → Admin
- `mybusiness@test.com` → Business
- `beneficiary123@test.com` → Beneficiary
- `hello@test.com` → Donor

---

## 💡 **Pro Tips**

1. **Any Password Works**: The mock system accepts any password, so use simple ones like "test123"

2. **Create Custom Accounts**: You can make your own test emails:
   - `johnadmin@test.com` → Admin
   - `sarahbusiness@test.com` → Business
   - `alexbeneficiary@test.com` → Beneficiary

3. **Role-Specific Features**:
   - **Beneficiaries** start with 100 credits
   - **Businesses** have verification status (currently verified by default in mock)
   - **Admins** see pending verification queue
   - **Donors** see donation tracking

4. **Test Different Scenarios**:
   - Sign in as donor → upload donation
   - Sign in as admin → verify that donation
   - Sign in as beneficiary → claim verified items
   - Sign in as business → upload surplus inventory

5. **Logout & Switch**: Tap your profile → Logout to switch between accounts

---

## 🚀 **Quick Test Flow**

### Complete User Journey:
1. **Start as Guest**
   - Browse items without signing in
   - Try to claim → see sign-in prompt

2. **Sign in as Donor** (`donor@test.com`)
   - View your empty dashboard
   - Upload a donation
   - See it in "Pending" status

3. **Switch to Admin** (`admin@test.com`)
   - See the pending donation
   - Approve it
   - Watch system stats update

4. **Switch to Beneficiary** (`beneficiary@test.com`)
   - See the approved item
   - Claim it with credits
   - Watch credits decrease

5. **Switch to Business** (`business@test.com`)
   - Upload surplus items
   - View community impact
   - See business metrics

---

## 📱 **Testing Each Dashboard**

### ✅ Donor Dashboard Checklist:
- [ ] View stats (Total, Pending, Listed, Received)
- [ ] Scroll through tips carousel
- [ ] See recent donations list
- [ ] Tap "Upload Donation" button
- [ ] Check empty state (if no donations)

### ✅ Beneficiary Dashboard Checklist:
- [ ] View credits balance
- [ ] Use search bar
- [ ] Filter by category
- [ ] Claim items
- [ ] See "not enough credits" state
- [ ] Check info card

### ✅ Business Dashboard Checklist:
- [ ] View verification badge
- [ ] Check impact metrics
- [ ] Tap quick action cards
- [ ] View recent listings
- [ ] See community impact banner

### ✅ Admin Dashboard Checklist:
- [ ] Check system operational status
- [ ] View pending verifications
- [ ] Approve/Reject donations
- [ ] Tap admin action cards
- [ ] View system health metrics

### ✅ Guest Home Checklist:
- [ ] Browse without account
- [ ] Filter categories
- [ ] Try to claim item
- [ ] See sign-in modal
- [ ] Tap "Sign In Now"

---

## 🔒 **Production Note**

**⚠️ IMPORTANT:** This mock authentication system is for **TESTING ONLY**. 

In production, you should:
1. Enable Supabase authentication (see `SUPABASE_SETUP.md`)
2. Create real user accounts with secure passwords
3. Implement proper password hashing
4. Add email verification
5. Set up proper role-based access control

The mock system will automatically be bypassed once Supabase is configured!

---

## 🐛 **Troubleshooting**

**Issue:** Can't log in
- **Solution:** Make sure you're using one of the role keywords in your email

**Issue:** Wrong dashboard showing
- **Solution:** Check your email contains the right keyword (admin/business/beneficiary)

**Issue:** Features not working
- **Solution:** Try logging out and back in. Some features require mock data.

**Issue:** Want to reset everything
- **Solution:** Uninstall and reinstall the app (clears AsyncStorage)

---

## 📞 **Need Help?**

If you encounter any issues while testing:
1. Check the console logs for errors
2. Verify you're using the correct email format
3. Try a different test account
4. Log out and log back in
5. Restart the app

---

**Happy Testing! 🎉**
