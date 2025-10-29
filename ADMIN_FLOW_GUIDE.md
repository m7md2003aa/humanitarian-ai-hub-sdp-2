# Admin Dashboard - User Flow Guide

## Navigation Map

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  🌙 Dark Mode Toggle (top-right)                      │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  📊 System Overview                                          │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                       │
│  │  12  │ │  5   │ │  45  │ │ 850  │                       │
│  │Total │ │Pending│ │Active│ │Credit│                       │
│  └──────┘ └──────┘ └──────┘ └──────┘                       │
│                                                              │
│  🎯 Admin Actions (tap to navigate)                         │
│  ┌────────────────────────────────────┐                     │
│  │ ✅ Verify Donations        →  [1] │                     │
│  │ 👥 Manage Users            →  [2] │                     │
│  │ 💰 Credit Management       →  [3] │                     │
│  │ 📊 Analytics               →  [4] │                     │
│  └────────────────────────────────────┘                     │
│                                                              │
│  📋 Pending Verifications Preview                           │
│  (Shows first 5 items, tap action card [1] to see all)      │
└─────────────────────────────────────────────────────────────┘
```

---

## [1] Item Verification Screen

**Access**: Dashboard → "Verify Donations" card

```
┌─────────────────────────────────────────────────────────┐
│  📸 Item Verification                                   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  ⏰ 5 Pending                                    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  [Image Preview - 300x200]                      │   │
│  │                                                  │   │
│  │  **Winter Jacket - Size M**                     │   │
│  │  Warm winter jacket in excellent condition      │   │
│  │                                                  │   │
│  │  🏷 clothing  ⭐ 15 credits  📅 Oct 15, 2025   │   │
│  │  🤖 AI: 95%                                     │   │
│  │                                                  │   │
│  │  ┌─────────┐ ┌──────────┐ ┌─────────┐         │   │
│  │  │ ❌ Reject│ │🔄 Reclassify│ │✅ Approve│         │   │
│  │  └─────────┘ └──────────┘ └─────────┘         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  (More pending items below...)                         │
└─────────────────────────────────────────────────────────┘
```

### Actions:
- **❌ Reject**: Enter reason → Send notification to donor
- **🔄 Reclassify**: Choose new category → Approve with new category
- **✅ Approve**: Confirm → Update status to "verified" → Notify donor

---

## [2] User Management Screen

**Access**: Dashboard → "Manage Users" card

```
┌─────────────────────────────────────────────────────────┐
│  👥 User Management                                     │
│                                                         │
│  Filter: [All] [Donors] [Beneficiaries] [Businesses]   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 💚 Sarah Beneficiary                            │   │
│  │    sarah@beneficiary.com                        │   │
│  │    🏷 beneficiary  💰 150 credits               │   │
│  │                                                  │   │
│  │    ┌──────────┐  ┌──────────┐                  │   │
│  │    │💰 Credits │  │🚫 Suspend │                  │   │
│  │    └──────────┘  └──────────┘                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 💙 John Donor                                   │   │
│  │    john@donor.com                               │   │
│  │    🏷 donor                                     │   │
│  │                                                  │   │
│  │    ┌──────────┐                                 │   │
│  │    │🚫 Suspend │                                 │   │
│  │    └──────────┘                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🔴 Tom Beneficiary  🚫 Suspended                │   │
│  │    tom@beneficiary.com                          │   │
│  │    🏷 beneficiary  💰 45 credits                │   │
│  │                                                  │   │
│  │    ┌──────────┐  ┌──────────┐                  │   │
│  │    │💰 Credits │  │✅ Activate│                  │   │
│  │    └──────────┘  └──────────┘                  │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Actions:
- **💰 Credits**: Grant (+50) or revoke (-20) credits
- **🚫 Suspend**: Disable user account
- **✅ Activate**: Restore suspended account

---

## [3] Credit Management Screen

**Access**: Dashboard → "Credit Management" card

