# OTP Verification & Onboarding Flow - Complete Implementation

## 🎯 Overview

Your PneumoDetect app now has a complete authentication flow with OTP email verification and onboarding screens for first-time users.

---

## 📊 Authentication Flow Diagram

```
Welcome Screen (index.tsx)
        ↓
   Sign Up Form
        ↓
   Backend Registration
        ↓
   OTP Verification Screen
   (6-digit code from email)
        ↓
   Check: hasSeenOnboarding?
        ├─→ NO  → Onboarding Screens (3 slides)
        │          ↓
        │        Get Started Button
        │          ↓
        └─→ YES → Main App (Tabs)
   
   OR from Email after OTP
   
   Welcome Screen
        ↓
   Sign In (Login)
        ↓
   Check: hasSeenOnboarding?
        ├─→ NO  → Onboarding Screens
        │          ↓
        │        Get Started Button
        │          ↓
        └─→ YES → Main App (Tabs)
```

---

## 📁 Files Created & Updated

### New Files Created:

1. **`app/(auth)/otp-verification.tsx`** (NEW)
   - Purpose: OTP verification screen
   - Features:
     - 6-digit OTP input with large font
     - Real-time numeric validation
     - Verify button (disabled until 6 digits entered)
     - Resend OTP button with 60-second cooldown
     - Error handling and toast notifications
   - Flow: After successful verification → onboarding check

2. **`app/(onboarding)/_layout.tsx`** (NEW)
   - Purpose: Navigation layout for onboarding screens
   - Uses: Stack navigator (no header)

3. **`app/(onboarding)/index.tsx`** (NEW)
   - Purpose: Main onboarding carousel
   - Features:
     - 3 screens: Welcome, How It Works, Privacy/Security
     - Horizontal scroll (currently disabled, use Next button)
     - Animated dots indicator
     - Skip button on screens 1-2
     - Get Started button on final screen
     - Stores `hasSeenOnboarding = true` on completion

### Updated Files:

1. **`app/index.tsx`** (MODIFIED)
   - Added: `checkAuthStatus()` function
   - Now checks if user is signed in
   - If signed in, checks `hasSeenOnboarding` flag
   - Routes accordingly:
     - Not signed in → Show welcome screen
     - Signed in + no onboarding → Show onboarding
     - Signed in + seen onboarding → Go to main app

2. **`app/_layout.tsx`** (MODIFIED)
   - Added: `<Stack.Screen name="(onboarding)" />`
   - Now includes onboarding route group

3. **`app/(auth)/signup.tsx`** (MODIFIED)
   - Changed: After registration success
   - Now navigates to OTP verification with email param
   - Previously: Went directly to main app

4. **`hooks/useAuth.tsx`** (MODIFIED)
   - Added: `verifyOTP()` method
   - Added: `resendOTP()` method
   - Updated AuthContextType interface

5. **`utils/secureStorage.ts`** (MODIFIED)
   - Added: `storeOnboardingFlag()`
   - Added: `hasSeenOnboarding()`
   - Both use SecureStore for persistence

---

## 🔄 Detailed Flow Walkthrough

### Step 1: User Registration
```
User fills signup form
↓
Clicks "Create Account"
↓
handleSignUp() called
↓
Calls register(registerData)
↓
If SUCCESS:
  - Show toast: "Account created successfully!"
  - Navigate to OTP verification screen
  - Pass email as route param
```

### Step 2: OTP Verification
```
User receives OTP email
↓
Enters 6-digit code
↓
Clicks "Verify"
↓
Calls verifyOTP({ email, otp })
↓
Backend validates OTP
↓
If SUCCESS:
  - Show toast: "Email verified!"
  - Navigate to onboarding
```

### Step 3: Onboarding Check
```
OTP screen redirects to: /(onboarding)
↓
Onboarding screen loads
↓
Shows 3 slides:
  1. Welcome to PneumoDetect
  2. How It Works
  3. Privacy/Security
```

