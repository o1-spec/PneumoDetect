# 📊 Authentication & Onboarding Flow - Visual Guide

## Complete User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                      PNEUMODETECT APP FLOW                      │
└─────────────────────────────────────────────────────────────────┘

                          ┌──────────────┐
                          │ App Launches │
                          └──────┬───────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
              ┌─────▼─────┐            ┌─────▼──────┐
              │ Signed In? │            │  Not Signed│
              └─────┬─────┘            └─────┬──────┘
                    │ YES                    │ NO
                    │                        │
          ┌─────────▼──────────┐      ┌──────▼────────┐
          │ Onboarding Seen?   │      │ Welcome Screen│
          └─────┬─────────┬────┘      └───────────────┘
                │         │
            YES │         │ NO
                │         │
        ┌───────▼──┐  ┌───▼─────────────┐
        │ Main App │  │ Onboarding Flow │
        │  (Tabs)  │  └───────┬─────────┘
        └──────────┘          │
                        ┌─────▼──────────┐
                        │  Skip Button?  │
                        └──┬──────────┬──┘
                         Y │          │ N
                          │          │
                    ┌─────▼──┐  ┌────▼──────┐
                    │ Screens│  │Get Started │
                    │1,2,3   │  └────┬───────┘
                    └────┬───┘       │
                         │          │
                    ┌────▼──────────┴────┐
                    │ Store Flag = true  │
                    │ (SecureStore)      │
                    └────┬───────────────┘
                         │
                    ┌────▼──────────┐
                    │  Main App     │
                    │    (Tabs)     │
                    └───────────────┘
```

---

## Sign Up → OTP → Onboarding Flow (Detailed)

```
┌─────────────────────────────────────────────────────────────────┐
│                      SIGNUP FLOW                                │
└─────────────────────────────────────────────────────────────────┘

Step 1: User Enters Signup Data
┌────────────────────────────────┐
│ • Full Name                    │
│ • Email                        │
│ • Password                     │
│ • Confirm Password            │
│ • Role (Clinician/Admin)      │
│ • Specialization (optional)   │
│ • Phone (optional)            │
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│ Form Validation               │
│ ✓ All required fields filled  │
│ ✓ Valid email format         │
│ ✓ Password >= 6 chars        │
│ ✓ Passwords match            │
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│ POST /auth/register            │
│ Send: {name, email, password,  │
│        role, specialization}   │
└────────────┬───────────────────┘
             │
          ┌──┴──┐
          │     │
      ✓   │     │   ✗
          │     │
     ┌────▼─┐ ┌┴────────┐
     │Success│ │400/500  │
     └────┬──┘ └────┬────┘
          │         │
          │    ┌────▼─────────┐
          │    │ Show Error   │
          │    │ Toast        │
          │    └──────────────┘
          │
          ▼
     ┌──────────────────────┐
     │ Backend sends OTP    │
     │ to user's email      │
     └──────────┬───────────┘
                │
                ▼
     ┌──────────────────────────────┐
     │ App: Navigate to OTP Screen  │
     │ Params: { email: "..." }     │
     └──────────┬───────────────────┘
                │
                ▼
     ┌──────────────────────────────┐
     │    OTP VERIFICATION SCREEN   │
     │                              │
     │ Shows email: user@test.com   │
     │ "Enter 6-digit code"        │
     │ Input: [0][0][0][0][0][0]  │
     │                              │
     │ [Resend in 60s button]       │
     └──────────┬───────────────────┘
                │
    ┌───────────┴────────────┐
    │ User types 6 digits    │
    │ e.g., 123456          │
    └───────────┬────────────┘
                │
                ▼
    ┌────────────────────────────┐
    │ Click "Verify" Button      │
    │ (Enabled only at 6 digits) │
    └───────────┬────────────────┘
                │
                ▼
    ┌────────────────────────────┐
    │ POST /auth/verify-otp      │
    │ Send: {email, otp}         │
    └───────────┬────────────────┘
                │
            ┌───┴────┐
            │         │
        ✓   │         │   ✗
            │         │
       ┌────▼───┐ ┌───┴─────────┐
       │ Success│ │Invalid Code │
       └────┬───┘ └───┬─────────┘
            │         │
            │    ┌────▼─────────┐
            │    │ Show Error   │
            │    │ Clear input  │
            │    │ Try again    │
            │    └──────────────┘
            │
            ▼
    ┌─────────────────────────────┐
    │ Navigate to Onboarding      │
    │ route.replace("/(onboarding)")
    └──────────┬──────────────────┘
               │
               ▼
    ┌──────────────────────────────┐
    │   ONBOARDING CAROUSEL        │
    │                              │
    │  Screen 1/3                 │
    │  ┌────────────────────────┐ │
    │  │    Welcome to          │ │
    │  │    PneumoDetect AI     │ │
    │  │                        │ │
    │  │ [Skip]  [Next]         │ │
    │  └────────────────────────┘ │
    │  ● ○ ○                      │
    └──────────────┬───────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
    [Skip]              [Next]
         │                   │
    ┌────▼──┐          ┌─────▼────┐
    │ Finish │          │ Screen 2 │
    │ & Go   │          │ "How It  │
    │ to App │          │  Works"  │
    └────┬───┘          └─────┬────┘
         │                    │
    ┌────▼──┐            ┌────▼────┐
    │Store  │            │[Skip]   │
    │ Flag  │            │[Next]   │
    │ TRUE  │            └─────┬────┘
    │       │                   │
    └───────┘           ┌───────▼─────┐
                        │ Screen 3/3  │
                        │"Privacy &   │
                        │ Security"   │
                        │             │
                        │[Get Started]│
                        └───────┬─────┘
                                │
                        ┌───────▼─────────┐
                        │ Store Flag=TRUE │
                        │ storeOnboarding │
                        │Flag(true)       │
                        └───────┬─────────┘
                                │
                        ┌───────▼─────────┐
                        │Navigate to Tabs │
                        │route.replace    │
                        │("/(tabs)")      │
                        └─────────────────┘
