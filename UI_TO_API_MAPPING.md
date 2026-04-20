# PneumoDetect - UI Screen to API Mapping

Complete visual reference showing which APIs are called for each UI screen.

---

## 🔐 AUTHENTICATION SCREENS

### Screen: Login (`/(auth)/login`)

```
┌─────────────────────────────────────────────────┐
│  PneumoDetect Login                             │
│                                                 │
│  Email: [____________]                          │
│  Password: [____________] [👁️]                  │
│  [Sign In]  [Forgot Password]  [Sign Up]       │
│                                                 │
└─────────────────────────────────────────────────┘
         ↓ On "Sign In" Click
    POST /auth/login
    └─→ Get accessToken + User data
         ↓ Success
    Save token to storage
    Navigate to Dashboard
```

### Screen: Signup (`/(auth)/signup`)

```
┌─────────────────────────────────────────────────┐
│  Create Account                                 │
│                                                 │
│  Email: [____________]                          │
│  Name: [____________]                           │
│  Role: [👨‍⚕️ CLINICIAN / 👤 PATIENT]              │
│                                                 │
│  IF CLINICIAN:                                  │
│  ├─ Specialization: [Dropdown]                  │
│  ├─ Phone: [____________]                       │
│  └─ Medical History: [____________]             │
│                                                 │
│  IF PATIENT:                                    │
│  ├─ DOB: [Date Picker]                          │
│  ├─ Gender: [Dropdown]                          │
│  └─ Blood Type: [Dropdown]                      │
│                                                 │
│  Password: [____________] [👁️]                  │
│  Confirm: [____________] [👁️]                  │
│  [Create Account]  [Sign In]                   │
│                                                 │
└─────────────────────────────────────────────────┘
         ↓ On "Create Account" Click
    POST /auth/register
    └─→ Create user account
         ↓ Success
    Navigate to OTP Verification
```

### Screen: OTP Verification (`/(auth)/otp-verification`)

```
┌─────────────────────────────────────────────────┐
│  Verify Your Email                              │
│                                                 │
│  Code sent to: your-email@example.com           │
│                                                 │
│  [⬜] [⬜] [⬜] [⬜] [⬜] [⬜]                     │
│                                                 │
│  [Verify]  [Resend Code]  [Change Email]       │
│                                                 │
└─────────────────────────────────────────────────┘
         ↓ On "Verify" Click
    POST /auth/verify-otp
    └─→ Verify OTP code
         ↓ Success
    Save token
    Navigate to Dashboard
```

---

## 📊 DASHBOARD & HOME SCREENS

### Screen: Dashboard (`/(tabs)/index`) - MAIN SCREEN

