# 🧪 Credit Sync Testing Guide

## Quick Test Steps

### 1. **Open the App & Login**
```
Email: beneficiary@test.com
Password: any password
```

### 2. **Check Initial Balance**
- Go to **Dashboard**
- Note your credit balance (e.g., 80 credits)
- Remember this number!

### 3. **Navigate to Browse Items**
- Tap on "Browse Items" tab
- **Observe**: Credit badge shows same balance (80 credits)
- Find an item you can afford

### 4. **Claim an Item**
- Tap on an item (e.g., costs 15 credits)
- Tap "Claim Item" in modal
- **✨ MAGIC MOMENT**: Watch the credit badge update immediately!
- Should now show: 80 - 15 = **65 credits**

### 5. **Go to Credit History (Without Refresh)**
- Tap on "Credit History" tab
- **Observe**: Hero card shows **65 credits** (not 80!)
- **Observe**: New transaction appears: "Claimed: [Item Name]" with -15
- **Observe**: Total spent increased by 15

### 6. **Return to Dashboard**
- Tap on "Dashboard" tab
- **Observe**: Credit balance shows **65 credits**
- No page refresh or reload needed!

---

## ✅ What to Look For

### Real-Time Updates
- [ ] Credit balance changes **instantly** after claiming
- [ ] No delay or loading spinner needed
- [ ] No need to refresh or reopen pages

### Consistency Across Pages
- [ ] Dashboard shows same balance as Browse Items
- [ ] Credit History shows same balance
- [ ] All pages display identical credit amount

### Transaction History
- [ ] New "spent" transaction appears immediately
- [ ] Transaction shows correct item name
- [ ] Transaction shows correct credit amount
- [ ] Date and time are accurate

---

## 🚫 What Should NOT Happen

### ❌ Old Behavior (Fixed!)
- ~~Credits don't update on other pages~~
- ~~Need to refresh page to see new balance~~
- ~~Different balances shown on different screens~~
- ~~Stale data after claiming items~~

### ✅ New Behavior (Working!)
- ✓ Credits update everywhere instantly
- ✓ No refresh needed
- ✓ Consistent balance across all pages
- ✓ Real-time transaction history

---

## 📱 Test Scenarios

### Scenario 1: Single Claim
1. Start with 80 credits
2. Claim item worth 15 credits
3. **Expected**: All pages show 65 credits immediately

### Scenario 2: Multiple Claims
1. Start with 65 credits
2. Claim item worth 8 credits → Balance: 57
3. **Without refreshing**, claim another item worth 10 credits → Balance: 47
4. **Expected**: All pages show 47 credits

### Scenario 3: Rapid Navigation
1. Start on Dashboard (80 credits)
2. Go to Browse Items → Claim item (→ 65)
3. Immediately go to Credit History
4. **Expected**: Shows 65 credits, not 80

### Scenario 4: Insufficient Credits
1. Find expensive item (e.g., 100 credits)
2. Try to claim with only 65 credits
3. **Expected**: Error message, balance unchanged
4. **Expected**: All pages still show 65 credits

---

## 🔍 Debug Checklist

### If credits don't sync:

1. **Check Console for Errors**
   - Open developer tools
   - Look for Zustand errors
   - Check for TypeScript errors

2. **Verify Hook Usage**
   - Ensure `useUserCredits` is imported
   - Confirm `initializeUserCredits` is called
   - Check user ID is passed correctly

3. **Test Transaction Store**
   - Verify transactions are being added
   - Check transaction type ('earned' or 'spent')
   - Confirm beneficiaryId matches user ID

4. **Restart App**
   - Sometimes cache needs clearing
   - Close and reopen the app
   - Try with fresh login

---

## 📊 Expected Values

### Test Account: beneficiary@test.com

**Initial State**:
- Welcome bonus: +50 credits
- Participation bonus: +30 credits
- **Total Start**: 80 credits

**After Claiming Sample Items**:
- Claim "Winter Jacket" (15 credits) → **65 credits**
- Claim "Kitchen Bundle" (8 credits) → **57 credits**

**Transaction History Should Show**:
1. +50 - Welcome bonus credits (earned)
2. +30 - Community participation bonus (earned)
3. -15 - Claimed: Winter Jacket (spent)
4. -8 - Claimed: Kitchen Supplies Bundle (spent)

**Final Balance**: 57 credits

---

## 🎯 Success Criteria

### ✅ Test Passes When:
1. Credit balance updates instantly across all pages
2. No manual refresh or navigation reset needed
3. All pages show identical credit amounts
4. Transaction history updates in real-time
5. No console errors or warnings
6. Calculations are mathematically correct

### ❌ Test Fails When:
1. Credits don't sync between pages
2. Need to refresh to see updates
3. Different balances on different screens
4. Transactions missing or delayed
5. Console shows errors
6. Math doesn't add up

---

## 🐛 Common Issues & Fixes

### Issue: Credits show 0
**Fix**: Make sure `initializeUserCredits` is called on mount

### Issue: Old balance persists
**Fix**: Check if using `user.credits` instead of `useUserCredits`

### Issue: Balance inconsistent
**Fix**: Verify all screens use the same `useUserCredits` hook

### Issue: Transactions not appearing
**Fix**: Check `addTransaction` is called correctly in `claimItem`

---

## 📞 Quick Test Command

```bash
# Run the app
bun start

# Login as beneficiary
Email: beneficiary@test.com
Password: test123 (or any)

# Navigate: Dashboard → Browse Items → Claim Item → Credit History
# Verify: Balance syncs instantly across all pages
```

---

## ✅ Final Verification

After testing, you should be able to say:

> "I can claim items on the Browse Items page, and my credit balance updates immediately on all pages—Dashboard, Credit History, and Browse Items—without needing to refresh or reopen anything. It's truly real-time!"

---

**Happy Testing!** 🎉
