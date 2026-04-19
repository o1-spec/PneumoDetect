# Toast Notifications Implementation Guide

## Overview

Toast notifications have been implemented throughout the PneumoDetect application. They provide non-blocking, dismissible feedback for user actions like login, registration, data submission, errors, and warnings.

## What's Been Implemented

### 1. **Core System**

- **`utils/toastManager.ts`** - Global toast manager using event subscription
- **`hooks/useToast.ts`** - React hook for easy access to toast methods
- **`components/ToastContainer.tsx`** - Toast display component with animations

### 2. **Features**

✅ 4 toast types: `success`, `error`, `warning`, `info`  
✅ Smooth slide-in/fade animations  
✅ Auto-dismiss after configurable duration  
✅ Tap to dismiss functionality  
✅ Multiple toasts can appear simultaneously  
✅ Stacked notification display  
✅ Beautiful icons for each type

### 3. **Updated Screens with Toast**

- ✅ Login screen - success/error notifications
- ✅ Signup screen - success/error notifications
- ✅ Profile screen - update success, logout notification
- ✅ Patient creation - success/error notifications
- ✅ Image upload - permission warnings, selection confirmation

## How to Use Toast Notifications

### Basic Usage

```tsx
import { useToast } from "../../hooks/useToast";

export default function MyScreen() {
  const { success, error, warning, info } = useToast();

  const handleAction = () => {
    try {
      // Do something...
      success("Action completed successfully!");
    } catch (err) {
      error("Something went wrong!");
    }
  };

  return (
    // Your component JSX
  );
}
```

### Toast Methods

```tsx
const toast = useToast();

// Show success toast
toast.success("Operation successful!");

// Show error toast
toast.error("An error occurred!");

// Show warning toast
toast.warning("Please be careful");

// Show info toast
toast.info("Here's some information");

// Show custom toast with type and duration (ms)
toast.showToast("Custom message", "success", 5000);
```

### Default Durations

- `success`: 3000ms
- `error`: 4000ms (longer to ensure users read it)
- `warning`: 3500ms
- `info`: 3000ms

### Custom Duration

```tsx
// Show toast for 5 seconds
toast.success("This will stay longer", 5000);

// Show error for 6 seconds
toast.error("Important error", 6000);
```

## Toast Types & Styling

### Success (Green - #10B981)

```tsx
toast.success("Profile updated successfully!");
```

- Icon: `checkmark-circle`
- Use for: successful operations, saved data, completed actions

### Error (Red - #EF4444)

```tsx
toast.error("Failed to upload image");
```

- Icon: `alert-circle`
- Use for: failures, validation errors, API errors

### Warning (Amber - #F59E0B)

```tsx
toast.warning("Permission required");
```

- Icon: `warning`
- Use for: permission requests, cautions, important notices

### Info (Blue - #3B82F6)

```tsx
toast.info("Image selected");
```

- Icon: `information-circle`
- Use for: general information, confirmations, status updates

## Common Use Cases

### 1. Login/Signup

```tsx
const handleLogin = async () => {
  try {
    await login({ email, password });
    success("Login successful!");
    router.replace("/(tabs)");
  } catch (error) {
    error(getErrorMessage(error));
  }
};
```

### 2. Form Submission

```tsx
const handleSaveProfile = async () => {
  try {
    await updateProfile(formData);
    success("Profile updated successfully!");
  } catch (err) {
    error(getErrorMessage(err));
  }
};
```

### 3. Image Upload

```tsx
const handleImagePick = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({...});
  if (!result.canceled) {
    info("Image selected successfully");
    setSelectedImage(result.assets[0].uri);
  }
};
```

### 4. Permission Requests

```tsx
const requestPermissions = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    warning("Permission required to access photos");
    return false;
  }
  return true;
};
```

### 5. Data Operations

```tsx
const handleDelete = async () => {
  try {
    await api.delete(`/patient/${id}`);
    success("Patient deleted");
    router.back();
  } catch (err) {
    error("Failed to delete patient");
  }
};
```

## Where to Add More Toasts

### High Priority (Should Already Have Toasts)

- [ ] Analysis/Processing screen - upload progress, processing status
- [ ] Results screen - results loaded, export success
- [ ] Admin screens - user creation, permissions updates
- [ ] Notifications screen - mark as read, delete actions
- [ ] Patient detail screen - data load, update actions

### Implementation Template

When adding toast to any screen:

```tsx
import { useToast } from "../../hooks/useToast";

export default function YourScreen() {
  const { success, error, warning, info } = useToast();

  const handleSomething = async () => {
    try {
      // Your async operation
      success("Success message");
    } catch (err) {
      error(getErrorMessage(err));
    }
  };

  return (
    // Your JSX
  );
}
```

## Architecture Notes

### Why Not AlertDialog?

- Toast is non-blocking (user can continue interacting)
- Alert stops user interaction
- Toast is less intrusive
- Multiple toasts can stack
- Toasts auto-dismiss

### Global Toast Manager

The `toastManager` uses React's event subscription pattern:

- No Redux/Context needed
- Works from any component
- Independent of React tree structure
- Can be called from utilities, services, etc.

### Performance

- Minimal re-renders (only affected component)
- Efficient animations using `Animated.Value`
- Automatic cleanup on unmount
- Memory-efficient stacking

## Testing Toast Notifications

Test different scenarios:

```tsx
// Navigate to signup and register a new account → should show success
// Try login with wrong password → should show error
// Try uploading without image selected → should show error
// Change profile settings → should show success
// Pick an image from gallery → should show info
// Deny camera permission → should show warning
```

## Future Enhancements

Possible improvements:

- [ ] Toast sound effects (optional)
- [ ] Toast action buttons (e.g., "Undo")
- [ ] Toast position customization (top/bottom)
- [ ] Custom toast templates
- [ ] Toast queue management
- [ ] Analytics tracking of toasts
- [ ] Dark mode styling

## Troubleshooting

### Toasts not appearing?

1. Ensure `ToastContainer` is rendered in `app/_layout.tsx` ✓
2. Check that you're using the `useToast` hook
3. Verify the component is inside the layout tree

### Multiple toasts overlapping?

- This is expected behavior
- They auto-dismiss after duration
- User can manually dismiss by tapping

### Toast disappearing too fast?

- Adjust duration: `success("msg", 5000)` for 5 seconds
- Or modify default durations in `toastManager.ts`

## Migration Checklist

Screens that still use Alert.alert() that should be migrated:

- [ ] app/analysis/processing.tsx
- [ ] app/analysis/results/[scanId].tsx
- [ ] app/(tabs)/(admin)/users.tsx
- [ ] app/(tabs)/(admin)/all-scans.tsx
- [ ] app/notifications/index.tsx
- [ ] app/patients/[patientId].tsx
- [ ] app/profile/\*.tsx (subpages)
- [ ] Any other screens with Alert.alert()

## Summary

Toast notifications are now the primary way to inform users about actions. They provide better UX than modal alerts while keeping the app responsive and clean.