```
┌─────────────────────────────────────────────────────────┐
│  💰 Credit Management                                   │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│  │   850    │ │   680    │ │   170    │              │
│  │Circulated│ │  Earned  │ │  Spent   │              │
│  └──────────┘ └──────────┘ └──────────┘              │
│                                                         │
│  🎯 Bulk Actions                                        │
│  ┌──────────────┐  ┌──────────────┐                   │
│  │👥 Grant to All│  │📥 Export CSV │                   │
│  └──────────────┘  └──────────────┘                   │
│                                                         │
│  📋 Transaction Log                                     │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ⬇️ Welcome bonus credits                        │   │
│  │    Oct 15, 2025 at 10:30 AM  🏷 earned         │   │
│  │                                         +50     │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ⬆️ Claimed: Winter Jacket                       │   │
│  │    Oct 14, 2025 at 3:45 PM   🏷 spent          │   │
│  │                                         -15     │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  (More transactions below...)                          │
└─────────────────────────────────────────────────────────┘
```

### Features:
- **Statistics**: Total circulated, earned, spent
- **Bulk Grant**: Give credits to all beneficiaries at once
- **Transaction Log**: Complete history with date/time/type
- **Export**: Download CSV report (coming soon)

---

## [4] Analytics Dashboard

**Access**: Dashboard → "Analytics" card

```
┌─────────────────────────────────────────────────────────┐
│  📊 Analytics Dashboard                                 │
│                                                         │
│  Timeframe: [This Week] [This Month]                   │
│                                                         │
│  📈 Donations Over Time                                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 28  25  22  18  15  20  12                      │   │
│  │ ║   ║   ║   ║   ║   ║   ║                      │   │
│  │ ║   ║   ║   ║   ║   ║   ║                      │   │
│  │ ║   ║   ║   ║   ║   ║   ║                      │   │
│  │ Sun Sat Fri Thu Wed Tue Mon                      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  🥧 Most Redeemed Categories                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🟦 Clothing    12 (67%)                         │   │
│  │ ████████████████████░░░░░░░                     │   │
│  │                                                  │   │
│  │ 🟩 Other       6 (33%)                          │   │
│  │ ████████░░░░░░░░░░░░░░░░░                       │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  🏆 Top Donors                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │ #1  John Donor      15 donations  450 credits 🏆│   │
│  │ #2  Sarah Generous  12 donations  380 credits   │   │
│  │ #3  Mike Helper     10 donations  320 credits   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  🥇 Top Beneficiaries                                   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ #1  Maria Help   8 redeemed  240 spent 🥇       │   │
│  │ #2  Tom Support  6 redeemed  180 spent          │   │
│  │ #3  Lisa Help    5 redeemed  150 spent          │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  🤖 AI Classification Accuracy                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                  │   │
│  │              🎯                                  │   │
│  │              94%                                 │   │
│  │      Based on 18 verified donations             │   │
│  │                                                  │   │
│  │  ████████████████████████████████████░░░░       │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Features:
- **Bar Chart**: Visual donation trends
- **Category Distribution**: Percentage breakdown with progress bars
- **Leaderboards**: Top 3 donors and beneficiaries
- **AI Accuracy**: Real-time tracking of classification performance

---

## Bottom Tab Navigation

All admin features are accessible via:

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│         [HOME]   [✓CHECK]   [USERS]   [PROFILE]        │
│        Dashboard   Verify    Users     Settings         │
└─────────────────────────────────────────────────────────┘
```

- **Home**: Main dashboard with all action cards
- **Verify**: Quick access to item verification
- **Users**: Quick access to user management
- **Profile**: Admin profile and settings

---

## Keyboard Shortcuts

- **Dashboard → Verify**: Tap "Verify Donations" card
- **Dashboard → Users**: Tap "Manage Users" card
- **Dashboard → Credits**: Tap "Credit Management" card
- **Dashboard → Analytics**: Tap "Analytics" card

All screens support **back navigation** via the native header or gesture.

---

## Dark Mode

Toggle dark mode from any admin screen using the **moon/sun icon** in the top-right corner of the dashboard.

All screens automatically adapt to light/dark mode:
- ☀️ Light mode: White backgrounds, dark text
- 🌙 Dark mode: Dark backgrounds, light text

---

## Status Indicators

- 🟢 **Active**: User account is active
- 🔴 **Suspended**: User account is disabled
- 🟡 **Pending**: Donation awaiting verification
- ✅ **Verified**: Donation approved by admin
- ❌ **Rejected**: Donation not approved

---

## Notification System

Users receive in-app notifications for:
- ✅ Donation approved
- ❌ Donation rejected (with reason)
- 🔄 Donation reclassified
- 💰 Credits granted/revoked
- 🚫 Account suspended
- ✅ Account reactivated

All notifications appear in the user's notification screen.
