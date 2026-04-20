# PneumoDetect Complete API & UI Documentation
**Comprehensive Guide to All Screens, Workflows, and API Endpoints**

**Date:** April 20, 2026  
**Status:** ✅ Production Ready  
**Backend Version:** 44/44 Endpoints Complete

---

## 📑 Complete Table of Contents

### Part 1: Authentication Flow
1. [Login Screen](#login-screen)
2. [Sign Up Screen](#sign-up-screen)
3. [OTP Verification](#otp-verification)
4. [Forgot Password](#forgot-password)

### Part 2: Main Application
5. [Dashboard Screen](#dashboard-screen)
6. [Scan Workflow](#scan-workflow-3-step-process)
   - 6.1 [Upload Screen](#upload-screen)
   - 6.2 [Patient Info Screen](#patient-info-screen)
   - 6.3 [Processing Screen](#processing-screen)
7. [Scan Results & Heatmap](#scan-results--heatmap)
8. [History/Records](#historyrecords)

### Part 3: User Features
9. [Profile Management](#profile-management)
10. [Patient Management](#patient-management)

### Part 4: Admin Features
11. [Admin - Users](#admin-users)
12. [Admin - All Scans](#admin-all-scans)
13. [Admin - Analytics](#admin-analytics)

### Part 5: System Features
14. [Notifications](#notifications)
15. [Reports](#reports)

### Part 6: Reference
16. [Complete API Endpoints Table](#complete-api-endpoints-table)
17. [Error Handling](#error-handling)
18. [Response Format Standards](#response-format-standards)

---

# PART 1: AUTHENTICATION FLOW

## 🔐 Login Screen

**File:** `app/(auth)/login.tsx`  
**Route:** `/(auth)/login`  
**Auth Required:** ❌ No

### Screen Layout
```
┌────────────────────────────────────────────┐
│  ← Back Button                              │
│                                             │
│          [Login Icon]                       │
│                                             │
│       Welcome Back                          │
│       Sign in to continue                   │
│                                             │
│  [📧 Email Address                ]         │
│  (error message if invalid)                 │
│                                             │
│  [🔒 Password                    👁]        │
│  (error message if required)                │
│                                             │
│       Forgot Password? [Link]               │
│                                             │
│  ┌───────────────────────────────────┐     │
│  │          SIGN IN                  │     │
│  └───────────────────────────────────┘     │
│                                             │
│  Don't have an account? Sign Up [Link]     │
└────────────────────────────────────────────┘
```

### Input Fields & Validation
| Field | Type | Validation | Required |
|-------|------|-----------|----------|
| Email | Text | Valid email format (xxx@xxx.xxx) | ✅ Yes |
| Password | Password | Min 6 characters | ✅ Yes |

### API Endpoint

**Method:** `POST`  
**Endpoint:** `/auth/login`  
**Headers:** `Content-Type: application/json`

#### Request Payload
```json
{
  "email": "john@hospital.com",
  "password": "securePassword123"
}
```

#### Success Response (200 OK)
```json
{
  "id": "user-001",
  "email": "john@hospital.com",
  "name": "Dr. John Doe",
  "role": "CLINICIAN",
  "specialization": "Pulmonology",
  "phone": "+1-555-123-4567",
  "avatarUrl": null,
  "isVerified": true,
  "isActive": true,
  "createdAt": "2024-03-01T10:00:00Z",
  "updatedAt": "2024-04-20T10:00:00Z",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTAwMSJ9..."
}
```

#### Error Responses

**Invalid Credentials (401):**
```json
{
  "statusCode": 401,
  "message": "Invalid email or password",
  "error": "Unauthorized"
}
```

**Email Not Verified (400):**
```json
{
  "statusCode": 400,
  "message": "Email not verified",
  "error": "Email not verified",
  "isNotVerified": true
}
```

### Navigation Flow
```
Success (isVerified: true)
  → router.replace("/(tabs)")  // Go to Dashboard

Error (isVerified: false)
  → router.push("/(auth)/otp-verification", { email })  // OTP Page

Invalid Credentials
  → Show error toast
  → Stay on login screen

Forgot Password Click
  → router.push("/(auth)/forgot-password")

Sign Up Click
  → router.push("/(auth)/signup")
```

---

## 📝 Sign Up Screen

**File:** `app/(auth)/signup.tsx`  
**Route:** `/(auth)/signup`  
**Auth Required:** ❌ No

### Screen Layout (Clinician Mode)
```
┌────────────────────────────────────────────┐
│  ← Back Button                              │
│                                             │
│        [Person Add Icon]                    │
│                                             │
│       Create Account                        │
│       Join PneumoDetect AI                  │
│                                             │
│  [👤 Full Name                    ]         │
│  [📧 Email Address                ]         │
│                                             │
│  Account Type:                              │
│  [👨‍⚕️ Clinician] [👤 Patient]                │
│                                             │
│  [💼 Specialization (Optional)    ▼]        │
│  [📱 Phone (Optional)             ]         │
│  [🔒 Password                     ]         │
│  [🔒 Confirm Password             ]         │
│                                             │
│  ┌───────────────────────────────────┐     │
│  │      CREATE ACCOUNT               │     │
│  └───────────────────────────────────┘     │
│                                             │
│  Already have an account? Sign In [Link]   │
└────────────────────────────────────────────┘
```

### Screen Layout (Patient Mode - Additional Fields)
```
[Same as above, but after role selection adds:]

  [📅 Date of Birth (YYYY-MM-DD)    ▼]
  [👥 Gender                         ▼]
    ├ MALE
    ├ FEMALE
    └ OTHER
  [📝 Medical History (Optional)    ]
    └ [Asthma, Allergies, etc...]
```

### Input Fields & Validation

**Common Fields (Both Roles):**
| Field | Type | Validation | Required |
|-------|------|-----------|----------|
| Full Name | Text | Non-empty | ✅ Yes |
| Email | Text | Valid format | ✅ Yes |
| Password | Password | Min 6 chars | ✅ Yes |
| Confirm Password | Password | Must match password | ✅ Yes |
| Phone | Text | Phone format | ❌ Optional |
| Role | Toggle | CLINICIAN \| PATIENT | ✅ Yes |

**Clinician Only:**
| Field | Type | Options | Required |
|-------|------|---------|----------|
| Specialization | Dropdown | See list below | ❌ Optional |

**Patient Only:**
| Field | Type | Validation | Required |
|-------|------|-----------|----------|
| Date of Birth | Date | YYYY-MM-DD format | ❌ Optional |
| Gender | Select | MALE / FEMALE / OTHER | ✅ Yes |
| Medical History | Text | Any text | ❌ Optional |

### Available Specializations
```typescript
[
  "General Practice",
  "Pulmonology",
  "Radiology",
  "Internal Medicine",
  "Family Medicine",
  "Pediatrics",
  "Emergency Medicine",
  "Critical Care",
  "Infectious Disease",
  "Respiratory Medicine"
]
```

### API Endpoint

**Method:** `POST`  
**Endpoint:** `/auth/register`  
**Headers:** `Content-Type: application/json`

#### Request Payloads

**Clinician Signup:**
```json
{
  "name": "Dr. John Doe",
  "email": "john@hospital.com",
  "password": "securePassword123",
  "role": "CLINICIAN",
  "phone": "+1-555-123-4567",
  "specialization": "Pulmonology"
}
```

**Patient Signup:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "securePassword123",
  "role": "PATIENT",
  "phone": "+1-555-987-6543",
  "dateOfBirth": "1990-05-15",
  "gender": "FEMALE",
  "medicalHistory": "Asthma, Allergies"
}
```

**Minimal Signup (Clinician):**
```json
{
  "name": "Dr. Smith",
  "email": "smith@hospital.com",
  "password": "securePassword123",
  "role": "CLINICIAN"
}
```

#### Success Response (201 Created)
```json
{
  "id": "user-002",
  "email": "john@hospital.com",
  "name": "Dr. John Doe",
  "role": "CLINICIAN",
  "specialization": "Pulmonology",
  "phone": "+1-555-123-4567",
  "avatarUrl": null,
  "isVerified": false,
  "isActive": true,
  "createdAt": "2024-04-20T10:00:00Z",
  "updatedAt": "2024-04-20T10:00:00Z",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Error Responses

**Email Already Exists (409):**
```json
{
  "statusCode": 409,
  "message": "Email already registered",
  "error": "User already exists"
}
```

**Validation Error (400):**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Password must be at least 6 characters"
}
```

### Navigation Flow
```
Success
  → router.push("/(auth)/otp-verification", { email })  // OTP Page
  → Show toast: "Account created successfully!"

Email Already Exists
  → Show error toast
  → Stay on signup screen

Validation Error
  → Show field-specific error message
  → Stay on signup screen

Back Button
  → router.back()  // Return to previous screen

Sign In Link
  → router.push("/(auth)/login")
```

---

## ✅ OTP Verification Screen

**File:** `app/(auth)/otp-verification.tsx`  
**Route:** `/(auth)/otp-verification?email=user@example.com`  
**Auth Required:** ❌ No

### Screen Layout
```
┌────────────────────────────────────────────┐
│                                             │
│          [Mail Icon]                        │
│                                             │
│       Verify Email                          │
│       We sent a 6-digit code to             │
│       john@hospital.com                     │
│                                             │
│  ┌───────────────────────────────────┐     │
│  │  Enter OTP                        │     │
│  │  [_ _ _ _ _ _]                    │     │
│  └───────────────────────────────────┘     │
│  (error message if any)                    │
│                                             │
│  ┌───────────────────────────────────┐     │
│  │        VERIFY OTP                 │     │
│  └───────────────────────────────────┘     │
│                                             │
│  Didn't receive code?                       │
│  [Resend OTP (60s)]  OR  [Resend OTP]      │
│                                             │
│  [← Back to Sign In]                        │
└────────────────────────────────────────────┘
```

### Input Fields & Validation
| Field | Type | Validation | Required |
|-------|------|-----------|----------|
| OTP Code | Numeric | Exactly 6 digits (0-9) | ✅ Yes |

### API Endpoints

**Endpoint 1: Verify OTP**

**Method:** `POST`  
**Endpoint:** `/auth/verify-otp`  
**Headers:** `Content-Type: application/json`

#### Request Payload
```json
{
  "email": "john@hospital.com",
  "otp": "123456"
}
```

#### Success Response (200 OK)
```json
{
  "id": "user-002",
  "email": "john@hospital.com",
  "name": "Dr. John Doe",
  "role": "CLINICIAN",
  "specialization": "Pulmonology",
  "phone": "+1-555-123-4567",
  "avatarUrl": null,
  "isVerified": true,
  "isActive": true,
  "createdAt": "2024-04-20T10:00:00Z",
  "updatedAt": "2024-04-20T10:00:00Z",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Error Responses

**Invalid OTP (400):**
```json
{
  "statusCode": 400,
  "message": "Invalid OTP",
  "error": "OTP verification failed"
}
```

**OTP Expired (400):**
```json
{
  "statusCode": 400,
  "message": "OTP has expired",
  "error": "Please request a new OTP"
}
```

---

**Endpoint 2: Resend OTP**

**Method:** `POST`  
**Endpoint:** `/auth/resend-otp`  
**Headers:** `Content-Type: application/json`

#### Request Payload
```json
{
  "email": "john@hospital.com"
}
```

#### Success Response (200 OK)
```json
{
  "message": "OTP sent successfully",
  "email": "john@hospital.com"
}
```

#### Error Response

**Too Many Requests (429):**
```json
{
  "statusCode": 429,
  "message": "Too many OTP requests",
  "error": "Please try again in 5 minutes"
}
```

### Timer Behavior
```
Resend Button States:
- Initial: "Resend OTP" (clickable, blue)
- After Click: "Resend OTP (60s)" (disabled, gray, counting down)
- At 0s: "Resend OTP" (clickable again)
```

### Navigation Flow
```
Success
  → Check hasSeenOnboarding()
     ├─ false → router.replace("/(onboarding)")  // First-time onboarding
     └─ true → router.replace("/(tabs)")         // Direct to dashboard
  → Show toast: "Email verified successfully!"

Invalid OTP
  → Show error toast: "Invalid OTP"
  → Stay on screen
  → Allow retry

OTP Expired
  → Show error toast: "OTP has expired"
  → Show resend button to get new OTP

Resend OTP
  → Show toast: "OTP sent to your email!"
  → Start 60-second cooldown timer

Back Button
  → router.back()  // Return to signup
```

---

## 🔑 Forgot Password Screen

**File:** `app/(auth)/forgot-password.tsx`  
**Route:** `/(auth)/forgot-password`  
**Auth Required:** ❌ No

### Screen Layout
```
┌────────────────────────────────────────────┐
│                                             │
│          [Key Icon]                         │
│                                             │
│       Reset Password                        │
│       Enter your email address and          │
│       we'll send you a link to reset        │
│       your password.                        │
│                                             │
│  [📧 Email Address                ]         │
│  (error message if invalid)                 │
│                                             │
│  ┌───────────────────────────────────┐     │
│  │      SEND RESET LINK              │     │
│  └───────────────────────────────────┘     │
│                                             │
│  ┌─ ℹ️ ────────────────────────────────┐   │
│  │  If an account exists with this     │   │
│  │  email, you will receive password   │   │
│  │  reset instructions.                │   │
│  └────────────────────────────────────┘   │
│                                             │
│  [← Back to Sign In]                        │
└────────────────────────────────────────────┘
```

### Input Fields & Validation
| Field | Type | Validation | Required |
|-------|------|-----------|----------|
| Email | Text | Valid email format | ✅ Yes |

### API Endpoint

**Method:** `POST`  
**Endpoint:** `/auth/forgot-password`  
**Headers:** `Content-Type: application/json`

#### Request Payload
```json
{
  "email": "john@hospital.com"
}
```

#### Success Response (200 OK)
```json
{
  "message": "Password reset link sent successfully",
  "email": "john@hospital.com"
}
```

#### Error Responses

**User Not Found (404):**
```json
{
  "statusCode": 404,
  "message": "User not found",
  "error": "No account with this email"
}
```

**Rate Limited (429):**
```json
{
  "statusCode": 429,
  "message": "Too many password reset requests",
  "error": "Please try again in 15 minutes"
}
```

### Navigation Flow
```
Success
  → Show Alert: "Password reset link has been sent to your email"
  → On Alert OK: router.back()  // Return to login
  → User receives email with reset link

Invalid Email Format
  → Show error: "Please enter a valid email"
  → Stay on screen

User Not Found (but don't reveal it)
  → Show same success message (security best practice)
  → Prevents email enumeration attacks

Back Button
  → router.back()  // Return to login
```

---

# PART 2: MAIN APPLICATION SCREENS

## 🏠 Dashboard Screen

**File:** `app/(tabs)/index.tsx`  
**Route:** `/(tabs)` (Default tab)  
**Auth Required:** ✅ Yes  
**Roles:** CLINICIAN, PATIENT, ADMIN

### Screen Layout
```
┌─────────────────────────────────────────────┐
│ Welcome back, Dr. John Doe!    🔔 [3]       │
├─────────────────────────────────────────────┤
│ Growth: ↑ 12.5% This Week                   │
│ 250 scans analyzed                          │
├─────────────────────────────────────────────┤
│ System Status:                               │
│ 🟢 AI Model: Operational                     │
│ 🟢 Database: Connected                       │
│ 📊 Storage: 78% Used                         │
├─────────────────────────────────────────────┤
│ Scan Results Distribution                   │
│ ┌────────────────────────────────────┐      │
│ │ [Pie/Bar Chart]                    │      │
│ │ PNEUMONIA: 350 (29.2%)             │      │
│ │ NORMAL: 850 (70.8%)                │      │
│ └────────────────────────────────────┘      │
├─────────────────────────────────────────────┤
│ Recent Scans                                │
│ [Scan 1] PNEUMONIA 95% confidence ⚠️        │
│ [Scan 2] NORMAL 92% confidence ✓            │
│ [Scan 3] PNEUMONIA 88% confidence ⚠️        │
│                                             │
│ [More Scans >]                              │
├─────────────────────────────────────────────┤
│ 🏥 ADMIN: [Users] [All Scans] [Analytics]   │
└─────────────────────────────────────────────┘
```

### API Endpoints

**Endpoint 1: Get Statistics**

**Method:** `GET`  
**Endpoint:** `/analytics/stats`  
**Headers:** `Authorization: Bearer {accessToken}`

#### Response (200 OK)
```json
{
  "totalScans": 1250,
  "completedScans": 1200,
  "processingScans": 3,
  "failedScans": 47,
  "pneumoniaCases": 350,
  "normalCases": 850,
  "averageConfidence": 87.5,
  "weekGrowthPercentage": 12.5,
  "previousWeekScans": 980,
  "recentScans": [
    {
      "id": "scan-001",
      "patientId": "patient-001",
      "result": "PNEUMONIA",
      "confidence": 0.95,
      "createdAt": "2024-04-20T14:30:00Z",
      "patient": {
        "name": "John Doe"
      }
    }
  ]
}
```

---

**Endpoint 2: Get Scan Results**

**Method:** `GET`  
**Endpoint:** `/analytics/scans/results?groupBy=day`  
**Headers:** `Authorization: Bearer {accessToken}`

#### Response (200 OK)
```json
{
  "resultBreakdown": {
    "pneumonia": 350,
    "normal": 850,
    "pneumoniaPercentage": 29.2,
    "normalPercentage": 70.8
  },
  "confidenceDistribution": {
    "excellent": 800,
    "good": 350,
    "fair": 100
  },
  "timelineData": [
    {
      "date": "2024-04-14",
      "scans": 120,
      "pneumonia": 35,
      "normal": 85,
      "averageConfidence": 86.2
    }
  ],
  "totalScans": 1250,
  "averageConfidence": 87.5
}
```

---

**Endpoint 3: Get System Status**

**Method:** `GET`  
**Endpoint:** `/dashboard/system-status`  
**Headers:** `Authorization: Bearer {accessToken}`

#### Response (200 OK)
```json
{
  "aiModel": "Operational",
  "database": "Connected",
  "storage": "78% Used"
}
```

---

**Endpoint 4: Get Notifications**

**Method:** `GET`  
**Endpoint:** `/notifications`  
**Headers:** `Authorization: Bearer {accessToken}`

#### Response (200 OK)
```json
[
  {
    "id": "notif-001",
    "title": "Scan Complete",
    "message": "Your scan has been analyzed",
    "type": "SCAN",
    "read": false,
    "createdAt": "2024-04-20T14:30:00Z"
  }
]
```

### Features & Navigation
```
✅ Pull-to-refresh
✅ Notification badge shows unread count
✅ Click notification badge → /notifications
✅ Click recent scan → /report/[scanId]
✅ Click "New Scan" tab → /analysis/upload
✅ For ADMIN: Click admin buttons → Admin sections
✅ Real-time data loading
✅ Error handling with fallbacks
```

---

## 📤 Scan Workflow (3-Step Process)

### ⬆️ Upload Screen

**File:** `app/analysis/upload.tsx`  
**Route:** `/analysis/upload`  
**Step:** 1 of 3  
**Auth Required:** ✅ Yes (CLINICIAN role)

### Screen Layout
```
┌────────────────────────────────────────────┐
│ ← Back    Upload X-Ray      📤 Upload       │
│           Step 1 of 3                       │
├────────────────────────────────────────────┤
│ 📋 Upload Guidelines                        │
│ ✓ Upload a clear chest X-ray image         │
│ ✓ Accepted formats: JPG, PNG               │
│ ✓ Ensure good lighting and clarity         │
│ ✓ Image should show full chest area        │
├────────────────────────────────────────────┤
│                                             │
│           [Camera Icon]  [Gallery Icon]    │
│           Take Photo      Upload Image     │
│                                             │
│  OR if image selected:                      │
│           [Image Preview]                  │
│           [✓ Image Ready]                  │
│           [✕ Change Image]                 │
│                                             │
├────────────────────────────────────────────┤
│       [CONTINUE TO STEP 2]                 │
└────────────────────────────────────────────┘
```

### Input Validation
```
- Image Format: JPG, PNG only
- Image Dimensions: Any (user can crop)
- File Size: < 10MB recommended
- Requirement: Must be chest X-ray
```

### Features
```
✅ Camera capture (real-time)
✅ Gallery image picker
✅ Image preview before continuing
✅ Permission request handling
✅ User-friendly error messages
✅ Change/remove image option
```

### Navigation
```
Click Continue
  → Validate image exists
  → If valid: router.push("/analysis/patient-info", { imageUri })
  → If invalid: Show error toast

Click Back
  → router.push("/(tabs)")
```

---

### 👤 Patient Info Screen

**File:** `app/analysis/patient-info.tsx`  
**Route:** `/analysis/patient-info?imageUri=...`  
**Step:** 2 of 3  
**Auth Required:** ✅ Yes (CLINICIAN role)

### Screen Layout
```
┌────────────────────────────────────────────┐
│ ← Back    Patient Info       [X]            │
│           Step 2 of 3                       │
├────────────────────────────────────────────┤
│ Select or Create Patient                    │
│                                             │
│ [Patient Dropdown:                          │
│   ├─ John Doe (P001)                        │
│   ├─ Jane Smith (P002)                      │
│   └─ + Add New Patient                  ]   │
│                                             │
├────────────────────────────────────────────┤
│ Clinician Notes (Optional)                  │
│ ┌─────────────────────────────────────┐    │
│ │ Enter any observations...           │    │
│ │                                     │    │
│ └─────────────────────────────────────┘    │
│                                             │
├────────────────────────────────────────────┤
│       [CONTINUE TO STEP 3]                 │
└────────────────────────────────────────────┘
```

### Add New Patient Form (Modal)
```
┌────────────────────────────────────────────┐
│ Create New Patient                      ✕   │
├────────────────────────────────────────────┤
│ [📋 ID Number            ]                  │
│ [👤 Full Name            ]                  │
│ [🎂 Age                  ]                  │
│ [👥 Gender          ▼]                      │
│    ├─ MALE                                  │
│    └─ FEMALE                                │
│                                             │
│ [CREATE]  [CANCEL]                          │
└────────────────────────────────────────────┘
```

### API Endpoints

**Endpoint 1: Get All Patients**

**Method:** `GET`  
**Endpoint:** `/patients`  
**Headers:** `Authorization: Bearer {accessToken}`

#### Response (200 OK)
```json
[
  {
    "id": "patient-001",
    "idNumber": "P001",
    "name": "John Doe",
    "age": 45,
    "gender": "MALE",
    "createdAt": "2024-03-15T10:00:00Z"
  },
  {
    "id": "patient-002",
    "idNumber": "P002",
    "name": "Jane Smith",
    "age": 38,
    "gender": "FEMALE",
    "createdAt": "2024-04-01T10:00:00Z"
  }
]
```

---

**Endpoint 2: Create New Patient**

**Method:** `POST`  
**Endpoint:** `/patients`  
**Headers:** `Authorization: Bearer {accessToken}`, `Content-Type: application/json`

#### Request Payload
```json
{
  "idNumber": "P003",
  "name": "Michael Johnson",
  "age": 52,
  "gender": "MALE"
}
```

#### Response (201 Created)
```json
{
  "id": "patient-003",
  "idNumber": "P003",
  "name": "Michael Johnson",
  "age": 52,
  "gender": "MALE",
  "createdAt": "2024-04-20T10:00:00Z"
}
```

---

**Endpoint 3: Upload Scan**

**Method:** `POST`  
**Endpoint:** `/scans/upload`  
**Headers:** `Authorization: Bearer {accessToken}`, `Content-Type: multipart/form-data`

#### Request Payload (FormData)
```
patientId: "patient-001"
image: [File object from imageUri]
clinicianNotes: "Possible consolidation in left lobe" (optional)
```

#### Response (201 Created)
```json
{
  "id": "scan-001",
  "patientId": "patient-001",
  "imageUrl": "https://cdn.example.com/scans/scan-001.jpg",
  "status": "PROCESSING",
  "createdAt": "2024-04-20T15:00:00Z"
}
```

### Navigation
```
Click Continue
  → Validate patient selected
  → Call POST /scans/upload
  → If success: router.push("/analysis/processing", { scanId })
  → If error: Show error toast, stay on screen

Click Back
  → router.back()  // Return to upload screen

Click Add New Patient
  → Show modal
  → After creating: Auto-select new patient
```

---

### ⏳ Processing Screen

**File:** `app/analysis/processing.tsx`  
**Route:** `/analysis/processing?scanId=scan-001`  
**Step:** 3 of 3  
**Auth Required:** ✅ Yes (CLINICIAN role)

### Screen Layout
```
┌────────────────────────────────────────────┐
│                                             │
│      Analyzing X-Ray                        │
│      Please wait while our AI processes     │
│      the image                              │
│                                             │
│          [💡 Pulsing Animation]             │
│                                             │
│ Progress: ████████░ 80%                     │
│                                             │
│ 🟢 Image Upload ✓                           │
│ 🟡 Preprocessing (in progress)              │
│ ⚪ AI Analysis (pending)                     │
│ ⚪ Heatmap Generation (pending)              │
│                                             │
├────────────────────────────────────────────┤
│ Status: AI model running...                 │
│ Estimated time: 2 minutes                   │
└────────────────────────────────────────────┘
```

### Processing Steps & Timeline
```
Step 1: Image Upload (0-20%)
  - Validate image format
  - Upload to server
  - Duration: 5-10 seconds

Step 2: Preprocessing (20-40%)
  - Normalize image dimensions
  - Apply medical image filters
  - Enhance contrast
  - Duration: 10-15 seconds

Step 3: AI Analysis (40-80%)
  - Run deep learning model
  - Generate predictions
  - Calculate confidence scores
  - Duration: 30-60 seconds

Step 4: Heatmap Generation (80-100%)
  - Create attention heatmap
  - Generate visualization
  - Store results in database
  - Duration: 10-20 seconds

Total Time: ~2-3 minutes
```

### API Endpoints

**Endpoint: Process Scan**

**Method:** `POST`  
**Endpoint:** `/scans/{scanId}/process`  
**Headers:** `Authorization: Bearer {accessToken}`

#### Response (200 OK)
```json
{
  "id": "scan-001",
  "status": "COMPLETED",
  "result": "PNEUMONIA",
  "confidence": 0.952,
  "heatmapUrl": "https://cdn.example.com/heatmaps/scan-001.jpg",
  "analyzedAt": "2024-04-20T15:05:00Z"
}
```

#### Error Response
```json
{
  "statusCode": 500,
  "message": "Processing failed",
  "error": "AI model error: out of memory"
}
```

### Features & Polling
```
✅ Real-time progress bar updates
✅ Animated pulsing icon
✅ Status text changes with each step
✅ Step-by-step progress indicators
✅ Automatic polling (2-second intervals)
✅ Error handling with retry option
✅ Timeout handling (max 5 minutes)
✅ Auto-redirect on completion
```

### Navigation
```
Success (100%)
  → Show "Analysis complete!"
  → Wait 500ms
  → router.replace("/analysis/results/[scanId]", params)

Error
  → Show error message
  → Display retry button
  → Option to cancel and go back

Processing Timeout (> 5 minutes)
  → Show error: "Processing took too long"
  → Show retry or cancel options
```

---

## 📊 Scan Results & Heatmap

### 📈 Results Screen

**File:** `app/analysis/results/[scanId].tsx`  
**Route:** `/analysis/results/[scanId]`  
**Auth Required:** ✅ Yes

### Screen Layout
```
┌────────────────────────────────────────────┐
│ ✕ (close)        Analysis Results           │
├────────────────────────────────────────────┤
│          [X-Ray Image]                      │
├────────────────────────────────────────────┤
│                                             │
│ ⚠️ Pneumonia Detected                       │
│ Based on AI analysis of chest X-ray        │
│                                             │
├────────────────────────────────────────────┤
│ Confidence Score: 95.2%                     │
│ ███████████████████░ Very High Confidence  │
├────────────────────────────────────────────┤
│ Patient Information                         │
│ ID: P001    │ Name: John Doe               │
│ Age: 45 years │ Sex: Male                  │
│ Date: Apr 20, 2024 15:00 PM                │
├────────────────────────────────────────────┤
│ ⚠️ Medical Disclaimer                       │
│ This AI result is for screening only and    │
│ must be reviewed by a qualified healthcare  │
│ professional before any clinical decision.  │
├────────────────────────────────────────────┤
│ [🎨 View Heatmap] [📄 Generate Report]     │
│ [← Go to Dashboard]                         │
└────────────────────────────────────────────┘
```

### Result Display Logic
```
If result === "PNEUMONIA":
  - Icon: ⚠️ (warning)
  - Color: RED (#D32F2F)
  - Text: "Pneumonia Detected"
  - Confidence bar: RED

If result === "NORMAL":
  - Icon: ✓ (checkmark)
  - Color: GREEN (#4CAF50)
  - Text: "Normal"
  - Confidence bar: GREEN

Confidence Level Text:
  > 90% → "Very High Confidence"
  80-90% → "High Confidence"
  70-80% → "Moderate Confidence"
  < 70% → "Lower Confidence"
```

### API Endpoint (Optional - Can use local params)

**Method:** `GET`  
**Endpoint:** `/scans/{scanId}`  
**Headers:** `Authorization: Bearer {accessToken}`

#### Response (200 OK)
```json
{
  "id": "scan-001",
  "imageUrl": "https://cdn.example.com/scans/scan-001.jpg",
  "heatmapUrl": "https://cdn.example.com/heatmaps/scan-001.jpg",
  "status": "COMPLETED",
  "result": "PNEUMONIA",
  "confidence": 0.952,
  "modelVersion": "v2.1",
  "createdAt": "2024-04-20T15:00:00Z",
  "analyzedAt": "2024-04-20T15:05:00Z",
  "patientId": "patient-001",
  "clinicianId": "user-001",
  "patient": {
    "id": "patient-001",
    "name": "John Doe",
    "idNumber": "P001",
    "age": 45,
    "gender": "MALE"
  },
  "clinician": {
    "name": "Dr. Smith"
  }
}
```

### Navigation
```
Click View Heatmap
  → router.push("/analysis/results/explainable", params)

Click Generate Report
  → router.push("/report/[scanId]", { scanId })

Click Close (✕)
  → router.replace("/(tabs)")
```

---

### 🎨 Heatmap / Explainable Screen

**File:** `app/analysis/results/explainable.tsx`  
**Route:** `/analysis/results/explainable?scanId=...&imageUri=...&result=...&confidence=...`  
**Auth Required:** ✅ Yes

### Screen Layout
```
┌────────────────────────────────────────────┐
│ ←              Explainability               │
├────────────────────────────────────────────┤
│      [X-Ray with Heatmap Overlay]          │
│                                             │
│ Heatmap Legend:                             │
│ 🔴 High Attention (Red)                     │
│ 🟠 Medium Attention (Orange)                │
│ 🟡 Low Attention (Yellow)                   │
├────────────────────────────────────────────┤
│ AI Model Interpretation:                    │
│                                             │
│ The model focused on:                       │
│ • Lower left lobe shows consolidation       │
│ • Upper right area appears clear            │
│ • Center region shows density               │
│ • Normal appearance in lower right lobe     │
│                                             │
│ Result: PNEUMONIA                           │
│ Confidence: 95.2% (Very High)               │
│                                             │
│ ⚠️ Disclaimer: This is an AI-generated      │
│    interpretation and requires review by    │
│    a qualified medical professional.        │
└────────────────────────────────────────────┘
```

### Features
```
✅ Heatmap overlay on original X-ray
✅ Color-coded attention regions
✅ Explainability text
✅ Medical interpretation
✅ Confidence display
✅ Disclaimer message
```

---

## 📋 History/Records

**File:** `app/(tabs)/history.tsx`  
**Route:** `/(tabs)/history`  
**Auth Required:** ✅ Yes

### Screen Layout
```
┌────────────────────────────────────────────┐
│ History                                     │
│ [🔍 Search by name or ID...]               │
│                                             │
│ All Results ⊡ | Pneumonia | Normal          │
├────────────────────────────────────────────┤
│ ┌──────────────────────────────────────┐   │
│ │ [Thumbnail]  Scan-001                │   │
│ │              Patient: John Doe        │   │
│ │              Result: PNEUMONIA ⚠️    │   │
│ │              Confidence: 95.2%       │   │
│ │              Date: Apr 20, 2024      │   │
│ └──────────────────────────────────────┘   │
│ ┌──────────────────────────────────────┐   │
│ │ [Thumbnail]  Scan-002                │   │
│ │              Patient: Jane Smith     │   │
│ │              Result: NORMAL ✓        │   │
│ │              Confidence: 92.1%       │   │
│ │              Date: Apr 19, 2024      │   │
│ └──────────────────────────────────────┘   │
└────────────────────────────────────────────┘
```

### API Endpoint

**Method:** `GET`  
**Endpoint:** `/scans`  
**Headers:** `Authorization: Bearer {accessToken}`  
**Query Parameters:**
```
Optional:
  ?status=COMPLETED
  ?result=PNEUMONIA
  ?patientId=patient-001
```

#### Response (200 OK)
```json
[
  {
    "id": "scan-001",
    "imageUrl": "https://cdn.example.com/scans/scan-001.jpg",
    "status": "COMPLETED",
    "result": "PNEUMONIA",
    "confidence": 0.952,
    "createdAt": "2024-04-20T15:00:00Z",
    "patient": {
      "id": "patient-001",
      "name": "John Doe",
      "idNumber": "P001"
    }
  }
]
```

### Features & Filtering
```
✅ Search by patient name or ID
✅ Search by scan ID
✅ Filter by result type (ALL, PNEUMONIA, NORMAL)
✅ Thumbnail preview
✅ Confidence score display
✅ Date and time display
✅ Pull-to-refresh
✅ Tap to view full details
```

### Navigation
```
Click Scan Card
  → router.push("/report/[scanId]", { scanId })

Swipe Refresh
  → Reload scans from API

Search/Filter
  → Real-time filtering (client-side)
```

---

# PART 3: USER FEATURES

## 👤 Profile Management

**File:** `app/(tabs)/profile.tsx`  
**Route:** `/(tabs)/profile`  
**Auth Required:** ✅ Yes

### Screen Layout
```
┌────────────────────────────────────────────┐
│ Profile                                     │
├────────────────────────────────────────────┤
│ [Avatar]  Dr. John Doe                      │
│           Clinician                         │
│           john@hospital.com                 │
│           [Edit Profile]                    │
├────────────────────────────────────────────┤
│ Statistics                                  │
│ Total Scans: 45    Pneumonia: 12           │
│ Accuracy: 94.2%    Avg Confidence: 87.5%   │
├────────────────────────────────────────────┤
│ 📖 About                                  › │
│ ❓ Help Center                            › │
│ 🔔 Notifications             [Badge: 3]  › │
│ 🔐 Privacy & Security                     › │
│ 📞 Contact Us                             › │
├────────────────────────────────────────────┤
│ [Download Reports]                          │
│ [Logout]                                    │
│ [Clear Session] (Dev only)                  │
└────────────────────────────────────────────┘
```

### Edit Profile Modal
```
┌────────────────────────────────────────────┐
│ Edit Profile                            ✕   │
├────────────────────────────────────────────┤
│ [Full Name]          Dr. John Doe          │
│ [Email (Readonly)]   john@hospital.com     │
│ [Phone]              +1-555-123-4567       │
│ [Specialization]     Pulmonology           │
│                                             │
│ [Save Changes]  [Cancel]                    │
└────────────────────────────────────────────┘
```

### API Endpoints

**Endpoint 1: Get Current User**

**Method:** `GET`  
**Endpoint:** `/users/me`  
**Headers:** `Authorization: Bearer {accessToken}`

#### Response (200 OK)
```json
{
  "id": "user-001",
  "email": "john@hospital.com",
  "name": "Dr. John Doe",
  "role": "CLINICIAN",
  "specialization": "Pulmonology",
  "phone": "+1-555-123-4567",
  "avatarUrl": null,
  "isVerified": true,
  "isActive": true,
  "createdAt": "2024-03-01T10:00:00Z",
  "updatedAt": "2024-04-20T10:00:00Z"
}
```

---

**Endpoint 2: Update Profile**

**Method:** `PUT`  
**Endpoint:** `/users/profile`  
**Headers:** `Authorization: Bearer {accessToken}`, `Content-Type: application/json`

#### Request Payload
```json
{
  "name": "Dr. John Doe",
  "phone": "+1-555-987-6543",
  "specialization": "Respiratory Medicine"
}
```

#### Response (200 OK)
```json
{
  "id": "user-001",
  "email": "john@hospital.com",
  "name": "Dr. John Doe",
  "role": "CLINICIAN",
  "specialization": "Respiratory Medicine",
  "phone": "+1-555-987-6543",
  "updatedAt": "2024-04-20T16:00:00Z"
}
```

---

**Endpoint 3: Get Statistics**

**Method:** `GET`  
**Endpoint:** `/analytics/stats`  
**Headers:** `Authorization: Bearer {accessToken}`

(Same as Dashboard - see Dashboard section)

---

**Endpoint 4: Get Notifications**

**Method:** `GET`  
**Endpoint:** `/notifications`  
**Headers:** `Authorization: Bearer {accessToken}`

(Same as Dashboard - see Dashboard section)

### Navigation
```
Click Edit Profile
  → Show edit modal
  → After save: Update local state and show toast

Click Notifications
  → router.push("/notifications")

Click Logout
  → Show confirmation alert
  → On confirm: await authContext.logout()
  → Clear auth data
  → router.replace("/(auth)/login")

Click Download Reports
  → Show native share/download dialog
```

---

## 👥 Patient Management

**File:** `app/patients/index.tsx`  
**Route:** `/patients`  
**Auth Required:** ✅ Yes (CLINICIAN role)

### Screen Layout
```
┌────────────────────────────────────────────┐
│ ← Patients                          [+]     │
│     5 patients                              │
│ [🔍 Search by name or ID...]               │
├────────────────────────────────────────────┤
│ ┌──────────────────────────────────────┐   │
│ │ [Avatar]  John Doe                   │   │
│ │           ID: P001                   │   │
│ │           45 years old • Male        │   │
│ │                      [Scans: 3]  ›   │   │
│ └──────────────────────────────────────┘   │
│ ┌──────────────────────────────────────┐   │
│ │ [Avatar]  Jane Smith                 │   │
│ │           ID: P002                   │   │
│ │           38 years old • Female      │   │
│ │                      [Scans: 5]  ›   │   │
│ └──────────────────────────────────────┘   │
└────────────────────────────────────────────┘
```

### API Endpoints

**Endpoint 1: Get All Patients**

**Method:** `GET`  
**Endpoint:** `/patients`  
**Headers:** `Authorization: Bearer {accessToken}`

(See Patient Info Screen section for response format)

---

**Endpoint 2: Create Patient**

**Method:** `POST`  
**Endpoint:** `/patients`  
**Headers:** `Authorization: Bearer {accessToken}`, `Content-Type: application/json`

(See Patient Info Screen section for request/response)

---

**Endpoint 3: Get Patient Details**

**Method:** `GET`  
**Endpoint:** `/patients/{patientId}`  
**Headers:** `Authorization: Bearer {accessToken}`

#### Response (200 OK)
```json
{
  "id": "patient-001",
  "idNumber": "P001",
  "name": "John Doe",
  "age": 45,
  "gender": "MALE",
  "createdAt": "2024-03-15T10:00:00Z",
  "scans": [
    {
      "id": "scan-001",
      "result": "PNEUMONIA",
      "confidence": 0.95,
      "createdAt": "2024-04-20T15:00:00Z"
    }
  ]
}
```

### Navigation
```
Click Add Patient ([+])
  → router.push("/patients/create")

Click Patient Card
  → router.push("/patients/[patientId]", { patientId })

Search/Filter
  → Real-time filtering (client-side)

Pull-to-refresh
  → Reload patients from API
```

---

# PART 4: ADMIN FEATURES

## 👨‍💼 Admin - Users

**File:** `app/(tabs)/(admin)/users.tsx`  
**Route:** `/(tabs)/(admin)/users`  
**Auth Required:** ✅ Yes (ADMIN role only)

### Screen Layout
```
┌────────────────────────────────────────────┐
│ Users                                       │
│ [🔍 Search by name or email...]            │
├────────────────────────────────────────────┤
│ ┌──────────────────────────────────────┐   │
│ │ [Avatar] Dr. John Smith       ACTIVE │   │
│ │          john@hospital.com            │   │
│ │          Administrator                │   │
│ │                                       │   │
│ │ [Suspend]  [Delete]                   │   │
│ └──────────────────────────────────────┘   │
│ ┌──────────────────────────────────────┐   │
│ │ [Avatar] Dr. Jane Doe       SUSPENDED│   │
│ │          jane@hospital.com            │   │
│ │          Clinician                    │   │
│ │                                       │   │
│ │ [Activate]  [Delete]                  │   │
│ └──────────────────────────────────────┘   │
└────────────────────────────────────────────┘
```

### API Endpoints

**Endpoint 1: Get All Users**

**Method:** `GET`  
**Endpoint:** `/admin/users`  
**Headers:** `Authorization: Bearer {accessToken}`

#### Response (200 OK)
```json
[
  {
    "id": "user-001",
    "name": "Dr. John Smith",
    "email": "john@hospital.com",
    "role": "ADMIN",
    "isActive": true,
    "createdAt": "2024-01-15T10:00:00Z"
  },
  {
    "id": "user-002",
    "name": "Dr. Jane Doe",
    "email": "jane@hospital.com",
    "role": "CLINICIAN",
    "isActive": false,
    "createdAt": "2024-02-20T10:00:00Z"
  }
]
```

---

**Endpoint 2: Toggle User Status**

**Method:** `PATCH`  
**Endpoint:** `/admin/users/{userId}/status`  
**Headers:** `Authorization: Bearer {accessToken}`

#### Response (200 OK)
```json
{
  "id": "user-002",
  "isActive": true,
  "message": "User activated successfully"
}
```

---

**Endpoint 3: Delete User**

**Method:** `DELETE`  
**Endpoint:** `/admin/users/{userId}`  
**Headers:** `Authorization: Bearer {accessToken}`

#### Response (200 OK)
```json
{
  "message": "User deleted successfully"
}
```

---

## 📊 Admin - All Scans

**File:** `app/(tabs)/(admin)/all-scans.tsx`  
**Route:** `/(tabs)/(admin)/all-scans`  
**Auth Required:** ✅ Yes (ADMIN role only)

### Screen Layout
```
┌────────────────────────────────────────────┐
│ All Scans                                   │
│ [🔍 Search by patient name or ID...]       │
│                                             │
│ All Results ⊡ | Pneumonia | Normal          │
├────────────────────────────────────────────┤
│ Statistics:                                 │
│ Total: 1250  │  Pneumonia: 350  │ Normal: 850
├────────────────────────────────────────────┤
│ ┌──────────────────────────────────────┐   │
│ │ [Thumbnail] Scan-001                 │   │
│ │             Patient: John Doe (P001) │   │
│ │             Result: PNEUMONIA 95%    │   │
│ │             Date: Apr 20, 2024 3:00PM│   │
│ │ [View Details]  [Delete]              │   │
│ └──────────────────────────────────────┘   │
└────────────────────────────────────────────┘
```

### API Endpoints

**Endpoint: Get All Scans**

**Method:** `GET`  
**Endpoint:** `/scans`  
**Headers:** `Authorization: Bearer {accessToken}`

(See History screen section for response format)

---

## 📈 Admin - Analytics

**File:** `app/(tabs)/(admin)/analytics.tsx`  
**Route:** `/(tabs)/(admin)/analytics`  
**Auth Required:** ✅ Yes (ADMIN role only)

### Screen Tabs

**Tab 1: Dashboard**
```
┌────────────────────────────────────────────┐
│ Dashboard ⊡ | Scans | Patients             │
├────────────────────────────────────────────┤
│ Total Scans: 1250      Total Patients: 450 │
│ Pneumonia: 350         Normal: 850         │
│ Accuracy: 94.2%        Avg Confidence: 87.5%
├────────────────────────────────────────────┤
│ Today  │ This Week  │ This Month           │
│ 45     │ 250        │ 850                 │
│ 12     │ 75         │ 300                 │
│ 33     │ 175        │ 550                 │
└────────────────────────────────────────────┘
```

**Tab 2: Scans**
```
Result Breakdown:       Confidence Distribution:
Pneumonia: 350 (29.2%)  Excellent (>90%): 800
Normal: 850 (70.8%)     Good (80-90%): 350
                        Fair (<80%): 100

[Timeline Chart]
```

**Tab 3: Patients**
```
Total Patients: 450
New This Month: 45
With Pneumonia: 120
Avg Scans per Patient: 2.8

Top Patients:
1. John Doe (P001) - 12 scans
2. Jane Smith (P002) - 10 scans
3. Bob Wilson (P003) - 8 scans
```

### API Endpoints

**Endpoint 1: Get Dashboard Metrics**

**Method:** `GET`  
**Endpoint:** `/analytics/dashboard`  
**Headers:** `Authorization: Bearer {accessToken}`

#### Response (200 OK)
```json
{
  "totalScans": 1250,
  "totalPatients": 450,
  "pneumoniaDetected": 350,
  "normalScans": 850,
  "accuracyRate": 94.2,
  "averageConfidence": 87.5,
  "todayMetrics": {
    "scans": 45,
    "pneumonia": 12,
    "normal": 33
  },
  "thisWeekMetrics": {
    "scans": 250,
    "pneumonia": 75,
    "normal": 175
  },
  "thisMonthMetrics": {
    "scans": 850,
    "pneumonia": 300,
    "normal": 550
  },
  "recentScans": [],
  "topPatients": [
    {
      "id": "patient-001",
      "name": "John Doe",
      "scanCount": 12,
      "pneumoniaDetected": 3
    }
  ]
}
```

---

**Endpoint 2: Get Scan Results Stats**

**Method:** `GET`  
**Endpoint:** `/analytics/scans/results`  
**Headers:** `Authorization: Bearer {accessToken}`

(See Dashboard screen section for response format)

---

**Endpoint 3: Get Patient Analytics**

**Method:** `GET`  
**Endpoint:** `/analytics/patients`  
**Headers:** `Authorization: Bearer {accessToken}`

#### Response (200 OK)
```json
{
  "totalPatients": 450,
  "newPatientsThisMonth": 45,
  "patientsWithPneumonia": 120,
  "averageScansPerPatient": 2.8,
  "topPatients": [
    {
      "id": "patient-001",
      "name": "John Doe",
      "idNumber": "P001",
      "scanCount": 12,
      "pneumoniaDetected": 3,
      "lastScanDate": "2024-04-20T15:00:00Z"
    }
  ]
}
```

---

# PART 5: SYSTEM FEATURES

## 🔔 Notifications

**File:** `app/notifications/index.tsx`  
**Route:** `/notifications`  
**Auth Required:** ✅ Yes

### Screen Layout
```
┌────────────────────────────────────────────┐
│ ← Notifications                             │
├────────────────────────────────────────────┤
│ ┌──────────────────────────────────────┐   │
│ │ Scan Complete                    🟘  │   │
│ │ Your scan has been analyzed          │   │
│ │ 2 hours ago                          │   │
│ │ [Mark Read]  [Delete]                │   │
│ └──────────────────────────────────────┘   │
│ ┌──────────────────────────────────────┐   │
│ │ System Update                    ✓   │   │
│ │ New AI model version available       │   │
│ │ 1 day ago                            │   │
│ │ [Mark Unread]  [Delete]              │   │
│ └──────────────────────────────────────┘   │
└────────────────────────────────────────────┘
```

### API Endpoints

**Endpoint 1: Get Notifications**

**Method:** `GET`  
**Endpoint:** `/notifications`  
**Headers:** `Authorization: Bearer {accessToken}`

#### Response (200 OK)
```json
[
  {
    "id": "notif-001",
    "title": "Scan Complete",
    "message": "Your scan has been analyzed",
    "type": "SCAN",
    "read": false,
    "createdAt": "2024-04-20T14:30:00Z"
  }
]
```

---

**Endpoint 2: Update Notification**

**Method:** `PATCH`  
**Endpoint:** `/notifications/{notifId}`  
**Headers:** `Authorization: Bearer {accessToken}`, `Content-Type: application/json`

#### Request Payload
```json
{
  "read": true
}
```

#### Response (200 OK)
```json
{
  "id": "notif-001",
  "read": true,
  "updatedAt": "2024-04-20T16:00:00Z"
}
```

---

**Endpoint 3: Mark All as Read**

**Method:** `POST`  
**Endpoint:** `/notifications/mark-all-read`  
**Headers:** `Authorization: Bearer {accessToken}`

#### Response (200 OK)
```json
{
  "message": "All notifications marked as read"
}
```

---

## 📄 Reports

**File:** `app/report/[scanId].tsx`  
**Route:** `/report/[scanId]`  
**Auth Required:** ✅ Yes

### Report Contents
```
┌────────────────────────────────────────────┐
│         PNEUMODETECT SCAN REPORT            │
├────────────────────────────────────────────┤
│ Patient Information                         │
│ Name: John Doe                              │
│ ID: P001                                    │
│ Age: 45 years                               │
│ Gender: Male                                │
│ Date of Scan: April 20, 2024               │
├────────────────────────────────────────────┤
│ [X-Ray Image]                               │
├────────────────────────────────────────────┤
│ AI Analysis Result                          │
│ Diagnosis: PNEUMONIA                        │
│ Confidence: 95.2%                           │
│ Model Version: v2.1                         │
├────────────────────────────────────────────┤
│ Clinical Notes                              │
│ Consolidation visible in left lobe         │
├────────────────────────────────────────────┤
│ Recommendations                             │
│ • Follow-up consultation recommended       │
│ • Consider further imaging studies         │
│ • Clinical correlation advised             │
├────────────────────────────────────────────┤
│ ⚠️ DISCLAIMER                               │
│ This report is AI-generated and for         │
│ screening purposes only. It must be         │
│ reviewed by a qualified medical             │
│ professional.                               │
├────────────────────────────────────────────┤
│ Generated: April 20, 2024 3:00 PM          │
│ System: PneumoDetect AI v2.1                │
└────────────────────────────────────────────┘

Features:
✅ Download as PDF
✅ Share via email
✅ Print
✅ View on screen
```

---

# PART 6: REFERENCE

## 📊 Complete API Endpoints Table

### Backend Status: ✅ 44/44 Endpoints Complete

| Category | Method | Endpoint | Purpose | Auth | Role |
|----------|--------|----------|---------|------|------|
| **AUTH** | POST | `/auth/login` | User login | ❌ | - |
| | POST | `/auth/register` | User registration | ❌ | - |
| | POST | `/auth/verify-otp` | Verify OTP code | ❌ | - |
| | POST | `/auth/resend-otp` | Resend OTP code | ❌ | - |
| | POST | `/auth/forgot-password` | Password reset | ❌ | - |
| | POST | `/auth/logout` | User logout | ✅ | All |
| **USERS** | GET | `/users/me` | Get current user | ✅ | All |
| | PUT | `/users/profile` | Update profile | ✅ | All |
| | GET | `/users/patient-profile` | Get patient profile | ✅ | PATIENT |
| | PUT | `/users/patient-profile` | Update patient profile | ✅ | PATIENT |
| **PATIENTS** | GET | `/patients` | List patients | ✅ | CLINICIAN |
| | GET | `/patients/{id}` | Get patient | ✅ | CLINICIAN |
| | POST | `/patients` | Create patient | ✅ | CLINICIAN |
| | PUT | `/patients/{id}` | Update patient | ✅ | CLINICIAN |
| | DELETE | `/patients/{id}` | Delete patient | ✅ | CLINICIAN |
| **SCANS** | GET | `/scans` | List scans | ✅ | All |
| | GET | `/scans/{id}` | Get scan | ✅ | All |
| | GET | `/scans/patient/{patientId}` | Patient's scans | ✅ | CLINICIAN |
| | POST | `/scans/upload` | Upload X-ray | ✅ | CLINICIAN |
| | POST | `/scans/{id}/process` | Process scan | ✅ | CLINICIAN |
| | PATCH | `/scans/{id}` | Update scan | ✅ | CLINICIAN |
| | DELETE | `/scans/{id}` | Delete scan | ✅ | ADMIN |
| | GET | `/scans/patient/my-scans/list` | My scans | ✅ | PATIENT |
| | GET | `/scans/patient/{id}/view` | View my scan | ✅ | PATIENT |
| | PATCH | `/scans/patient/{id}/notes` | Add notes | ✅ | PATIENT |
| **ANALYTICS** | GET | `/analytics/stats` | Statistics | ✅ | All |
| | GET | `/analytics/dashboard` | Dashboard | ✅ | ADMIN |
| | GET | `/analytics/scans/results` | Scan results | ✅ | All |
| | GET | `/analytics/patients` | Patient analytics | ✅ | ADMIN |
| | GET | `/analytics/model-performance` | Model metrics | ✅ | ADMIN |
| **NOTIFICATIONS** | GET | `/notifications` | List notifications | ✅ | All |
| | GET | `/notifications/{id}` | Get notification | ✅ | All |
| | PATCH | `/notifications/{id}` | Update notification | ✅ | All |
| | POST | `/notifications/mark-all-read` | Mark all read | ✅ | All |
| | DELETE | `/notifications/{id}` | Delete notification | ✅ | All |
| **ADMIN** | GET | `/admin/users` | List users | ✅ | ADMIN |
| | GET | `/admin/users/{id}` | Get user | ✅ | ADMIN |
| | PATCH | `/admin/users/{id}/status` | Toggle status | ✅ | ADMIN |
| | DELETE | `/admin/users/{id}` | Delete user | ✅ | ADMIN |
| **ACTIVITY** | GET | `/users/activity` | User activity | ✅ | All |
| | GET | `/users/activity/login` | Login history | ✅ | All |

---

## 🚨 Error Handling

### Standard Error Response Format

```json
{
  "statusCode": 400,
  "message": "User-friendly error message",
  "error": "Technical error details"
}
```

### Common Error Codes

| Code | Error | Meaning | Action |
|------|-------|---------|--------|
| 400 | Bad Request | Invalid input | Check validation |
| 401 | Unauthorized | Not authenticated | Login required |
| 403 | Forbidden | No permission | Check role access |
| 404 | Not Found | Resource missing | Check ID |
| 409 | Conflict | Duplicate resource | Use existing |
| 429 | Too Many Requests | Rate limited | Wait before retry |
| 500 | Internal Error | Server error | Retry or contact support |

### Frontend Error Handling Pattern

```typescript
try {
  const response = await api.post(endpoint, payload);
  showToast.success("Operation successful!");
  // Handle response
} catch (error) {
  const errorMsg = getErrorMessage(error);
  showToast.error(errorMsg);
  // Log and handle error
}
```

---

## 📋 Response Format Standards

### Success Response
```json
{
  "data": { },      // Response data
  "message": "Success",
  "error": null
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Error message for user",
  "error": "Technical error details"
}
```

### Headers
```
Content-Type: application/json
Authorization: Bearer {accessToken}
```

### Authentication
```
All endpoints except /auth/* require:
Authorization: Bearer {JWT_TOKEN}

JWT Token obtained from:
- POST /auth/login
- POST /auth/register
- POST /auth/verify-otp

Token stored in secure storage:
- iOS: Keychain
- Android: Keystore
```

---

## 🔐 Security

### Authentication Flow
```
1. User submits credentials
2. Backend validates and returns JWT
3. Token stored securely
4. Token attached to all subsequent requests
5. Backend validates token signature
6. On 401: Clear token and redirect to login
7. User can logout to invalidate session
```

### Data Sensitivity
```
✅ Passwords: Hashed with bcrypt
✅ Tokens: Signed JWT with expiration
✅ Medical Data: Encrypted at rest
✅ HIPAA: Compliance measures in place
✅ HTTPS: All communication encrypted
```

---

## 🎯 Implementation Checklist

### Authentication ✅
- [x] Login screen
- [x] Signup with role selection
- [x] OTP verification
- [x] Forgot password
- [x] All endpoints implemented
- [x] Token management
- [x] Error handling

### Dashboard ✅
- [x] Statistics display
- [x] Charts and visualizations
- [x] System status
- [x] Recent scans
- [x] Notification badge
- [x] All endpoints implemented

### Scan Workflow ✅
- [x] Upload screen (image selection)
- [x] Patient info screen (selection/creation)
- [x] Processing screen (real-time progress)
- [x] Results display
- [x] Heatmap visualization
- [x] All endpoints implemented

### Other Features ✅
- [x] History/records
- [x] Profile management
- [x] Patient management
- [x] Admin dashboards
- [x] Notifications
- [x] Reports
- [x] All endpoints implemented

---

**Last Updated:** April 20, 2026  
**Status:** ✅ Production Ready  
**Version:** 2.0  
**Total Endpoints:** 44 ✅ All Implemented