```
┌─────────────────────────────────────────────────┐
│  Dashboard          [🔔]                        │
│  Track your scans                               │
│                                                 │
│  ┌──────────────────────────────────────────────┤
│  │ Welcome back, Dr. John Doe        [👨‍⚕️]       │
│  └──────────────────────────────────────────────┘
│       ↓
│     GET /users/me (on app init)
│
│  ┌──────────────────────────────────────────────┤
│  │ Quick Actions                                │
│  │ [+ New Scan] [📋] [📊] [👥]                  │
│  └──────────────────────────────────────────────┘
│
│  ┌──────────────────────────────────────────────┤
│  │ Overview (Stats)                             │
│  │ Total: 104  Failed: 12  Completed: 92        │
│  │ Processing: 8                                │
│  │                                              │
│  │ ↓ GET /analytics/stats                       │
│  │ ├─ totalScans: 104                           │
│  │ ├─ failedScans: 12                           │
│  │ ├─ completedScans: 92                        │
│  │ └─ processingScans: 8                        │
│  └──────────────────────────────────────────────┘
│
│  ┌──────────────────────────────────────────────┤
│  │ Weekly Activity (Chart)                      │
│  │ [Chart showing daily scan counts]            │
│  │ ↑ 12.5% vs last week                         │
│  │                                              │
│  │ ↓ GET /analytics/scans/results               │
│  │ ├─ timelineData[]:                           │
│  │ │  ├─ date: "2026-04-14"                     │
│  │ │  ├─ scans: 11 (Y-axis value)               │
│  │ │  ├─ pneumonia: 4                           │
│  │ │  ├─ normal: 7                              │
│  │ │  └─ averageConfidence: 0.86                │
│  │ │  ... more days                             │
│  │ └─ totalScans: 104                           │
│  └──────────────────────────────────────────────┘
│
│  ┌──────────────────────────────────────────────┤
│  │ Recent Scans                       [View All]│
│  │                                              │
│  │ ┌─ Scan Results ───────────────────────────┐ │
│  │ │ ID: scan_001                             │ │
│  │ │ Patient: Jane Smith                      │ │
│  │ │ Result: 🔴 PNEUMONIA                    │ │
│  │ │ Confidence: 94%                          │ │
│  │ │ Date: Apr 20, 2:30 PM                    │ │
│  │ │ [Tap to view details]                    │ │
│  │ └──────────────────────────────────────────┘ │
│  │                                              │
│  │ ↓ GET /scans (list of recent scans)          │
│  │ ├─ id, status, result, confidence           │
│  │ ├─ imageUrl, heatmapUrl                     │
│  │ ├─ patient info                             │
│  │ └─ ... more scans                           │
│  │                                              │
│  │ ↓ GET /notifications (unread count)          │
│  │ └─ Show badge on 🔔 icon                    │
│  └──────────────────────────────────────────────┘
│
│  ┌──────────────────────────────────────────────┤
│  │ System Status                                │
│  │ 🟢 AI Model: Operational                     │
│  │ 🟢 Database: Connected                       │
│  │ 🟢 Storage: 78% Used                         │
│  │                                              │
│  │ ↓ GET /dashboard/system-status               │
│  │ ├─ aiModel: "Operational"                    │
│  │ ├─ database: "Connected"                     │
│  │ └─ storage: "78% Used"                       │
│  └──────────────────────────────────────────────┘
│
└─────────────────────────────────────────────────┘

LOADING: All APIs called in parallel with error handling
- If one fails, dashboard still shows with empty sections
```

---

## 📤 SCAN UPLOAD & ANALYSIS

### Screen: Upload Scan (`/analysis/upload`)

```
┌─────────────────────────────────────────────────┐
│  Upload Scan                    [Back]           │
│                                                 │
│  ┌──────────────────────────────────────────────┤
│  │ [Selected Image Preview]                     │
│  │ or "No Image Selected"                       │
│  └──────────────────────────────────────────────┘
│
│  [📷 Take Photo]                                │
│  [📁 Choose from Library]                       │
│
│  Patient ID/Name: [____________]                │
│  Notes: [____________]                          │
│                                                 │
│  [Upload & Analyze]  [Cancel]                  │
│                                                 │
└─────────────────────────────────────────────────┘
         ↓ On "Upload & Analyze"
    POST /scans/upload
    ├─ Form Data:
    │  ├─ image: <binary_file>
    │  ├─ patientId: "patient_123"
    │  └─ notes: "Follow-up scan"
    └─→ Response:
       ├─ id: "scan_new_001"
       ├─ status: "PROCESSING"
       └─ navigate to Processing screen
```

### Screen: Processing (`/analysis/processing`)

```
┌─────────────────────────────────────────────────┐
│  Processing Scan                                │
│                                                 │
│  🔄 [Loading Animation]                         │
│                                                 │
│  Analyzing chest X-ray...                       │
│  Please wait                                    │
│                                                 │
│  Progress: [=========>    ] 65%                 │
│                                                 │
│  Estimated time: 30 seconds                     │
│                                                 │
│  [Cancel]                                       │
│                                                 │
└─────────────────────────────────────────────────┘
         ↓ Every 2-3 seconds (polling)
    GET /scans/{scanId}
    ├─ While processing:
    │  └─ status: "PROCESSING"
    ├─ After completion:
    │  ├─ status: "COMPLETED"
    │  ├─ result: "PNEUMONIA"
    │  ├─ confidence: 0.92
    │  ├─ imageUrl: "https://..."
    │  ├─ heatmapUrl: "https://..."
    │  └─ analyzedAt: "2026-04-20T15:03:00Z"
    └─→ Navigate to Results screen
```

### Screen: Scan Results (`/analysis/results/[scanId]`)

