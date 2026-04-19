# Clear Session for Fresh Testing

## Option 1: Use the clearSession Function (Recommended)

Add this code to any screen to test clearing the session:

```typescript
import { useAuth } from "@/hooks/useAuth";

export default function DebugScreen() {
  const { clearSession } = useAuth();

  const handleClearAll = async () => {
    try {
      await clearSession();
      console.log("✅ Session cleared successfully");
      // Navigate to login screen
      // router.replace("/(auth)/login");
    } catch (error) {
      console.error("Failed to clear session:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="🗑️ Clear All Data" onPress={handleClearAll} />
    </View>
  );
}
```

## Option 2: Use the clearAllData Function Directly

```typescript
import { clearAllData } from "@/utils/secureStorage";

const handleClear = async () => {
  try {
    await clearAllData();
    console.log("✅ All data cleared: auth token, user data, onboarding flag");
  } catch (error) {
    console.error("Failed to clear data:", error);
  }
};
```

## What Gets Cleared

When you call `clearSession()` or `clearAllData()`, the following are deleted:

- ❌ **Auth Token** - Your session token
- ❌ **User Data** - Your user profile information
- ❌ **Onboarding Flag** - Will need to see onboarding again
- ✅ User state is set to null
- ✅ You'll be logged out automatically

## What Happens After Clearing

After clearing the session:

1. You'll be logged out
2. You'll be redirected to the login screen (automatic via app/index.tsx)
3. Onboarding flag will be reset (so you'll see onboarding when you signup)
4. You can start fresh with new credentials

## Via Terminal (If Using React Native CLI)

```bash
# Clear SecureStore on Android emulator
adb shell run-as com.example.pneumodetect rm -rf /data/data/com.example.pneumodetect/app_webview

# Clear SecureStore on iOS simulator
xcrun simctl keychain delete com.example.pneumodetect
```

## Testing Fresh Flow

After clearing:

1. **Signup flow:**

   ```
   Signup → OTP Screen → Onboarding → Main App
   ```

2. **Login flow:**

   ```
   Login → App (if verified)
   Login → OTP Screen (if unverified)
   ```

3. **Check what's stored:**

   ```typescript
   import {
     getAccessToken,
     getUserData,
     hasSeenOnboarding,
   } from "@/utils/secureStorage";

   // Check token
   const token = await getAccessToken();
   console.log("Token:", token); // Should be null after clearing

   // Check user data
   const user = await getUserData();
   console.log("User:", user); // Should be null after clearing

   // Check onboarding flag
   const seen = await hasSeenOnboarding();
   console.log("Seen onboarding:", seen); // Should be false after clearing
   ```

## Quick Testing Checklist

- [ ] Call `clearSession()` to clear all data
- [ ] Verify token is gone: `getAccessToken()` returns null
- [ ] Verify user data is gone: `getUserData()` returns null
- [ ] Verify onboarding flag is reset: `hasSeenOnboarding()` returns false
- [ ] App redirects to login screen
- [ ] Can signup with new credentials
- [ ] See OTP verification screen
- [ ] See onboarding carousel (fresh)
- [ ] Enter main app after onboarding
