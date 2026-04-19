# ⚡ OTP & Onboarding - Quick Reference

## 🚀 Complete Flow in 30 Seconds

1. **User Registers** → Signup screen
2. **Backend returns** `accessToken` ✓
3. **Navigate to OTP** → `/(auth)/otp-verification` (with email param)
4. **User enters 6 digits** → Verify button enables
5. **Click Verify** → Backend validates OTP
6. **Success** → Navigate to `/(onboarding)`
7. **Show 3 slides** → Welcome, How It Works, Privacy
8. **Click Get Started** → Store `hasSeenOnboarding = true`
9. **Navigate to** → `/(tabs)` (main app)
10. **Restart app** → Goes directly to main app (not onboarding)

---

## 📁 Files Created

| File | Purpose |
|------|---------|
| `app/(auth)/otp-verification.tsx` | 6-digit OTP input screen |
| `app/(onboarding)/_layout.tsx` | Onboarding navigation |
| `app/(onboarding)/index.tsx` | Onboarding carousel (3 screens) |

---

## 📝 Files Modified

| File | Changes |
|------|---------|
| `app/index.tsx` | Added auth status check & onboarding logic |
| `app/_layout.tsx` | Added `(onboarding)` group to Stack |
| `app/(auth)/signup.tsx` | Navigate to OTP instead of main app |
| `hooks/useAuth.tsx` | Added `verifyOTP()` and `resendOTP()` methods |
| `utils/secureStorage.ts` | Added onboarding flag storage functions |

---

## 🔑 Key Functions

### In `useAuth.tsx`
```typescript
verifyOTP({ email, otp }) // Call backend to verify OTP
resendOTP(email)          // Request new OTP
```

### In `secureStorage.ts`
```typescript
storeOnboardingFlag(true)  // Save onboarding completed
hasSeenOnboarding()        // Check if user saw onboarding
```

### In Signup Handler
```typescript
router.push({
  pathname: "/(auth)/otp-verification",
  params: { email },
});
```

### In Onboarding Handler
```typescript
await storeOnboardingFlag(true);
router.replace("/(tabs)");
```

---

## 🎯 Backend Endpoints Needed

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/verify-otp` | Verify 6-digit OTP |
| POST | `/auth/resend-otp` | Send new OTP email |

---

## 📊 OTP Screen Features

✅ 6-digit numeric input only  
✅ Large font size (32px)  
✅ Real-time validation  
✅ Verify button (disabled until 6 digits)  
✅ Resend button (60-second cooldown timer)  
✅ Error messages  
✅ Toast notifications  

---

## 🎨 Onboarding Screens

| # | Title | Icon | Description |
|---|-------|------|-------------|
| 1 | Welcome to PneumoDetect | Pulse | AI pneumonia detection intro |
| 2 | How It Works | List | Upload → Analyze → Results |
| 3 | Your Privacy Matters | Shield | Encryption & compliance info |

Features:
- Swipe/button navigation
- Animated dots
- Skip button (screens 1-2)
- Get Started button (screen 3)

---

## ✅ Testing Checklist

```
SIGNUP FLOW
- [ ] Can enter signup data
- [ ] Form validates correctly
- [ ] Submit calls backend
- [ ] Email passed to OTP screen

OTP FLOW
- [ ] OTP screen shows correct email
- [ ] Input only accepts 0-9
- [ ] Input max length is 6
- [ ] Verify button disabled until 6 digits
- [ ] Resend shows 60-second timer
- [ ] Can verify with correct code

ONBOARDING FLOW
- [ ] All 3 screens display
- [ ] Next button advances slides
- [ ] Skip button works
- [ ] Get Started completes onboarding
- [ ] navigates to main app

PERSISTENCE
- [ ] Close and reopen app
- [ ] Goes directly to tabs (not onboarding)
- [ ] Flag persists across sessions
```

---

## 🐛 Troubleshooting

| Problem | Check |
|---------|-------|
| Onboarding shows every time | `storeOnboardingFlag()` being called? |
| OTP screen is blank | Email param passed correctly? |
| Resend button stuck | Check timer logic and useEffect cleanup |
| Can't navigate to onboarding | Check route name in _layout |
| Backend 400 error | Verify endpoints exist (`/verify-otp`) |

---

## 🔗 Navigation Paths

```
/(auth)/signup
  ↓ (on success)
/(auth)/otp-verification?email=user@test.com
  ↓ (on verify success)
/(onboarding)
  ↓ (on get started)
/(tabs)
```

---

## 📦 Storage

### Tokens (Encrypted in SecureStore)
```
Key: pneumodetect_auth_token
Value: JWT token
```

### Onboarding Flag (Encrypted in SecureStore)
```
Key: pneumodetect_has_seen_onboarding
Value: true (boolean as JSON)
```

---

## 🎯 Status

✅ **COMPLETE** - All files created and integrated  
✅ **NO ERRORS** - TypeScript validation passed  
✅ **READY** - Waiting for backend endpoints

---

## 📞 Quick Commands

```bash
# Start dev server
npx expo start -c

# Test on iOS
npx expo start --ios

# Test on Android
npx expo start --android

# Build for production
eas build --platform ios --platform android
```

---

**Next:** Test with your backend! 🚀
