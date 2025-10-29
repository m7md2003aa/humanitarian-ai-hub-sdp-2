# 🎨 Visual Guide - Landing Screen Components

## Screen Flow

```
┌─────────────────────────────────────────┐
│  Landing Screen (Unauthenticated)      │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ [❤️ Logo]   [EN] [☀️]  TopAppBar │ │ <- Transparent, blurred background
│  └───────────────────────────────────┘ │
│                                         │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │
│  ┃                                   ┃ │
│  ┃    Hero Image (Parallax)         ┃ │
│  ┃    with Gradient Overlay         ┃ │
│  ┃                                   ┃ │
│  ┃    Humanitarian AI Hub            ┃ │ <- 60% screen height
│  ┃    Connecting donors...           ┃ │
│  ┃                                   ┃ │
│  ┃    [  Get Started  ]              ┃ │
│  ┃    [ Explore Guest ]              ┃ │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
│                                         │
│  ┌─────────┐  ┌─────────┐             │
│  │ Donor   │  │Benefic  │             │
│  │ ❤️  📝  │  │ 👥  💳  │             │ <- Role Cards (2x2 grid)
│  └─────────┘  └─────────┘             │
│  ┌─────────┐  ┌─────────┐             │
│  │Business │  │ Admin   │             │
│  │ 🏢  📦  │  │ 🛡️  ⚙️  │             │
│  └─────────┘  └─────────┘             │
│                                         │
│  ╔═══╗ ╔═══╗ ╔═══╗                   │
│  ║1.2k║ ║900║ ║98%║  <- Metrics       │
│  ╚═══╝ ╚═══╝ ╚═══╝                   │
│                                         │
│  Why It Matters                        │
│  ┌─────────────────────────────┐      │
│  │ Story text about platform   │      │
│  │ transparency and AI...      │      │ <- Story Section
│  └─────────────────────────────┘      │
│  ┌─────┐ ┌─────┐ ┌─────┐             │
│  │ Img │ │ Img │ │ Img │ <- Carousel │
│  └─────┘ └─────┘ └─────┘             │
│     ● ○ ○  <- Dots                    │
│                                         │
│  About • Privacy • Terms • Contact     │
│  v1.0.0 • Build 2025.01                │ <- Footer
│  🔒 Encrypted via Supabase             │
└─────────────────────────────────────────┘
```

## Auth Modal (Bottom Sheet)

```
┌─────────────────────────────────────────┐
│                                         │
│  ━━━━  (Handle Indicator)               │
│                                         │
│  ┌──────────────┬──────────────┐       │
│  │   Sign In    │   Sign Up    │       │ <- Tabs
│  └──────────────┴──────────────┘       │
│                                         │
│  Email                                  │
│  ┌─────────────────────────────────┐   │
│  │ Enter your email                │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Password                               │
│  ┌─────────────────────────────────┐   │
│  │ ••••••••••                  👁️  │   │
│  └─────────────────────────────────┘   │
│                            Forgot?      │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │    Continue with Email          │   │ <- Primary CTA
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🔵 Continue with Google         │   │ <- OAuth (coming soon)
│  └─────────────────────────────────┘   │
│                                         │
│  Demo Accounts ⌄                       │ <- Collapsible
│  ┌─────────────────────────────────┐   │
│  │ Donor Demo                      │   │
│  │ donor@test.com                  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  🔒 We never share your data.          │
│  Encrypted via Supabase.               │
│                                         │
└─────────────────────────────────────────┘
```

## Guest Home Screen