```
┌─────────────────────────────────────────────────┐
│  Scan Results          [Back] [Share] [Save]    │
│                                                 │
│  ┌──────────────────────────────────────────────┤
│  │ CHEST X-RAY IMAGE                            │
│  │ [Original Image Display]                     │
│  └──────────────────────────────────────────────┘
│
│  ┌──────────────────────────────────────────────┤
│  │ ANALYSIS RESULT                              │
│  │                                              │
│  │ 🔴 PNEUMONIA DETECTED                        │
│  │ Confidence: 92%                              │
│  │                                              │
│  │ Model: v1.2.3                                │
│  │ Analyzed: Apr 20, 2026, 3:03 PM              │
│  │                                              │
│  │ ↓ Data from GET /scans/{scanId}              │
│  │ ├─ result: "PNEUMONIA"                       │
│  │ ├─ confidence: 0.92                          │
│  │ └─ modelVersion: "v1.2.3"                    │
│  └──────────────────────────────────────────────┘
│
│  ┌──────────────────────────────────────────────┤
│  │ AI HEATMAP (Shows affected areas)            │
│  │ [Heatmap Image Display]                      │
│  │                                              │
│  │ ↓ imageUrl from GET /scans/{scanId}          │
│  │ └─ heatmapUrl: "https://..."                 │
│  └──────────────────────────────────────────────┘
│
│  ┌──────────────────────────────────────────────┤
│  │ PATIENT INFORMATION                          │
│  │ Name: Jane Smith                             │
│  │ ID: P001                                     │
│  │ Age: 35 years, Female                        │
│  │                                              │
│  │ ↓ From GET /scans/{scanId}                   │
│  │ └─ patient: { name, id, age, gender }       │
│  └──────────────────────────────────────────────┘
│
│  [🔬 Explainable AI] [📋 Full Report]          │
│  [✏️ Edit Notes] [✅ Approve]                   │
│                                                 │
└─────────────────────────────────────────────────┘

BUTTON ACTIONS:
- Explainable AI → GET /scans/{scanId}/explainability
- Full Report → GET /reports/{scanId}
- Edit Notes → PUT /scans/{scanId}/notes
- Approve → PATCH /scans/{scanId}/status
```

### Screen: Explainable AI (`/analysis/results/explainable`)

```
┌─────────────────────────────────────────────────┐
│  AI Explanation             [Back]              │
│                                                 │
│  How the AI decided this is PNEUMONIA:          │
│                                                 │
│  ┌──────────────────────────────────────────────┤
│  │ Visual Features Detected:                    │
│  │ ✓ Opacity patterns in lower lobes            │
│  │ ✓ Air-space consolidation                    │
│  │ ✓ Infiltrate with irregular borders          │
│  │ ✓ Bilateral distribution of infiltrates     │
│  │                                              │
│  │ ↓ GET /scans/{scanId}/explainability         │
│  │ └─ visualFeatures: [...]                     │
│  └──────────────────────────────────────────────┘
│
│  ┌──────────────────────────────────────────────┤
│  │ Contributing Factors to Decision:            │
│  │                                              │
│  │ [█████████████████░░░░] 45% - Consolidation │
│  │ [███████████░░░░░░░░░░] 30% - Air broncho.. │
│  │ [█████████░░░░░░░░░░░░░] 25% - Distribution │
│  │                                              │
│  │ ↓ GET /scans/{scanId}/explainability         │
│  │ └─ contributingFactors:                      │
│  │    ├─ feature, impact, description           │
│  │    └─ ... more factors                       │
│  └──────────────────────────────────────────────┘
│
│  ┌──────────────────────────────────────────────┤
│  │ Confidence Breakdown:                        │
│  │ Pneumonia: ████████████████████ 92%          │
│  │ Normal:    ██ 8%                             │
│  │                                              │
│  │ ↓ GET /scans/{scanId}/explainability         │
│  │ └─ confidenceBreakdown:                      │
│  │    ├─ pneumonia: 0.92                        │
│  │    └─ normal: 0.08                           │
│  └──────────────────────────────────────────────┘
│
└─────────────────────────────────────────────────┘
```

---

## 📋 PATIENT MANAGEMENT

