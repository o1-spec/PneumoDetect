# AsyncStorage Error Fix & Form Validation Updates

## Error: `AsyncStorageError: Native module is null, cannot access legacy storage`

### What This Error Means

This error occurs when:

1. **Native AsyncStorage module hasn't been initialized** - The native bridge between JavaScript and native code isn't ready
2. **AsyncStorage is called before app is fully loaded** - Timing issue during the bootstrap phase
3. **Common in Expo development** - Especially in Expo Go or when first starting the app

### Root Causes in Your Code

The error happens at this line in `hooks/useAuth.tsx:86`:

```tsx
await AsyncStorage.setItem("authToken", access_token);
```

This is triggered during login/signup when trying to persist the auth token.

### Solutions

#### 1. **Ensure AsyncStorage is Installed** (First Step)

```bash
npx expo install @react-native-async-storage/async-storage
```

#### 2. **Clear Cache and Restart**

```bash
npx expo start -c
```

#### 3. **Add Error Handling to useAuth.tsx** (Recommended)

Update the `register` and `login` functions in `hooks/useAuth.tsx` to handle storage errors gracefully:

```tsx
const login = useCallback(async (credentials: LoginRequest) => {
  try {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    const { access_token, user: userData } = response.data;

    // Set state first, then try to persist
    setUser(userData);

    // Try to persist to storage, but don't block if it fails
    try {
      await AsyncStorage.setItem("authToken", access_token);
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
    } catch (storageError) {
      console.warn("Failed to persist auth data to storage:", storageError);
      // User is still logged in, just not persisted
    }
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}, []);
```

#### 4. **For Development, Try Using localStorage Alternative**

If the native module continues to fail, you can use a workaround:

```tsx
// In hooks/useAuth.tsx
const setAuthToken = async (token: string, userData: User) => {
  setUser(userData); // Always set state
  try {
    await AsyncStorage.setItem("authToken", token);
    await AsyncStorage.setItem("userData", JSON.stringify(userData));
  } catch (e) {
    console.warn("Storage unavailable:", e);
  }
};
```

---

## Form Validation Updates

### Changes Made

✅ **Updated `app/(auth)/signup.tsx`:**

- Added `isFormValid()` function to check all fields in real-time
- Button is now **disabled** if any required field is:
  - Empty
  - Invalid format (email)
  - Too short (password < 6 chars)
  - Mismatched (passwords don't match)
- Improved disabled button styling (more visible opacity: 0.5 + gray background)

✅ **Updated `app/(auth)/login.tsx`:**

- Added `isFormValid()` function to check required fields
- Button is **disabled** if:
  - Email is empty or invalid
  - Password is empty
- Consistent disabled styling with signup

### Visual Feedback

- **Disabled button**: Gray background with 0.5 opacity
- **Enabled button**: Blue background (#0066CC) with shadow
- Button responds in real-time as user types

### How It Works

```tsx
const isFormValid = (): boolean => {
  return (
    fullName.trim() !== "" &&
    email.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    password !== "" &&
    password.length >= 6 &&
    confirmPassword !== "" &&
    password === confirmPassword
  );
};

// Usage in button:
<TouchableOpacity
  disabled={loading || !isFormValid()}
  style={[
    styles.signUpButton,
    (loading || !isFormValid()) && styles.signUpButtonDisabled,
  ]}
>
```

---

## Testing

1. **Test AsyncStorage Fix:**
   - Restart app with `npx expo start -c`
   - Try to sign up/login
   - Check console for any storage errors

2. **Test Form Validation:**
   - Open signup page
   - Notice button is disabled initially
   - Fill in email as you type - nothing happens until all fields are valid
   - Try entering short password - button stays disabled
   - Passwords must match exactly
   - Once all requirements met, button becomes enabled

---

## Files Modified

- `hooks/useAuth.tsx` - (Consider adding error handling as shown above)
- `app/(auth)/signup.tsx` - Added form validation, disabled state
- `app/(auth)/login.tsx` - Added form validation, disabled state