```
┌─────────────────────────────────────────┐
│ Browse Items            [Sign In]       │ <- Header
│ Browsing as guest                       │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ ℹ️  You're browsing as a guest.    │ │ <- Banner
│ │    Sign in to claim items.          │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ [All] [Food] [Clothing] [Electronics]  │ <- Category filter
├─────────────────────────────────────────┤
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │  [Item Image]                       │ │
│ │                                     │ │
│ │  Winter Jacket - Size M        15💳│ │
│ │  Warm winter jacket in...          │ │ <- Item card
│ │                                     │ │
│ │  👔 clothing    [View Details]     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │  [Item Image]                       │ │
│ │                                     │ │
│ │  Canned Food Bundle            8💳 │ │
│ │  Variety pack of canned...         │ │
│ │                                     │ │
│ │  🍽️ food        [View Details]     │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

## Theme Comparison

### Light Mode
```
Background: #F8FAFC (very light gray)
Surface:    #FFFFFF (pure white)
Text:       #0F172A (dark slate)
Primary:    #2F6BFF (blue)
Accent:     #00B894 (emerald)
```

### Dark Mode
```
Background: #0F172A (dark slate)
Surface:    #1E293B (medium slate)
Text:       #F8FAFC (very light gray)
Primary:    #5B8FFF (lighter blue)
Accent:     #00D9A5 (lighter emerald)
```

## Animation Showcase

1. **Hero Parallax** (on scroll):
   ```
   Scroll: 0px   → Image offset: 0px
   Scroll: 100px → Image offset: -50px
   Scroll: 200px → Image offset: -100px
   ```

2. **Fade In** (on mount):
   ```
   0ms:   opacity: 0, translateY: 20
   350ms: opacity: 1, translateY: 0
   ```

3. **Role Cards** (stagger):
   ```
   Card 1: delay 0ms
   Card 2: delay 100ms
   Card 3: delay 200ms
   Card 4: delay 300ms
   ```

4. **Metrics Count-Up**:
   ```
   0ms:    0
   1000ms: 1,250
   (Easing: easeOut)
   ```

## Component Hierarchy

```
LandingScreen
├── TopAppBar
│   ├── Logo (Heart icon + text)
│   ├── Language Toggle (EN/ع)
│   └── Theme Toggle (☀️/🌙)
├── HeroSection
│   ├── Background Image (with parallax)
│   ├── Gradient Overlay
│   ├── Headline (animated)
│   ├── Subheadline (animated)
│   ├── Get Started Button
│   └── Explore Guest Button
├── Role Cards Grid
│   ├── Donor Card
│   ├── Beneficiary Card
│   ├── Business Card
│   └── Admin Card
├── MetricsChips
│   ├── Items Donated Chip
│   ├── Allocations Chip
│   └── Verified Rate Chip
├── StorySection
│   ├── Headline
│   ├── Story Text
│   └── Image Carousel
│       ├── Image 1
│       ├── Image 2
│       ├── Image 3
│       └── Pagination Dots
├── Footer
│   ├── Links (About, Privacy, Terms, Contact)
│   ├── Version Info
│   └── Security Note
└── AuthModal (Bottom Sheet)
    ├── Tab Selector (Sign In / Sign Up)
    ├── Sign In Form
    │   ├── Email Input
    │   ├── Password Input
    │   ├── Forgot Password Link
    │   ├── Continue with Email Button
    │   └── Continue with Google Button
    ├── Sign Up Form
    │   ├── Name Input
    │   ├── Email Input
    │   ├── Password Input
    │   ├── Confirm Password Input
    │   ├── Role Selector
    │   └── Create Account Button
    ├── Demo Accounts (collapsible)
    │   ├── Donor Demo
    │   ├── Beneficiary Demo
    │   ├── Business Demo
    │   └── Admin Demo
    └── Security Note
```

## Responsive Breakpoints

```
Mobile (< 768px):
  - Role cards: 2x2 grid, 48% width each
  - Metrics: horizontal scroll
  - Story: stacked layout

Tablet (≥ 768px):
  - Role cards: 2x2 grid, 48% width each
  - Metrics: all visible, no scroll
  - Story: side-by-side (60/40 split)
```

## Color Usage Map

```
Component          Light Mode BG    Dark Mode BG
─────────────────  ───────────────  ──────────────
Background         #F8FAFC          #0F172A
TopAppBar          Blur             Blur
Hero Overlay       rgba(15,23,42)   rgba(15,23,42)
Role Cards         #FFFFFF          #1E293B
Metrics Chips      #F1F5F9          #334155
Story Section      #FFFFFF          #1E293B
Footer             #FFFFFF          #1E293B
Auth Modal         #FFFFFF          #1E293B
Guest Banner       #2F6BFF20        #5B8FFF20
```

---

**This visual guide helps you understand the layout and structure of all the new landing screen components!**