### Screen: Patients List (`/(patient)/index` or `/patients`)

```
┌─────────────────────────────────────────────────┐
│  Patients                [Back] [+ Add Patient] │
│                                                 │
│  Search: [____________]                         │
│  Filter: [👨] [👩]                              │
│                                                 │
│  ↓ GET /patients?skip=0&limit=20                │
│  ├─ [Patient Card 1]                            │
│  │ Name: Jane Smith                             │
│  │ ID: P001                                     │
│  │ Scans: 5 | Last: Today                       │
│  │ Pneumonia: 2 cases                           │
│  │ [Tap to view]                                │
│  │                                              │
│  ├─ [Patient Card 2]                            │
│  │ Name: John Johnson                           │
│  │ ID: P002                                     │
│  │ Scans: 3 | Last: 2 days ago                  │
│  │ Pneumonia: 1 case                            │
│  │ [Tap to view]                                │
│  │                                              │
│  └─ [Patient Card 3] ...                        │
│                                                 │
│  [Load More...]                                 │
│                                                 │
└─────────────────────────────────────────────────┘

ON TAP: Navigate to Patient Detail Screen
```

### Screen: Patient Details (`/patients/[patientId]`)

```
┌─────────────────────────────────────────────────┐
│  Jane Smith             [Back] [Edit] [Delete] │
│                                                 │
│  ┌──────────────────────────────────────────────┤
│  │ DEMOGRAPHICS                                 │
│  │ ID: P001                                     │
│  │ Age: 35 years                                │
│  │ Gender: Female                               │
│  │ DOB: May 15, 1990                            │
│  │ Registered: Feb 1, 2026                      │
│  │                                              │
│  │ ↓ GET /patients/{patientId}                  │
│  │ ├─ id, idNumber, name, age, gender           │
│  │ ├─ dateOfBirth, createdAt                    │
│  │ └─ ... other fields                          │
│  └──────────────────────────────────────────────┘
│
│  ┌──────────────────────────────────────────────┤
│  │ SCAN HISTORY                                 │
│  │ Total Scans: 5                               │
│  │ Pneumonia: 2 cases | Normal: 3 cases         │
│  │                                              │
│  │ [Scan 1] PNEUMONIA 92%  Apr 20, 2:30 PM     │
│  │ [Scan 2] NORMAL 91%     Apr 15, 10:00 AM    │
│  │ [Scan 3] NORMAL 88%     Apr 10, 3:00 PM     │
│  │ [Scan 4] PNEUMONIA 85%  Apr 5, 12:00 PM     │
│  │ [Scan 5] NORMAL 90%     Mar 28, 9:00 AM     │
│  │                                              │
│  │ ↓ GET /patients/{patientId}                  │
│  │ └─ scans[]: Array of scan objects            │
│  │    ├─ id, result, confidence                 │
│  │    └─ ... scan details                       │
│  │                                              │
│  │ [View All Scans]                             │
│  └──────────────────────────────────────────────┘
│
│  [📤 Upload New Scan] [🖨️ Print Record]        │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Screen: Create Patient (`/patients/create`)

```
┌─────────────────────────────────────────────────┐
│  New Patient                    [Back]           │
│                                                 │
│  ID Number: [____________]                      │
│  Full Name: [____________]                      │
│  Age: [______]                                  │
│  Gender: [👨 / 👩] Dropdown                     │
│                                                 │
│  [Save Patient]  [Cancel]                       │
│                                                 │
└─────────────────────────────────────────────────┘
         ↓ On "Save Patient"
    POST /patients
    ├─ Body:
    │  ├─ idNumber: "P001"
    │  ├─ name: "Jane Smith"
    │  ├─ age: 35
    │  └─ gender: "FEMALE"
    └─→ Response: Created patient object
         ↓ On success
    Navigate back to Patients List
