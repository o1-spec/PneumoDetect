# 📱 PneumoDetect Mobile App Implementation Guide

Welcome to the technical implementation documentation for the **PneumoDetect** mobile application. This guide outlines the system architecture, navigation hierarchy, authentication mechanics, state management, visual styling guidelines, and API client design.

---

## 🛠️ Technology Stack & Dependencies

The PneumoDetect mobile app is built as a cross-platform application using:
- **Core Framework**: React Native (v0.81.5) & React (v19.1.0)
- **Development Engine**: Expo SDK (v54.0.34)
- **File-based Routing**: Expo Router (v6.0.23) + React Navigation (v7)
- **Networking**: Axios (v1.15.0) with custom interceptors for JWT token injection and 401 session expirations
- **Data Persistence**: `expo-secure-store` for encrypted token storage
- **UI & Animations**: `react-native-reanimated` (v4.1.1) for premium screen transitions and micro-animations, and `expo-linear-gradient` for glassmorphism gradients
- **Visualizations**: `react-native-chart-kit` for workspace analytics and activity charts
- **Core Libraries**: `expo-image-picker` for radiography uploads, and `expo-print` + `expo-sharing` for generating and exporting PDF reports

---

## 📂 Project Directory Structure

```
PneumoDetect/
├── app/                      # Expo Router File-Based Routing Root
│   ├── (auth)/               # User credentials and verification screens
│   │   ├── login.tsx         # Sign-in portal
│   │   ├── signup.tsx        # Registration with DOB & gender fields
│   │   ├── otp-verification.tsx # 2FA/Email verification via OTP
│   │   └── forgot-password.tsx  # Password reset flow
│   ├── (onboarding)/         # Initial app features showcase slides
│   ├── (patient)/            # Patient Portal layout & screens (isolated)
│   │   ├── index.tsx         # Health Updates (Patient Dashboard)
│   │   ├── my-scans.tsx      # Patient Scan History
│   │   ├── scan-details.tsx  # Patient-safe Scan Result Detail view
│   │   ├── profile.tsx       # Personal information & Account configuration
│   │   └── notifications.tsx # Patient notifications center
│   ├── (tabs)/               # Clinician & Admin Workspace (bottom tab layout)
│   │   ├── index.tsx         # Workspace Home (Dashboard & Status cards)
│   │   ├── scan.tsx          # Upload/Capture chest radiographs
│   │   ├── history.tsx       # Complete patient database history logs
│   │   ├── profile.tsx       # Profile tabs (Documentation, help desk links)
│   │   └── (admin)/          # Nested Administrator control routes
│   │       ├── users.tsx     # Active system user database control
│   │       ├── all-scans.tsx # Audit logging of every upload case
│   │       └── analytics.tsx # System metrics, activity charts & model stats
│   ├── analysis/             # Scan diagnostic execution flow
│   │   ├── upload.tsx        # Image validation and confirmation
│   │   ├── patient-info.tsx  # Target patient association form
│   │   ├── processing.tsx   # AI inference simulation loading panel
│   │   └── results/          # AI result report details (Grad-CAM heatmaps)
│   │       ├── [scanId].tsx  # In-depth clinical heatmap screen
│   │       └── explainable.tsx # Interpretability documentation
│   ├── profile/              # Common settings and utility views
│   │   ├── privacy-security.tsx # 2FA control, profile deletion, password changes
│   │   ├── documentation.tsx # Embedded medical diagnostic resources
│   │   ├── help-center.tsx   # Tutorials & FAQs
│   │   └── contact.tsx       # Support submission page
│   ├── _layout.tsx           # Global Root Navigation & Guard/Role router
│   └── index.tsx             # Main Welcome Screen / Entrypoint
├── components/               # Reusable UI component repository
│   ├── auth/                 # Credentials headers, fields, and buttons
│   ├── dashboard/            # Clinician analytics widgets & recent cases
│   ├── premium/              # Premium custom loaders, chips, stats cards
│   ├── PatientNotesModal.tsx # Clinician-facing scan notes updates
│   ├── DialogContainer.tsx   # Global dialog notification interface
│   └── ToastContainer.tsx    # Context-driven toast feedback overlay
├── constants/
│   └── Theme.ts              # Global Visual Tokens (Gradients, Colors, Spacing)
├── hooks/
│   ├── useAuth.tsx           # Session context provider and authentication hooks
│   └── useToast.ts           # Intercept and fire custom overlay alerts
├── services/
│   ├── api.ts                # Axios instance configuration & Interceptors
│   └── api.client.ts         # Server endpoint interfaces and payloads
└── utils/
    ├── secureStorage.ts      # Device encryption read/write wrappers
    ├── reportGenerator.ts    # Print layout markup generation for clinical PDFs
    └── errorHandler.ts       # Unified API error translation modules
```

---

## 🎨 Theme & Visual Design Tokens