### Step 4: Complete Onboarding
```
User clicks "Get Started" on final screen
↓
Calls storeOnboardingFlag(true)
↓
Stores in SecureStore:
  key: "pneumodetect_has_seen_onboarding"
  value: true
↓
Navigate to main app: /(tabs)
```

---

## 🔐 Persistent State Management

### Tokens (Already Encrypted)
```typescript
// Stored in: SecureStore
storeAccessToken(token)      // iOS Keychain / Android Keystore
getAccessToken()             // Retrieved securely

storeUserData(userData)
getUserData()
```

### Onboarding Flag (NEW)
```typescript
// Stored in: SecureStore
storeOnboardingFlag(true)     // After onboarding complete
hasSeenOnboarding()           // Check on app launch

// Never shown again once set to true
// User can only see it again if they clear app data
```

---

## 💻 Code Examples

### Signup → OTP Flow
```typescript
// In app/(auth)/signup.tsx
const handleSignUp = async () => {
  setLoading(true);
  try {
    const registerData: RegisterRequest = {
      name: fullName,
      email,
      password,
      role,
      specialization: specialization || undefined,
      phone: phone || undefined,
    };

    await register(registerData);
    success("Account created successfully!");
    
    // Navigate to OTP with email
    router.push({
      pathname: "/(auth)/otp-verification",
      params: { email },
    });
  } catch (error) {
    showError(getErrorMessage(error));
  } finally {
    setLoading(false);
  }
};
```

### OTP Verification
```typescript
// In app/(auth)/otp-verification.tsx
const handleVerifyOTP = async () => {
  if (otp.length !== 6) {
    setError("Please enter a 6-digit OTP");
    return;
  }

  try {
    await verifyOTP({ email, otp });
    success("Email verified!");
    router.replace("/(onboarding)");
  } catch (err) {
    showError(getErrorMessage(err));
  }
};
```

### Onboarding Completion
```typescript
// In app/(onboarding)/index.tsx
const completeOnboarding = async () => {
  try {
    await storeOnboardingFlag(true);
    success("Welcome aboard!");
    router.replace("/(tabs)");
  } catch (error) {
    console.error("Failed to complete onboarding:", error);
  }
};
```

### Auth Check on App Launch
```typescript
// In app/index.tsx
const checkAuthStatus = async () => {
  if (authContext?.isLoading) return;

  if (authContext?.isSignedIn) {
    const seenOnboarding = await hasSeenOnboarding();
    if (!seenOnboarding) {
      router.replace("/(onboarding)");
    } else {
      router.replace("/(tabs)");
    }
  }
};
```

---

## 🎨 UI Screens

### 1. OTP Verification Screen
- Email icon at top
- Title: "Verify Email"
- Subtitle: Shows email address
- Large OTP input (6 digits, numeric only)
- Verify button (disabled until 6 digits)
- Resend button with 60-second timer
- Error messages below input

### 2. Onboarding Screens
#### Screen 1: Welcome
- Icon: Pulse (medical)
- Title: "Welcome to PneumoDetect"
- Description: How AI helps detect pneumonia
- Buttons: Skip, Next

#### Screen 2: How It Works
- Icon: List
- Title: "How It Works"
- Description: 3 simple steps (Upload → Analyze → Results)
- Buttons: Skip, Next

#### Screen 3: Privacy & Security
- Icon: Shield Checkmark
- Title: "Your Privacy Matters"
- Description: Encryption and compliance info
- Button: Get Started