```

---

## 👤 PROFILE & SETTINGS

### Screen: Profile (`/(tabs)/profile`)

```
┌─────────────────────────────────────────────────┐
│  Profile                                        │
│                                                 │
│  ┌──────────────────────────────────────────────┤
│  │ [Profile Avatar] 👨‍⚕️                           │
│  │ [Edit Avatar]                                │
│  └──────────────────────────────────────────────┘
│
│  Name: Dr. John Doe                             │
│  Email: doctor@example.com                      │
│  Role: Clinician                                │
│  Specialization: Pulmonology                    │
│  Phone: +1234567890                             │
│
│  ↓ GET /users/me (on screen load)               │
│  ├─ id, email, name, role                       │
│  ├─ specialization, phone                       │
│  ├─ avatarUrl, isVerified, isActive             │
│  └─ createdAt, updatedAt                        │
│
│  [Edit Profile]  [Change Password]              │
│
│  ┌──────────────────────────────────────────────┤
│  │ SETTINGS MENU                                │
│  │ [⚙️  Settings]                                │
│  │ [🔒 Privacy & Security]                      │
│  │ [ℹ️  About PneumoDetect]                      │
│  │ [💬 Help Center]                             │
│  │ [🔔 Notifications]                           │
│  │ [📞 Contact Support]                         │
│  │ [🚪 Logout]                                  │
│  └──────────────────────────────────────────────┘
│
└─────────────────────────────────────────────────┘

ON TAP:
- Edit Profile → Modal with PUT /users/profile
- Logout → POST /auth/logout
- Notifications → /profile/notifications
- Help Center → /profile/help-center
```

### Screen: Notifications Center (`/notifications`)

```
┌─────────────────────────────────────────────────┐
│  Notifications          [Back] [Mark All Read]  │
│                                                 │
│  ┌──────────────────────────────────────────────┤
│  │ UNREAD (3 new)                               │
│  │                                              │
│  │ [🔴 NEW] Scan Completed                      │
│  │ Patient: Jane Smith                          │
│  │ Result: PNEUMONIA 92%                        │
│  │ 2 minutes ago                                │
│  │ [Mark Read] [Delete]                         │
│  │                                              │
│  │ [🔴 NEW] System Update                       │
│  │ AI Model v1.2.3 now available                │
│  │ 5 minutes ago                                │
│  │ [Mark Read] [Delete]                         │
│  │                                              │
│  │ [🔴 NEW] Patient Added                       │
│  │ New patient John Johnson registered          │
│  │ 10 minutes ago                               │
│  │ [Mark Read] [Delete]                         │
│  │                                              │
│  ├─────────────────────────────────────────────┤
│  │ READ EARLIER (12)                            │
│  │                                              │
│  │ [⚪] Scan Processed Successfully              │
│  │ Yesterday at 3:45 PM                         │
│  │ [Delete]                                     │
│  │                                              │
│  └─────────────────────────────────────────────┘
│
│  ↓ GET /notifications                           │
│  ├─ id, title, message, type                    │
│  ├─ read (boolean)                              │
│  └─ createdAt, userId                           │
│
│  ACTIONS:
│  - Mark Read: PATCH /notifications/{id}
│  - Delete: DELETE /notifications/{id}
│  - Mark All: PATCH /notifications/mark-all-read
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 👨‍💼 ADMIN SCREENS (Only for role === "CLINICIAN" with admin flag)

### Screen: Users Management (`/(tabs)/(admin)/users`)

```
┌─────────────────────────────────────────────────┐
│  User Management        [Back] [+ Add User]     │
│                                                 │
│  Search: [____________]                         │
│  Filter: [ADMIN] [CLINICIAN]                    │
│                                                 │
│  ↓ GET /admin/users?skip=0&limit=20             │
│  ├─ [User Card 1]                               │
│  │ Name: Dr. John Doe                           │
│  │ Role: Clinician                              │
│  │ Email: doctor@example.com                    │
│  │ Status: 🟢 Active                            │
│  │ Specialization: Pulmonology                  │
│  │ [Suspend] [Delete]                           │
│  │                                              │
│  ├─ [User Card 2]                               │
│  │ Name: Jane Admin                             │
│  │ Role: Admin                                  │
│  │ Email: admin@example.com                     │
│  │ Status: 🟢 Active                            │
│  │ [Suspend] [Delete]                           │
│  │                                              │
│  └─ [User Card 3] ...                           │
│                                                 │
│  [Load More...]                                 │
│                                                 │
└─────────────────────────────────────────────────┘

ON SUSPEND: PATCH /admin/users/{userId}/status
ON DELETE: DELETE /admin/users/{userId}
```