```

---

## Login → Check Flag → Navigate Flow

```
┌────────────────────────────────────────────┐
│         LOGIN FLOW                         │
└────────────────────────────────────────────┘

User Logs In
    │
    ▼
POST /auth/login
{email, password}
    │
  ┌─┴─┐
  │   │
  ✓   ✗
  │   │
  │   └─► Show Error
  │       Try Again
  │
  ▼
Store Token
storeAccessToken(token)
storeUserData(userData)
    │
    ▼
Check Flag:
hasSeenOnboarding()
    │
 ┌──┴──┐
 │     │
TRUE   FALSE
 │     │
 │     └─► Show Onboarding
 │         Screens 1, 2, 3
 │
 ▼
Go to Main App
/(tabs)
```

---

## State Persistence Diagram

```
┌─────────────────────────────────────────────────┐
│          SECURESTORE PERSISTENCE               │
└─────────────────────────────────────────────────┘

iOS:
┌──────────────────┐
│   Keychain       │
├──────────────────┤
│ Key: auth_token  │
│ Value: JWT...    │
│                  │
│ Key: onboarding  │
│ Value: true      │
└──────────────────┘

Android:
┌──────────────────┐
│   Keystore       │
├──────────────────┤
│ Key: auth_token  │
│ Value: JWT...    │
│                  │
│ Key: onboarding  │
│ Value: true      │
└──────────────────┘

Both: Encrypted at OS Level
      Survives app restart
      Cleared only on app uninstall
```

---

## Component Hierarchy

```
RootLayout (_layout.tsx)
│
├── AuthProvider
│   │
│   ├── Stack Navigator
│   │
│   ├── index.tsx (Welcome - Auth Check)
│   │
│   ├── (auth) group
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── otp-verification.tsx ← NEW
│   │
│   ├── (onboarding) group ← NEW
│   │   ├── _layout.tsx ← NEW
│   │   └── index.tsx (Carousel) ← NEW
│   │
│   ├── (tabs) group
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── scan.tsx
│   │   ├── history.tsx
│   │   └── profile.tsx
│   │
│   └── ToastContainer
```

---

## OTP Screen State Machine

```
┌──────────────────────────────────┐
│      OTP SCREEN STATES           │
└──────────────────────────────────┘