The app follows a modern design system located in [Theme.ts](file:///Users/macbook/PneumoDetect/constants/Theme.ts) designed around a **Slate, White, and Medical Blue/Teal** visual hierarchy:

```typescript
export const COLORS = {
  primary: "#2563EB",         // Primary Medical Blue
  primaryLight: "#EEF2F6",    // Slate Tint
  secondary: "#0EA5A4",       // Clinical Teal
  secondaryLight: "#E6F4F4",  // Soft Teal
  success: "#16A34A",         // Medical Green (Normal screens)
  danger: "#EF4444",          // Rose Alert (Pneumonia detection)
  warning: "#F59E0B",         // Amber Warning (Unverified status)
  background: "#F8FAFC",      // Neutral slate background (Slate 50)
  card: "#FFFFFF",            // Containers
  border: "#E2E8F0",          // Borders (Slate 200)
  textPrimary: "#0F172A",     // Primary text (Slate 900)
  textSecondary: "#475569",   // Secondary descriptions (Slate 600)
};
```

---

## 🔐 Authentication, Authorization, and Session Guarding

### State Initialization & Token Storage
1. On start, the root layout runs `bootstrapAsync()` to verify if a valid JWT token is stored inside the device's keychain using `secureStorage` (`expo-secure-store`).
2. If a token exists, the app calls `usersAPI.getMe()` to fetch the user profile from the server, updating `AuthContext` with credentials and the user role (`PATIENT` vs `CLINICIAN` vs `ADMIN`).
3. If token fetch fails or is expired, it clears local credentials and defaults the user to `isSignedIn = false`.

### Active Router Guards (`app/_layout.tsx`)
The app automatically performs navigation redirects by observing `segments` and role states in a `useEffect` loop:

```typescript
const inAuthGroup = segments[0] === "(auth)";
const inPatientGroup = segments[0] === "(patient)";
const inTabsGroup = segments[0] === "(tabs)";
const inOnboardingGroup = segments[0] === "(onboarding)";

// Clinicians-only groups
const inPatientsGroup = segments[0] === "patients";
const inAnalysisGroup = segments[0] === "analysis";
const inProfileGroup = segments[0] === "profile";
const inNotificationsGroup = segments[0] === "notifications";
const inReportGroup = segments[0] === "report";

const inProtectedGroup = inPatientGroup || inTabsGroup || inOnboardingGroup || inPatientsGroup || inAnalysisGroup || inProfileGroup || inNotificationsGroup || inReportGroup;
```

#### Verification Flow:
- **Unauthenticated Users**: If trying to access any protected group, they are forced back to `/(auth)/login`.
- **New Registrations**: Redirected directly to the `/(onboarding)` wizard slide screen. No other dashboard is accessible until onboarding is marked complete (`user.onboardingCompleted === true`).
- **Authenticated Patients**: Forced into the `/(patient)` navigation layout. Any attempt to browse clinician routes (`(tabs)`, `/analysis`, `/patients`, `/report`) triggers an instant redirect back to the patient portal dashboard.
- **Authenticated Clinicians/Admins**: Directed to the standard workspace `/(tabs)` hub.

---

## 📱 Workspace & Portal Design (Layouts)

```mermaid
graph TD
    Welcome[index.tsx Welcome Screen] -->|Sign In| Login[/(auth)/login]
    Welcome -->|Get Started| Signup[/(auth)/signup]
    Signup -->|Requires 2FA| OTP[/(auth)/otp-verification]
    Login --> AuthCheck{Check Role & Onboarding}
    OTP --> AuthCheck
    
    AuthCheck -->|Onboarding Incomplete| Onboarding[/(onboarding)]
    Onboarding -->|Set Complete| AuthCheck
    
    AuthCheck -->|Role: PATIENT| PatientPortal[/(patient) Layout]
    AuthCheck -->|Role: CLINICIAN / ADMIN| ClinicianWorkspace[/(tabs) Layout]
    
    PatientPortal --> P1[Health Updates Dashboard]
    PatientPortal --> P2[My Scans History]
    PatientPortal --> P3[Settings / Profile]
    
    ClinicianWorkspace --> C1[Workspace Dashboard]
    ClinicianWorkspace --> C2[Analyze Radiographs]
    ClinicianWorkspace --> C3[Case History Log]
    ClinicianWorkspace --> C4[Clinician Profile]
    
    C1 -->|If Role: ADMIN| AdminSuite[/(admin) Stack]
    AdminSuite --> A1[Users Management]
    AdminSuite --> A2[All Upload Scans]
    AdminSuite --> A3[System Analytics]
```

### 1. The Clinician Workspace (`app/(tabs)`)
Designed with tab bars focused on swift upload and clinical review:
- **Workspace Dashboard (`index.tsx`)**: Displays daily scans, alerts, clinician system status updates, and a welcome banner.
- **Radiograph Processing (`scan.tsx` & `/analysis`)**: Launches the image selection workflow. Leads clinicians through patient selection, image capture, simulated queue load, and outputs predictions with a high-fidelity Grad-CAM overlay of affected areas.
- **Case Logs (`history.tsx`)**: Database view allowing clinical search and pagination of cases.
- **Nested Admin Suite (`(tabs)/(admin)`)**:
  - `users.tsx`: Display user list, toggle active status, and edit user profile information.
  - `all-scans.tsx`: Master list of system-wide chest X-rays.
  - `analytics.tsx`: Display graphical dashboard with metrics fetched via `GET /analytics/dashboard`.

### 2. The Patient Portal (`app/(patient)`)
Focuses on simple visual presentation, reassurance, and clear notifications:
- **Health Updates Dashboard (`index.tsx`)**: Greets the patient, provides quick access to recent scan results, displays diagnostic counts (Normal vs Concern scans), and shows notifications.
- **My Scans History (`my-scans.tsx`)**: Displays scans mapped specifically to the patient. Technical tags like raw cloud bucket names or complex diagnostic paths are hidden.
- **Patient-Safe Details (`scan-details.tsx`)**: Shows the radiograph, simple status indicators, and clinician notes without high-complexity technical parameters.
- **Settings (`profile.tsx`)**: Allows patients to manage their DOB, gender, blood type, and emergency contact details.

---

## 📐 Safe-Area & Notched Device Adaptation

To prevent headers and tab buttons from being clipped by physical device notches or Android navigation gesture bars, both layouts dynamically retrieve device dimensions using `useSafeAreaInsets` from `react-native-safe-area-context`.

Heights and bottom paddings are calculated dynamically:

```typescript
const insets = useSafeAreaInsets();

const tabHeight = Platform.OS === "ios"
  ? (insets.bottom > 0 ? 88 : 64)
  : (insets.bottom > 0 ? 76 : 64);
  
const tabPaddingBottom = Platform.OS === "ios"
  ? (insets.bottom > 0 ? insets.bottom + 4 : 8)
  : (insets.bottom > 0 ? insets.bottom + 6 : 8);
```

This ensures tab labels have breathing room, and clickable buttons sit above physical screen margins.

---

## 🔄 API Interceptor & Client Endpoints

The network layout uses **Axios** configuration in [services/api.ts](file:///Users/macbook/PneumoDetect/services/api.ts).

### Interceptor Strategy
- **Request Interceptor**: Retrieves the token asynchronously from secure storage and automatically appends it as a `Bearer` token to the `Authorization` header of all outbound requests.
- **Response Interceptor**: Automatically monitors response codes. If a server response returns a `401 Unauthorized` (indicating session expiration or key revocation), it triggers a local session sweep, logs the action, and fires `global.authLogoutEvent()` to redirect the user instantly back to the login screen.

### Endpoint Mapping (`services/api.client.ts`)
The client isolates functions into modules corresponding directly to backend NestJS routes:

| Module | Purpose | Endpoints Used |
| :--- | :--- | :--- |
| `usersAPI` | User credentials & info | `GET /users/me`, `PUT /users/profile`, `GET /users/patient-profile`, `PUT /users/patient-profile` |
| `patientsAPI` | Patient registry management | `GET /patients`, `POST /patients`, `PATCH /patients/:id` *(aligned to spec)*, `DELETE /patients/:id`, `PATCH /patients/:id/link-user` |
| `scansAPI` | Image uploads and AI analysis | `GET /scans`, `POST /scans/upload`, `POST /scans/:id/process`, `PATCH /scans/:id` *(notes update)*, `GET /scans/patient/my-scans/list`, `GET /scans/patient/:id/view` |
| `analyticsAPI` | System statistics and activity logging | `GET /analytics/stats`, `GET /analytics/dashboard`, `GET /analytics/scans/results`, `GET /analytics/model-performance`, `GET /analytics/activity-timeline` |
| `notificationsAPI` | System alerts management | `GET /notifications`, `PATCH /notifications/:id`, `POST /notifications/mark-all-read`, `DELETE /notifications/:id` |
| `adminAPI` | System user database control | `GET /admin/users`, `GET /admin/users/:id`, `PATCH /admin/users/:id/status`, `DELETE /admin/users/:id` |
| `activityAPI` | Traceability and audit reports | `GET /users/activity` *(audit logs)*, `GET /users/activity/login` *(login history)* |

---

## ⚙️ Development Commands Reference

Run these commands in the app directory:

```bash
# Start the local development bundler
npx expo start

# Run the bundler on your connected emulator
npx expo start --ios
npx expo start --android

# Build a production-ready preview APK via EAS
npx eas-cli build --platform android --profile preview-apk
```

---
*Created and maintained by the PneumoDetect Development Team.*