### Screen: Analytics (`/(tabs)/(admin)/analytics`)

```
┌─────────────────────────────────────────────────┐
│  Analytics                    [Back]             │
│                                                 │
│  ┌──────────────────────────────────────────────┤
│  │ KEY METRICS                                  │
│  │ Total Scans: 1,204                           │
│  │ Pneumonia Rate: 43.2%                        │
│  │ Avg Confidence: 0.89                         │
│  │ Active Clinicians: 12                        │
│  │                                              │
│  │ ↓ GET /analytics/stats                       │
│  └──────────────────────────────────────────────┘
│
│  ┌──────────────────────────────────────────────┤
│  │ TRENDS & CHARTS                              │
│  │ [📈 Scans/Day] [📊 Results] [📉 Confidence]  │
│  │                                              │
│  │ ↓ GET /analytics/scans/results               │
│  │ ↓ GET /analytics/doctors                     │
│  │ ↓ GET /analytics/patients                    │
│  │ ↓ GET /analytics/model-performance           │
│  └──────────────────────────────────────────────┘
│
│  Date Range: [From 2026-04-01] - [To 2026-04-20]
│
│  [📥 Export Report] [🖨️ Print] [📧 Email]      │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🔄 DATA FLOW DIAGRAMS

### Complete User Journey: Login → Dashboard → Scan Upload → Results

```
LOGIN FLOW:
┌─ Login Screen
│  └─ POST /auth/login
│     └─→ GET /users/me (stored for later)
│        └─→ Dashboard Screen

DASHBOARD FLOW:
┌─ Dashboard (on mount)
│  ├─ GET /analytics/stats ──→ Display stats cards
│  ├─ GET /analytics/scans/results ──→ Display chart
│  ├─ GET /scans ──→ Display recent scans
│  ├─ GET /notifications ──→ Badge count
│  └─ GET /dashboard/system-status ──→ Display status

SCAN UPLOAD FLOW:
┌─ Upload Screen
│  └─ POST /scans/upload
│     └─→ Processing Screen
│        └─ GET /scans/{scanId} (polling every 2-3s)
│           └─ When complete: Results Screen
│              └─ GET /scans/{scanId}
│              └─ GET /scans/{scanId}/explainability
│              └─ GET /reports/{scanId}
```

---

## 📊 API Call Frequency

| Screen        | API                  | Call Frequency                     |
| ------------- | -------------------- | ---------------------------------- |
| Login         | POST /auth/login     | 1x (on submit)                     |
| Dashboard     | GET /analytics/stats | 1x (on mount) + pull-to-refresh    |
| Dashboard     | GET /scans           | 1x (on mount) + pull-to-refresh    |
| Processing    | GET /scans/{scanId}  | Every 2-3s (polling)               |
| Profile       | GET /users/me        | 1x (on mount)                      |
| Patients      | GET /patients        | 1x (on mount) + pagination         |
| Notifications | GET /notifications   | 1x (on mount) + WebSocket optional |

---

## 🎯 Quick Navigation

**From any screen, check the URL route to know which APIs to call:**

| Route                        | Primary APIs                                                           |
| ---------------------------- | ---------------------------------------------------------------------- |
| `/(auth)/login`              | POST /auth/login                                                       |
| `/(auth)/signup`             | POST /auth/register                                                    |
| `/(tabs)/index`              | GET /analytics/stats, /scans, /notifications, /dashboard/system-status |
| `/analysis/upload`           | POST /scans/upload                                                     |
| `/analysis/processing`       | GET /scans/{scanId} (polling)                                          |
| `/analysis/results/[scanId]` | GET /scans/{scanId}, /explainability, /reports                         |
| `/patients`                  | GET /patients                                                          |
| `/patients/[id]`             | GET /patients/{id}                                                     |
| `/(tabs)/profile`            | GET /users/me                                                          |
| `/notifications`             | GET /notifications                                                     |
| `/(tabs)/(admin)/users`      | GET /admin/users                                                       |
| `/(tabs)/(admin)/analytics`  | GET /analytics/stats, /patients, /doctors                              |