Features:
- Animated dots indicator
- Smooth button transitions
- Clean spacing and typography
- Color-coded (Blue #0066CC theme)

---

## 🧪 Testing Checklist

- [ ] User can complete signup form
- [ ] After signup, OTP screen appears with correct email
- [ ] OTP input only accepts digits
- [ ] OTP input maxlength is 6
- [ ] Verify button disabled until 6 digits entered
- [ ] Resend button shows 60-second countdown
- [ ] Resend button re-enables after 60 seconds
- [ ] Successful OTP verify navigates to onboarding
- [ ] Onboarding screens load correctly
- [ ] Can scroll through 3 screens
- [ ] Skip button works on screens 1-2
- [ ] Get Started button on screen 3 completes onboarding
- [ ] After onboarding, user goes to main app
- [ ] Closing and reopening app goes directly to main app (not onboarding)
- [ ] Login also checks onboarding flag

---

## 🔗 Navigation Tree

```
app/
├── index.tsx (Welcome Screen - Auth Check)
├── _layout.tsx (Root Stack with all groups)
├── (auth)/
│   ├── _layout.tsx
│   ├── login.tsx
│   ├── signup.tsx
│   └── otp-verification.tsx ← NEW
├── (onboarding)/ ← NEW GROUP
│   ├── _layout.tsx ← NEW
│   └── index.tsx ← NEW (Carousel)
├── (tabs)/
│   ├── _layout.tsx
│   ├── index.tsx (Dashboard)
│   ├── scan.tsx
│   ├── history.tsx
│   └── profile.tsx
└── ...
```

---

## 📝 Backend Requirements

Your backend needs these endpoints:

### 1. POST `/auth/register`
```
Request: { email, password, name, role, specialization?, phone? }
Response: { id, email, name, accessToken, ... }
```

### 2. POST `/auth/verify-otp`
```
Request: { email, otp }
Response: { success: true } or error
Action: Must send OTP to user's email before this endpoint exists
```

### 3. POST `/auth/resend-otp`
```
Request: { email }
Response: { success: true }
Action: Send new OTP to email
```

### 4. POST `/auth/login`
```
Request: { email, password }
Response: { id, email, name, accessToken, ... }
```

---

## ⚙️ Configuration

### Onboarding Flag Storage
- **Location:** SecureStore (encrypted)
- **Key:** `pneumodetect_has_seen_onboarding`
- **Value:** `true` (boolean as JSON string)
- **Persistence:** Until app data cleared
- **Reset:** User must uninstall app or clear app data

### OTP Timeout
- **Resend button cooldown:** 60 seconds
- **OTP input:** 6 digits only
- **Auto-clear error:** On next keystroke

---

## 🐛 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Onboarding shows every time | `storeOnboardingFlag()` not called | Check "Get Started" handler calls it |
| OTP screen doesn't show email | Email not passed in route params | Verify signup sends `email` param |
| Can't resend OTP | Backend endpoint missing | Add POST `/auth/resend-otp` |
| Error: "Module not found" | Wrong import paths | Check `../` paths are correct |
| Skip button doesn't work | Navigation issue | Verify router.push() vs router.replace() |
| Onboarding UI broken | Missing styles | Check StyleSheet definitions |

---

## 📊 State Management

### Auth Context
```typescript
{
  user: User | null,
  isLoading: boolean,
  isSignedIn: boolean,
  login(),
  register(),
  logout(),
  verifyOTP(),      ← NEW
  resendOTP(),       ← NEW
  updateProfile(),
  refreshUser()
}
```

### OTP Screen State
```typescript
{
  otp: string,
  loading: boolean,
  resendLoading: boolean,
  resendTimer: number,
  error: string
}
```

### Onboarding Screen State
```typescript
{
  currentScreen: number,
  loading: boolean
}
```

---

## ✅ Implementation Status

- ✅ OTP verification screen complete
- ✅ Onboarding carousel complete
- ✅ Secure storage for onboarding flag
- ✅ Auth context methods added
- ✅ Navigation flow updated
- ✅ Route params passing (email to OTP)
- ✅ Timer logic for resend button
- ✅ Numeric input validation
- ✅ Error handling and toasts
- ✅ TypeScript types correct
- ✅ No build errors

---

## 🚀 Next Steps

1. Test signup → OTP → onboarding flow end-to-end
2. Verify backend endpoints (`/verify-otp`, `/resend-otp`)
3. Test with real OTP codes from backend
4. Verify onboarding flag persists after app restart
5. Monitor error handling in production

---

**Status: ✅ READY FOR TESTING**

All files created and integrated. Ready for end-to-end testing with backend!
