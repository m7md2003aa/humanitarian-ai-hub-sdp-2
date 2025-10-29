# 🧪 Donor Dashboard - Button Testing Guide

## Quick Test Steps

### Setup
```
1. Open app
2. Login as: donor@test.com / any password
3. Navigate to Dashboard tab
```

---

## 🔔 Test 1: Notifications Button

**Location**: Top-right, bell icon

**Steps**:
1. Tap the bell icon (has red badge)
2. **Expected**: Navigates to Notifications screen
3. **Visual**: Button shows press feedback (opacity change)

**Success**: ✅ Navigation works, press feedback visible

---

## 🌙 Test 2: Theme Toggle

**Location**: Top-right, moon/sun icon

**Steps**:
1. Note current theme (light/dark)
2. Tap the moon/sun icon
3. **Expected**: Theme switches immediately
4. Icon changes (moon ↔ sun)
5. Close and reopen app
6. **Expected**: Theme preference persists

**Success**: ✅ Theme toggles, icon changes, persists after restart

---

## 📊 Test 3: Impact Stat Cards (4 Tests)

**Location**: "Your Impact" section

### 3a. Total Donations Card (Blue)
1. Tap the "Total Donations" card
2. **Expected**: Opens History screen
3. **Expected**: Shows all donations (no filter)
4. **Visual**: Card shows press feedback

### 3b. Pending Review Card (Amber)
1. Tap the "Pending Review" card
2. **Expected**: Opens History screen
3. **Expected**: "Pending" filter is pre-selected
4. **Expected**: Only shows uploaded/pending items

### 3c. Listed Items Card (Lilac)
1. Tap the "Listed Items" card
2. **Expected**: Opens History screen
3. **Expected**: "Active" filter is pre-selected
4. **Expected**: Only shows verified/listed items

### 3d. Received Card (Green)
1. Tap the "Received" card
2. **Expected**: Opens History screen
3. **Expected**: "Completed" filter is pre-selected
4. **Expected**: Only shows received items

**Success**: ✅ All cards navigate with correct filters applied

---

## 🎁 Test 4: Main Donate Button

**Location**: Large teal card in center

**Steps**:
1. Tap "Donate an Item" button
2. **Expected**: Navigates to Upload screen
3. **Visual**: Subtle pulse animation visible
4. **Visual**: Press feedback on tap

**Success**: ✅ Opens Upload screen, animations work

---

## 💡 Test 5: Pro Tips Cards

**Location**: Horizontal scroll section "Pro Tips"

**Steps**:
1. Scroll horizontally to see all tip cards
2. Tap any tip card (e.g., "Use clear lighting")
3. **Expected**: Tips panel slides up from bottom
4. **Expected**: Shows all 5 detailed tips with icons:
   - Good Lighting ☀️
   - Clean Items 👕
   - Size Details 📏
   - Multiple Angles 📸
   - Clear Descriptions 🏷️

### Close Panel Tests:
**Test 5a**: Tap background (black area)
- **Expected**: Panel closes smoothly

**Test 5b**: Tap X button
- **Expected**: Panel closes smoothly

**Test 5c**: Swipe down on handle bar
- **Expected**: Panel closes smoothly (if swipe gesture enabled)

**Success**: ✅ Tips panel opens, shows all tips, closes easily

---

## ➕ Test 6: Floating "+" Button

**Location**: Bottom-right corner (always visible)

**Steps**:
1. Scroll down the page
2. **Expected**: Floating button stays visible
3. Tap the floating "+" button
4. **Expected**: Opens Upload screen (same as main donate button)
5. **Visual**: Press feedback visible

**Success**: ✅ Button always visible, opens Upload screen

---

## 📜 Test 7: Recent Donations Section

### If Donations Exist:
1. Find "Recent Donations" section
2. Tap "View All" link (top-right)
3. **Expected**: Opens History screen with all donations

### If No Donations:
1. Find "Recent Donations" section
2. **Expected**: Shows empty state with large icon
3. Tap "Upload First Item" button
4. **Expected**: Opens Upload screen

**Success**: ✅ Navigation works for both states

---

## 🎯 Visual Feedback Checklist