IDLE
  │
  ├─ User types digit
  │  └─► TYPING
  │      │
  │      ├─ Valid (0-9)
  │      │  └─► Update state
  │      │      Check if 6 digits
  │      │
  │      └─ Invalid char
  │         └─► Ignore
  │
  ├─ Click Verify (if 6 digits)
  │  └─► VERIFYING
  │      │
  │      ├─ Success
  │      │  └─► Navigate to Onboarding
  │      │
  │      └─ Error
  │         └─► Show error message
  │            └─► Back to TYPING
  │
  └─ Click Resend
     └─► RESENDING
         │
         ├─ Success
         │  └─► Start 60s timer
         │      Disable resend button
         │
         └─ Error
            └─► Show error
               └─► Back to IDLE
```

---

## Onboarding Screen State Machine

```
┌──────────────────────────────────┐
│  ONBOARDING SCREEN STATES        │
└──────────────────────────────────┘

SCREEN 1
├─ [Skip] ──► Store Flag ──► Go to App
├─ [Next] ──► SCREEN 2
└─ Dots: ● ○ ○

SCREEN 2
├─ [Skip] ──► Store Flag ──► Go to App
├─ [Next] ──► SCREEN 3
└─ Dots: ○ ● ○

SCREEN 3
├─ [Get Started] ──► Store Flag ──► Go to App
└─ Dots: ○ ○ ●

Store Flag Function:
storeOnboardingFlag(true)
├─ Save to SecureStore
├─ Key: pneumodetect_has_seen_onboarding
├─ Value: true (JSON)
└─ On next app launch:
   hasSeenOnboarding() returns true
   └─► Skip onboarding, go to tabs
```

---

## Navigation Intent Diagram

```
NAVIGATION DECISIONS

After Signup Registration:
└─► isSuccess?
    ├─ Yes ──► Navigate to OTP
    │          with email param
    └─ No ──► Show error toast

After OTP Verification:
└─► isSuccess?
    ├─ Yes ──► Navigate to Onboarding
    └─ No ──► Show error, stay on OTP

After Onboarding:
└─► Route to: /(tabs)
    This route group handles
    all main app screens

On App Launch (index.tsx):
└─► checkAuthStatus()
    ├─ isLoading? Wait
    ├─ !isSignedIn? Show Welcome
    └─ isSignedIn?
       ├─ hasSeenOnboarding?
       │  ├─ Yes ──► Go to Tabs
       │  └─ No ──► Go to Onboarding
       └─ Never loaded? Check again

On Login Success:
└─► Check hasSeenOnboarding
    ├─ Yes ──► Go to Tabs
    └─ No ──► Go to Onboarding
```

---

## File Structure Overview

```
PneumoDetect/
├── app/
│   ├── index.tsx                    ← Auth status check
│   ├── _layout.tsx                  ← Root stack (modified)
│   ├── (auth)/
│   │   ├── login.tsx
│   │   ├── signup.tsx               ← Navigate to OTP
│   │   └── otp-verification.tsx     ← NEW
│   ├── (onboarding)/                ← NEW GROUP
│   │   ├── _layout.tsx              ← NEW
│   │   └── index.tsx                ← NEW
│   └── (tabs)/
│       └── ...
│
├── hooks/
│   ├── useAuth.tsx                  ← verifyOTP(), resendOTP()
│   └── useToast.ts
│
├── utils/
│   ├── secureStorage.ts             ← Onboarding flag functions
│   └── ...
│
├── components/
│   └── ...
│
└── types/
    └── ...
```

---

**Visual Guide Complete! 🎨**

All flows documented with ASCII diagrams and state machines.
