# Patient Screen Access Documentation

## Overview

Based on the app's implementation, **PATIENT users are routed to the `(patient)` layout**, which provides a customized patient-specific interface. This is different from CLINICIAN and ADMIN users who access the `(tabs)` layout.

## Routing Logic

**Location**: `app/index.tsx` (Welcome Screen)

```typescript
// Route based on user role
if (authContext.user?.role === "PATIENT") {
  router.replace("/(patient)"); // ← Patient-specific layout
} else {
  router.replace("/(tabs)"); // ← Clinician/Admin layout
}
```

This routing happens after:

1. User is authenticated (has valid JWT token)
2. Onboarding is completed (`user.onboardingCompleted === true`)

## Patient Accessible Screens

### Primary Navigation (Bottom Tab Bar)

The patient layout (`app/(patient)/_layout.tsx`) is a Tab-based navigator with 3 main screens:

#### 1. **Dashboard** (`(patient)/index.tsx`)

- **Purpose**: Patient's main dashboard showing health overview
- **Features**:
  - Personal greeting with user name
  - Statistics cards:
    - Total Scans
    - Normal Scans
    - Pneumonia/Concerns Scans
  - Recent scans list (5 most recent)
  - Notification badge (unread count)
  - Quick navigation to notifications
- **Data Displayed**:
  - User's own scan history
  - Personal health statistics
  - Unread notification count

#### 2. **My Scans** (`(patient)/my-scans.tsx`)

- **Purpose**: View complete scan history and details
- **Features**:
  - Paginated list of all user's scans
  - Filter and sort options
  - Scan status indicators (completed, processing, etc.)
  - Result badges (NORMAL, PNEUMONIA, CONCERNS)
  - Quick access to individual scan details

#### 3. **Profile** (`(patient)/profile.tsx`)

- **Purpose**: Patient profile settings and personal information
- **Features**:
  - View/edit personal information:
    - Name
    - Email
    - Date of Birth (from signup)
    - Gender (from signup)
  - Profile settings
  - Account management

### Hidden/Modal Screens (Not in Tab Bar)

These screens are accessible via navigation but don't appear in the tab bar:

#### 4. **Scan Details** (`(patient)/scan-details.tsx`)

- **Access**: Clicked from Dashboard or My Scans list
- **Purpose**: View detailed results of a single scan
- **Features**:
  - Full scan image
  - AI prediction result (NORMAL/PNEUMONIA)
  - Confidence percentage
  - Analysis details
  - Timestamp information
  - Doctor's notes/recommendations (if available)

#### 5. **Notifications** (`(patient)/notifications.tsx`)

- **Access**: Notification badge on Dashboard
- **Purpose**: View all notifications and alerts
- **Features**:
  - Scan result notifications
  - System alerts
  - Mark as read/unread
  - Delete notifications

## Patient Cannot Access

### Clinician/Admin Features

- ❌ `(tabs)/` layout (reserved for clinicians)
- ❌ `(tabs)/scan` - Advanced scan upload/camera interface
- ❌ `(tabs)/history` - Clinician's history view
- ❌ `/analysis` routes - Scan analysis and upload
- ❌ `(admin)/` routes - Admin-only features

### Admin-Only Features

- ❌ All user management screens
- ❌ System analytics and reports
- ❌ Scan audit trails
- ❌ AI model management

## Authentication & Authorization

**Authentication Flow for Patients**:

```
1. Registration (PATIENT role) + DOB + Gender
   ↓
2. OTP Verification
   ↓
3. Onboarding (3 steps)
   ↓
4. Check: user.onboardingCompleted === true
   ↓
5. Route to (patient) layout
   ↓
6. Access patient-specific screens only
```

**Key Points**:

- Patients cannot manually navigate to `(tabs)` routes
- Patients cannot access `/analysis` routes (clinician upload)
- All data is filtered by user ID (server-side)
- Patients see only their own scans and notifications

## Data Isolation

All patient data is isolated at the backend API level:

| Endpoint                 | Patient Access | Data Returned                  |
| ------------------------ | -------------- | ------------------------------ |
| `GET /scans/my-scans`    | ✅             | User's scans only              |
| `GET /scans/{scanId}`    | ✅             | Only if scan belongs to user   |
| `GET /scans` (all scans) | ❌             | 403 Forbidden                  |
| `GET /notifications`     | ✅             | User's notifications only      |
| `GET /patients`          | ❌             | 403 Forbidden (admin only)     |
| `POST /scans`            | ❌             | 403 Forbidden (clinician only) |

## Implementation Details

### Patient Layout Structure

```
(patient)/ (Tab Navigator)
├── index.tsx (Dashboard)
├── my-scans.tsx (History)
├── profile.tsx (Settings)
├── scan-details.tsx (Modal - not in tabs)
├── notifications.tsx (Modal - not in tabs)
└── _layout.tsx (Route config)
```

### Screen Navigation

```
Dashboard
├── → Notifications (button)
├── → Scan Details (list item click)
└── → My Scans (tab)

My Scans
└── → Scan Details (list item click)

Profile
└── → Account Settings

Scan Details
├── ← Back to Dashboard
└── ← Back to My Scans (if navigated from there)

Notifications
├── → Scan Details
└── ← Back to Dashboard
```

## UI Customization for Patients

**vs Clinician Tab Layout**:

- Patients use simplified `(patient)` tab navigator with 3 core tabs
- Clinicians use full-featured `(tabs)` navigator with:
  - Dashboard (analytics)
  - New Scan (upload interface)
  - History (scans they uploaded)
  - Profile
  - Admin tools (if admin)

## API Rate Limiting & Quotas

Patients have the following usage limits (if implemented):

- Scan uploads per day: Defined by subscription tier
- Storage quota: Defined by subscription tier
- Notification retention: 30 days

## Summary Table

| Feature                 | Patient | Clinician     | Admin |
| ----------------------- | ------- | ------------- | ----- |
| View own scans          | ✅      | ✅            | ✅    |
| View all scans          | ❌      | ✅ (filtered) | ✅    |
| Upload scans            | ❌      | ✅            | ✅    |
| Manage patients         | ❌      | ✅            | ✅    |
| System admin            | ❌      | ❌            | ✅    |
| View analytics          | ❌      | ✅            | ✅    |
| Access (patient) layout | ✅      | ❌            | ❌    |
| Access (tabs) layout    | ❌      | ✅            | ✅    |
| Access (admin) routes   | ❌      | ❌            | ✅    |

---

**Last Updated**: 2024 (After auth flow implementation)
**Status**: All patient screens implemented and functional ✅