### All Buttons Should Show:
- [ ] Ripple/press effect on tap
- [ ] Opacity change (darker when pressed)
- [ ] Smooth animations (no jank)
- [ ] Disabled state (if loading)
- [ ] Clear visual hierarchy

### Specific Checks:
- [ ] Stat cards: Opacity 1.0 → 0.8 on press
- [ ] Main button: Gentle pulse visible
- [ ] Tips panel: Smooth slide-up animation
- [ ] Floating button: Shadow visible, circular

---

## ⚡ Performance Checks

### Loading States:
1. During navigation, buttons should:
   - Show normal state (fast navigation)
   - Not trigger multiple times
   - Respond immediately

### Animations:
- [ ] No lag or stuttering
- [ ] 60fps smooth scrolling
- [ ] Panel slides smoothly
- [ ] Pulse animation is subtle

---

## ♿ Accessibility Checks

### Screen Reader:
1. Enable VoiceOver (iOS) or TalkBack (Android)
2. **Expected**: All buttons announced clearly
3. **Examples**:
   - "View notifications, button"
   - "Switch to dark mode, button"
   - "Total donations: 5. Tap to view all donations, button"

### Tap Targets:
- [ ] All buttons ≥ 44x44px
- [ ] Easy to tap without zooming
- [ ] Adequate spacing between buttons

### Color Contrast:
- [ ] Text readable in light mode
- [ ] Text readable in dark mode
- [ ] Icons visible against backgrounds

---

## 🐛 Common Issues & Fixes

### Issue: Button doesn't respond
**Fix**: Check if navigation prop is passed correctly

### Issue: Filter doesn't apply in History
**Fix**: Check route params are being read

### Issue: Tips panel won't close
**Fix**: Tap background area, not panel itself

### Issue: Theme doesn't persist
**Fix**: Check AsyncStorage is working (Zustand middleware)

---

## ✅ Quick Verification

**30-Second Test**:
1. Tap bell → Should open Notifications ✓
2. Tap Total card → Should open History (All) ✓
3. Tap any tip → Should open Tips panel ✓
4. Close panel → Should dismiss ✓
5. Tap main donate button → Should open Upload ✓

**If all 5 work**: 🎉 **All buttons are working!**

---

## 📊 Expected Behavior Summary

| Button | Action | Screen | Feedback |
|--------|--------|--------|----------|
| Bell | Navigate | Notifications | Opacity |
| Theme | Toggle | Same | Icon change |
| Total Card | Navigate | History (All) | Opacity |
| Pending Card | Navigate | History (Pending) | Opacity |
| Listed Card | Navigate | History (Active) | Opacity |
| Received Card | Navigate | History (Completed) | Opacity |
| Main Donate | Navigate | Upload | Pulse + Opacity |
| Tip Card | Open Modal | Tips Panel | Opacity |
| Floating + | Navigate | Upload | Opacity |
| View All | Navigate | History (All) | Opacity |

---

## 🎯 Success Criteria

### ✅ Test Passes When:
1. All buttons respond to taps
2. Navigation goes to correct screens
3. Filters apply correctly
4. Tips panel opens and closes smoothly
5. Theme toggle works and persists
6. Visual feedback is clear on every tap
7. No errors in console
8. Accessibility labels work

### ❌ Test Fails When:
1. Button tap does nothing
2. Wrong screen opens
3. Filters don't apply
4. Panel doesn't open/close
5. Theme doesn't switch
6. No visual feedback
7. Console shows errors
8. Screen reader doesn't announce

---

## 📞 Quick Test Command

```bash
# Run the app
bun start

# Login
Email: donor@test.com
Password: test123 (or any)

# Test sequence:
1. Tap bell icon (Notifications)
2. Back → Tap moon icon (Theme)
3. Tap any stat card (History with filter)
4. Back → Tap any tip card (Tips panel)
5. Close panel → Tap floating + (Upload)

# If all work: ✅ Success!
```

---

## 🎉 Final Check

After testing, you should be able to say:

> "Every button on the Donor Dashboard does something obvious when I tap it. I get clear feedback, navigate to the right place, and everything works smoothly!"

---

**Happy Testing!** 🚀
