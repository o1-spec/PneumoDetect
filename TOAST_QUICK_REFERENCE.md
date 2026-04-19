# Toast Notifications - Quick Reference

## 🚀 Quick Start (Copy & Paste)

```tsx
import { useToast } from "../../hooks/useToast";

export default function MyScreen() {
  const { success, error, warning, info } = useToast();

  return <Button onPress={() => success("Done!")}>Test Toast</Button>;
}
```

## 📍 All Toast Methods

```tsx
// Success - Green toast (3 seconds)
success("Profile updated!");
success("Operation completed!", 5000); // Custom duration

// Error - Red toast (4 seconds)
error("Something went wrong!");
error("Failed to save", 3000); // Custom duration

// Warning - Amber toast (3.5 seconds)
warning("Please be careful");
warning("Permission required", 4000);

// Info - Blue toast (3 seconds)
info("Here's information");
info("Processing...", 5000);

// Custom (all params)
showToast("Message", "success", 5000);
```

## 🔍 Common Patterns

### 1. Form Submission

```tsx
const handleSubmit = async () => {
  try {
    await saveData();
    success("Saved successfully!");
  } catch (err) {
    error(getErrorMessage(err));
  }
};
```

### 2. Data Loading

```tsx
useEffect(() => {
  (async () => {
    try {
      const data = await fetchData();
      setData(data);
      info("Data loaded");
    } catch (err) {
      error("Failed to load data");
    }
  })();
}, []);
```

### 3. User Actions

```tsx
const handleDelete = () => {
  deleteItem();
  success("Deleted!");
};

const handleShare = () => {
  shareItem();
  info("Shared successfully");
};
```

### 4. Validation

```tsx
if (!email.includes("@")) {
  warning("Invalid email");
  return;
}
```

## 🎨 Toast Appearance

### Colors & Icons

- **Success**: Green checkmark ✓
- **Error**: Red alert ⚠
- **Warning**: Amber warning ⚠
- **Info**: Blue information ℹ

### Display

- Position: Top of screen
- Auto-dismiss: Yes (configurable)
- Can stack: Multiple toasts
- Dismissible by: Tapping or waiting

## ⏱️ Default Durations

- Success: 3000ms
- Error: 4000ms
- Warning: 3500ms
- Info: 3000ms

## 🆚 Toast vs Alert

| Feature            | Toast  | Alert              |
| ------------------ | ------ | ------------------ |
| Blocks interaction | ❌ No  | ✅ Yes             |
| Multiple shows     | ✅ Yes | ❌ No (sequential) |
| Auto-dismiss       | ✅ Yes | ❌ No              |
| Less intrusive     | ✅ Yes | ❌ No              |
| Good for UX        | ✅ Yes | ⚠️ Use sparingly   |

## ❌ Imports to Remove

When migrating from Alert:

```tsx
// Remove this:
import { Alert } from "react-native";

// Remove these lines:
Alert.alert("Title", "Message");

// Replace with:
const { success, error } = useToast();
success("Message");
```

## 📍 Where Toast Container Lives

```tsx
// app/_layout.tsx
<AuthProvider>
  <Stack>...</Stack>
  <ToastContainer /> {/* ← Right here */}
</AuthProvider>
```

## 🎯 When to Use Each Type

```tsx
// ✅ Success - Operation completed
success("Profile saved!");
success("Patient created!");
success("File uploaded!");

// ❌ Error - Something failed
error("Failed to save");
error("Network error");
error("Invalid credentials");

// ⚠️ Warning - Be careful
warning("Permission required");
warning("Changes not saved");
warning("High-risk operation");

// ℹ️ Info - FYI
info("Processing...");
info("Loading data");
info("Starting analysis");
```

## 🔧 Customization

### Change duration

```tsx
success("Custom message", 5000); // 5 seconds
```

### Change appearance

Edit `components/ToastContainer.tsx`:

- Colors in `getBackgroundColor()`
- Icons in `getIcon()`
- Styling in `styles` object

## ✅ Files Created/Modified

**New:**

- `utils/toastManager.ts`
- `hooks/useToast.ts`
- `components/ToastContainer.tsx`

**Modified:**

- `app/_layout.tsx` - Added ToastContainer
- `app/(auth)/login.tsx` - Added toast
- `app/(auth)/signup.tsx` - Added toast
- `app/(tabs)/profile.tsx` - Added toast
- `app/patients/create.tsx` - Added toast
- `app/analysis/upload.tsx` - Added toast
- `app/analysis/processing.tsx` - Added toast
- `app/analysis/results/[scanId].tsx` - Added toast
- `app/(tabs)/(admin)/users.tsx` - Added toast

## 🐛 Troubleshooting

**Toasts not showing?**
→ Check ToastContainer is in app/\_layout.tsx

**Toast disappears too fast?**
→ Set custom duration: `success("msg", 5000)`

**Too many toasts?**
→ Normal! They auto-dismiss and stack

**Wrong import path?**
→ Use: `../../hooks/useToast` (adjust based on depth)

## 📚 Documentation Files

- `TOAST_NOTIFICATIONS.md` - Full guide
- `TOAST_IMPLEMENTATION_SUMMARY.md` - Summary
- This file - Quick reference

---

**That's it!** You're ready to use toast notifications everywhere in your app. 🎉
