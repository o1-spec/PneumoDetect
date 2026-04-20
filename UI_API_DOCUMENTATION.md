# PneumoDetect - UI & API Response Documentation

Complete mapping of all UI screens with their corresponding API requests and expected responses.

---

## Table of Contents

1. [Authentication Flow](#authentication-flow)
2. [Onboarding & Setup](#onboarding--setup)
3. [Dashboard (Main Screen)](#dashboard-main-screen)
4. [Scan Upload & Analysis](#scan-upload--analysis)
5. [Scan Details & Results](#scan-details--results)
6. [Patient Management](#patient-management)
7. [Profile & Settings](#profile--settings)
8. [Admin Features](#admin-features)
9. [Notifications](#notifications)

---

## Authentication Flow

### 1. Login Screen

**Route:** `/(auth)/login`

**UI Layout:**

```
┌─────────────────────────────┐
│    PneumoDetect Logo        │
│                             │
│  Email Input Field          │
│  Password Input Field       │
│  [Show/Hide Password]       │
│  [Sign In Button]           │
│  [Forgot Password Link]     │
│  [Sign Up Link]             │
│                             │
│  Errors if validation fails │
└─────────────────────────────┘
```

**API Call:**

```
POST /auth/login
Content-Type: application/json

{
  "email": "doctor@example.com",
  "password": "password123"
}
```

**Expected Response (200 OK):**

```json
{
  "id": "user_123",
  "email": "doctor@example.com",
  "name": "Dr. John Doe",
  "role": "CLINICIAN",
  "specialization": "Pulmonology",
  "phone": "+1234567890",
  "avatarUrl": "https://...",
  "isVerified": true,
  "isActive": true,
  "createdAt": "2026-01-15T10:30:00Z",
  "updatedAt": "2026-04-20T14:22:00Z",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401 Unauthorized):**

```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

---

### 2. Signup Screen

**Route:** `/(auth)/signup`

**UI Layout:**

```
┌─────────────────────────────┐
│    Create Account           │
│                             │
│  [Back Button]              │
│                             │
│  Email Input                │
│  Full Name Input            │
│  [CLINICIAN / PATIENT]      │
│                             │
│  IF CLINICIAN:              │
│  ├─ Specialization Picker   │
│  ├─ Phone Input             │
│  └─ Medical History         │
│                             │
│  IF PATIENT:                │
│  ├─ Date of Birth Picker    │
│  ├─ Gender Dropdown         │
│  └─ Blood Type              │
│                             │
│  Password Input             │
│  Confirm Password Input     │
│  [Create Account Button]    │
│  [Sign In Link]             │
└─────────────────────────────┘
```

**API Call:**

```
POST /auth/register
Content-Type: application/json

{
  "email": "patient@example.com",
  "name": "Jane Smith",
  "password": "securePassword123",
  "role": "PATIENT",
  "phone": "+1234567890",
  "dateOfBirth": "1990-05-15",
  "gender": "FEMALE",
  "medicalHistory": "No known allergies"
}
```

**Expected Response (201 Created):**

```json
{
  "id": "user_456",
  "email": "patient@example.com",
  "name": "Jane Smith",
  "role": "PATIENT",
  "phone": "+1234567890",
  "dateOfBirth": "1990-05-15",
  "gender": "FEMALE",
  "medicalHistory": "No known allergies",
  "avatarUrl": null,
  "isVerified": false,
  "isActive": true,
  "createdAt": "2026-04-20T10:00:00Z",
  "updatedAt": "2026-04-20T10:00:00Z",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 3. OTP Verification Screen

**Route:** `/(auth)/otp-verification`

**UI Layout:**

```
┌─────────────────────────────┐
│    Verify Your Email        │
│                             │
│  "We sent a code to"        │
│  "your-email@example.com"   │
│                             │
│  [OTP Input Fields] ⬜⬜⬜⬜⬜⬜  │
│                             │
│  [Verify Button]            │
│  [Resend Code Button]       │
│  [Change Email Link]        │
└─────────────────────────────┘
```

**API Call:**

```
POST /auth/verify-otp
Content-Type: application/json

{
  "email": "patient@example.com",
  "otp": "123456"
}
```

**Expected Response (200 OK):**

```json
{
  "verified": true,
  "message": "Email verified successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Onboarding & Setup

### 4. Onboarding Screen

**Route:** `/(onboarding)/index`

**UI Layout:**

```
┌─────────────────────────────┐
│                             │
│  [Step 1/3 - Complete]      │
│                             │
│  ✓ Create Account           │
│  → Setup Profile            │
│     Grant Permissions       │
│                             │
│  [Next Button]              │
│  [Skip Button]              │
└─────────────────────────────┘
```

**No API call** - Client-side flow

---

## Dashboard (Main Screen)

### 5. Dashboard / Home Screen

**Route:** `/(tabs)/index`

**UI Layout:**

```
┌─────────────────────────────┐
│  Dashboard  [🔔 Notification]│
│  Track your scans           │
│                             │
│  Welcome back, Dr. John     │
│  [👨‍⚕️ Medical Icon]           │
│                             │
│  ┌─ Quick Actions ────────┐ │
│  │ [+ New] [📋 History]   │ │
│  │ [📊 Analytics] [👥 Users]│ │
│  └─────────────────────────┘ │
│                             │
│  ┌─ Overview ─────────────┐ │
│  │ 📄 Total: 104          │ │
│  │ ❌ Failed: 12          │ │
│  │ ✅ Completed: 92       │ │
│  │ ⏳ Processing: 8       │ │
│  └─────────────────────────┘ │
│                             │
│  ┌─ Weekly Activity ───────┐ │
│  │  [Line Chart]           │ │
│  │  Scans per day          │ │
│  │  ↑ 12.5% vs last week   │ │
│  └─────────────────────────┘ │
│                             │
│  ┌─ Recent Scans ─────────┐ │
│  │ Scan ID: [Result]       │ │
│  │ Patient: Jane Smith     │ │
│  │ Confidence: 94%         │ │
│  │ Date: Apr 20, 2026      │ │
│  └─────────────────────────┘ │
│                             │
│  ┌─ System Status ─────────┐ │
│  │ 🟢 AI Model: Running    │ │
│  │ 🟢 Database: Connected  │ │
│  │ 🟢 Storage: 78% Used    │ │
│  └─────────────────────────┘ │
└─────────────────────────────┘
```

**API Calls (Parallel with error handling):**

#### 5.1 Get Analytics Stats

```
GET /analytics/stats
Authorization: Bearer {accessToken}
```

**Expected Response (200 OK):**

```json
{
  "totalScans": 104,
  "completedScans": 92,
  "failedScans": 12,
  "processingScans": 8,
  "totalPneumoniaCases": 45,
  "totalNormalCases": 59,
  "averageConfidence": 0.87
}
```

#### 5.2 Get Scan Results Timeline

```
GET /analytics/scans/results?groupBy=day&dateFrom=2026-04-14&dateTo=2026-04-20
Authorization: Bearer {accessToken}
```

**Expected Response (200 OK):**

```json
{
  "resultBreakdown": {
    "pneumonia": 45,
    "normal": 59,
    "pneumoniaPercentage": 43.27,
    "normalPercentage": 56.73
  },
  "confidenceDistribution": {
    "excellent": 78,
    "good": 20,
    "fair": 6
  },
  "timelineData": [
    {
      "date": "2026-04-14",
      "scans": 11,
      "pneumonia": 4,
      "normal": 7,
      "averageConfidence": 0.86
    },
    {
      "date": "2026-04-15",
      "scans": 15,
      "pneumonia": 6,
      "normal": 9,
      "averageConfidence": 0.88
    },
    {
      "date": "2026-04-16",
      "scans": 18,
      "pneumonia": 8,
      "normal": 10,
      "averageConfidence": 0.89
    },
    {
      "date": "2026-04-17",
      "scans": 14,
      "pneumonia": 5,
      "normal": 9,
      "averageConfidence": 0.85
    },
    {
      "date": "2026-04-18",
      "scans": 20,
      "pneumonia": 9,
      "normal": 11,
      "averageConfidence": 0.9
    },
    {
      "date": "2026-04-19",
      "scans": 16,
      "pneumonia": 7,
      "normal": 9,
      "averageConfidence": 0.88
    },
    {
      "date": "2026-04-20",
      "scans": 10,
      "pneumonia": 4,
      "normal": 6,
      "averageConfidence": 0.87
    }
  ],
  "totalScans": 104,
  "averageConfidence": 0.87
}
```

#### 5.3 Get All Scans

```
GET /scans
Authorization: Bearer {accessToken}
```

**Expected Response (200 OK):**

```json
[
  {
    "id": "scan_001",
    "imageUrl": "https://storage.example.com/scan_001.jpg",
    "heatmapUrl": "https://storage.example.com/scan_001_heatmap.jpg",
    "status": "COMPLETED",
    "result": "PNEUMONIA",
    "confidence": 0.94,
    "modelVersion": "v1.2.3",
    "createdAt": "2026-04-20T14:30:00Z",
    "updatedAt": "2026-04-20T14:35:00Z",
    "analyzedAt": "2026-04-20T14:35:00Z",
    "patientId": "patient_123",
    "clinicianId": "user_123",
    "patient": {
      "id": "patient_123",
      "idNumber": "P001",
      "name": "Jane Smith",
      "age": 35,
      "gender": "FEMALE"
    },
    "clinician": {
      "id": "user_123",
      "name": "Dr. John Doe",
      "specialization": "Pulmonology"
    },
    "clinicianNotes": "Shows signs of bacterial pneumonia"
  },
  {
    "id": "scan_002",
    "imageUrl": "https://storage.example.com/scan_002.jpg",
    "status": "COMPLETED",
    "result": "NORMAL",
    "confidence": 0.91,
    "modelVersion": "v1.2.3",
    "createdAt": "2026-04-20T13:00:00Z",
    "analyzedAt": "2026-04-20T13:05:00Z",
    "patientId": "patient_124",
    "clinicianId": "user_123",
    "patient": {
      "id": "patient_124",
      "name": "John Johnson",
      "age": 42,
      "gender": "MALE"
    }
  },
  {
    "id": "scan_003",
    "imageUrl": "https://storage.example.com/scan_003.jpg",
    "status": "PROCESSING",
    "createdAt": "2026-04-20T14:50:00Z",
    "patientId": "patient_125"
  }
]
```

#### 5.4 Get Notifications

```
GET /notifications
Authorization: Bearer {accessToken}
```

**Expected Response (200 OK):**

```json
[
  {
    "id": "notif_001",
    "title": "Scan Complete",
    "message": "Scan for patient Jane Smith has completed",
    "type": "SCAN",
    "read": false,
    "createdAt": "2026-04-20T14:35:00Z",
    "updatedAt": "2026-04-20T14:35:00Z",
    "userId": "user_123"
  },
  {
    "id": "notif_002",
    "title": "System Update",
    "message": "AI Model updated to v1.2.3",
    "type": "SYSTEM",
    "read": true,
    "createdAt": "2026-04-20T10:00:00Z",
    "userId": "user_123"
  }
]
```

#### 5.5 Get System Status

```
GET /dashboard/system-status
Authorization: Bearer {accessToken}
```

**Expected Response (200 OK):**

```json
{
  "aiModel": "Operational",
  "database": "Connected",
  "storage": "78% Used"
}
```

---

## Scan Upload & Analysis

### 6. Upload Scan Screen

**Route:** `/analysis/upload`

**UI Layout:**

```
┌─────────────────────────────┐
│    Upload Scan              │
│    [Back]                   │
│                             │
│  ┌─────────────────────────┐│
│  │  [Selected Image]        ││
│  │  or                      ││
│  │  No Image Selected       ││
│  └─────────────────────────┘│
│                             │
│  [📷 Take Photo]            │
│  [📁 Choose from Library]   │
│                             │
│  Patient ID/Name Input      │
│  Notes Input (Optional)     │
│                             │
│  [Upload & Analyze Button]  │
│  [Cancel]                   │
└─────────────────────────────┘
```

**API Call (Multipart Form Data):**

```
POST /scans/upload
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

{
  "image": <binary_image_data>,
  "patientId": "patient_123",
  "notes": "Follow-up scan after treatment"
}
```

**Expected Response (201 Created):**

```json
{
  "id": "scan_new_001",
  "imageUrl": "https://storage.example.com/scan_new_001.jpg",
  "status": "PROCESSING",
  "createdAt": "2026-04-20T15:00:00Z",
  "updatedAt": "2026-04-20T15:00:00Z",
  "patientId": "patient_123",
  "clinicianId": "user_123",
  "message": "Scan uploaded successfully. Processing started."
}
```

---

### 7. Processing Screen

**Route:** `/analysis/processing`

**UI Layout:**

```
┌─────────────────────────────┐
│    Processing Scan          │
│                             │
│  🔄 Loading animation       │
│                             │
│  Analyzing chest X-ray...   │
│  Please wait                │
│                             │
│  Progress: [====>   ] 65%   │
│                             │
│  Estimated time: 30 seconds │
│                             │
│  [Cancel Button]            │
└─────────────────────────────┘
```

**Polling API Call (every 2-3 seconds):**

```
GET /scans/{scanId}
Authorization: Bearer {accessToken}
```

**Expected Response While Processing (200 OK):**

```json
{
  "id": "scan_new_001",
  "status": "PROCESSING",
  "createdAt": "2026-04-20T15:00:00Z",
  "updatedAt": "2026-04-20T15:02:30Z"
}
```

**Expected Response After Completion (200 OK):**

```json
{
  "id": "scan_new_001",
  "imageUrl": "https://storage.example.com/scan_new_001.jpg",
  "heatmapUrl": "https://storage.example.com/scan_new_001_heatmap.jpg",
  "status": "COMPLETED",
  "result": "PNEUMONIA",
  "confidence": 0.92,
  "modelVersion": "v1.2.3",
  "createdAt": "2026-04-20T15:00:00Z",
  "updatedAt": "2026-04-20T15:03:00Z",
  "analyzedAt": "2026-04-20T15:03:00Z",
  "patientId": "patient_123",
  "clinicianId": "user_123"
}
```

---

## Scan Details & Results

### 8. Scan Results Screen

**Route:** `/analysis/results/[scanId]`

**UI Layout:**

```
┌─────────────────────────────┐
│    Scan Results             │
│    [Back]  [Share] [Save]   │
│                             │
│  ┌─ Chest X-ray ──────────┐ │
│  │  [Image Display]        │ │
│  │  Original                │ │
│  └─────────────────────────┘ │
│                             │
│  ┌─ Analysis Result ───────┐ │
│  │  🔴 PNEUMONIA DETECTED  │ │
│  │  Confidence: 92%        │ │
│  │                         │ │
│  │  Model: v1.2.3          │ │
│  │  Analyzed: Apr 20, 3:03 │ │
│  └─────────────────────────┘ │
│                             │
│  ┌─ AI Heatmap ───────────┐ │
│  │  [Heatmap Image]        │ │
│  │  Shows affected areas   │ │
│  └─────────────────────────┘ │
│                             │
│  ┌─ Patient Info ─────────┐ │
│  │  Name: Jane Smith       │ │
│  │  ID: P001               │ │
│  │  Age: 35, Female        │ │
│  └─────────────────────────┘ │
│                             │
│  [Explainable AI] [📋 Full Report]
│  [Edit Notes]  [Approve]   │
└─────────────────────────────┘
```

**API Call (Already fetched, can use cached data):**

```
GET /scans/{scanId}
Authorization: Bearer {accessToken}
```

**Response:** (See Processing Screen completed response)

### 9. Explainable AI Screen

**Route:** `/analysis/results/explainable`

**UI Layout:**

```
┌─────────────────────────────┐
│    AI Explanation           │
│    [Back]                   │
│                             │
│  How the AI decided:        │
│                             │
│  ┌─ Visual Features ───────┐ │
│  │ • Opacity patterns      │ │
│  │ • Air-space consolidation│ │
│  │ • Infiltrate borders    │ │
│  │ • Distribution pattern  │ │
│  └─────────────────────────┘ │
│                             │
│  ┌─ Contributing Factors ──┐ │
│  │ Feature 1: 45% impact   │ │
│  │ Feature 2: 30% impact   │ │
│  │ Feature 3: 25% impact   │ │
│  └─────────────────────────┘ │
│                             │
│  Confidence Breakdown:       │
│  Pneumonia: 92%             │
│  Normal: 8%                 │
└─────────────────────────────┘
```

**API Call:**

```
GET /scans/{scanId}/explainability
Authorization: Bearer {accessToken}
```

**Expected Response (200 OK):**

```json
{
  "scanId": "scan_001",
  "result": "PNEUMONIA",
  "confidence": 0.92,
  "explanation": {
    "visualFeatures": [
      "Opacity patterns in lower lobes",
      "Air-space consolidation detected",
      "Infiltrate with irregular borders",
      "Bilateral distribution of infiltrates"
    ],
    "contributingFactors": [
      {
        "feature": "Consolidation area",
        "impact": 0.45,
        "description": "Large consolidated areas detected"
      },
      {
        "feature": "Air bronchogram sign",
        "impact": 0.3,
        "description": "Air-filled bronchi within opacities"
      },
      {
        "feature": "Distribution pattern",
        "impact": 0.25,
        "description": "Bilateral lower lobe distribution"
      }
    ],
    "confidenceBreakdown": {
      "pneumonia": 0.92,
      "normal": 0.08
    }
  }
}
```

### 10. Scan Report Screen

**Route:** `/report/[scanId]`

**UI Layout:**

```
┌─────────────────────────────┐
│    Medical Report           │
│    [Back] [Print] [Share]   │
│                             │
│  ┌─ Report Header ────────┐ │
│  │ PneumoDetect Report     │ │
│  │ Date: Apr 20, 2026      │ │
│  │ ID: scan_001            │ │
│  └─────────────────────────┘ │
│                             │
│  ┌─ Patient Information ──┐ │
│  │ Name: Jane Smith        │ │
│  │ ID: P001                │ │
│  │ Age: 35 years, Female   │ │
│  │ DOB: May 15, 1990       │ │
│  └─────────────────────────┘ │
│                             │
│  ┌─ Clinical Findings ────┐ │
│  │ PNEUMONIA DETECTED      │ │
│  │ High Confidence: 92%    │ │
│  │                         │ │
│  │ Findings:               │ │
│  │ • Bilateral infiltrates │ │
│  │ • Consolidation present │ │
│  │ • Air bronchogram signs │ │
│  └─────────────────────────┘ │
│                             │
│  ┌─ Recommendations ──────┐ │
│  │ • Recommend antibiotics │ │
│  │ • Follow-up after 1 week│ │
│  │ • Monitor respiratory   │ │
│  └─────────────────────────┘ │
│                             │
│  [Clinician Notes Section]  │
│  [Download PDF] [Print]     │
└─────────────────────────────┘
```

**API Call:**

```
GET /reports/{scanId}
Authorization: Bearer {accessToken}
```

**Expected Response (200 OK):**

```json
{
  "id": "report_001",
  "scanId": "scan_001",
  "clinicianId": "user_123",
  "patientId": "patient_123",
  "title": "Chest X-ray Analysis Report",
  "findings": {
    "diagnosis": "PNEUMONIA",
    "confidence": 0.92,
    "affectedAreas": ["Lower right lobe", "Lower left lobe"],
    "severity": "MODERATE"
  },
  "recommendations": [
    "Start antibiotic therapy",
    "Follow-up imaging in 1 week",
    "Monitor vital signs"
  ],
  "clinicianNotes": "Patient presented with fever and cough for 3 days",
  "status": "COMPLETED",
  "createdAt": "2026-04-20T15:03:00Z",
  "updatedAt": "2026-04-20T15:03:00Z"
}
```

---

## Patient Management

### 11. Patient List Screen

**Route:** `/(patient)/index` or `/patients`

**UI Layout:**

```
┌─────────────────────────────┐
│    Patients                 │
│    [Back]  [+ Add Patient]  │
│                             │
│  Search: [Search field]     │
│  Filter: [MALE] [FEMALE]    │
│                             │
│  Patient List:              │
│  ┌─ Jane Smith ───────────┐ │
│  │ ID: P001                │ │
│  │ Scans: 5 | Last: Today  │ │
│  │ Pneumonia cases: 2      │ │
│  └─────────────────────────┘ │
│                             │
│  ┌─ John Johnson ─────────┐ │
│  │ ID: P002                │ │
│  │ Scans: 3 | Last: 2 days │ │
│  │ Pneumonia cases: 1      │ │
│  └─────────────────────────┘ │
│                             │
│  [Load More...]             │
└─────────────────────────────┘
```

**API Call:**

```
GET /patients?skip=0&limit=20&search=&gender=
Authorization: Bearer {accessToken}
```

**Expected Response (200 OK):**

```json
[
  {
    "id": "patient_123",
    "idNumber": "P001",
    "name": "Jane Smith",
    "age": 35,
    "gender": "FEMALE",
    "createdAt": "2026-02-01T10:00:00Z",
    "updatedAt": "2026-04-20T14:30:00Z",
    "scans": [
      {
        "id": "scan_001",
        "result": "PNEUMONIA",
        "confidence": 0.92,
        "createdAt": "2026-04-20T14:30:00Z"
      },
      {
        "id": "scan_002",
        "result": "NORMAL",
        "confidence": 0.91,
        "createdAt": "2026-04-15T10:00:00Z"
      }
    ]
  },
  {
    "id": "patient_124",
    "idNumber": "P002",
    "name": "John Johnson",
    "age": 42,
    "gender": "MALE",
    "createdAt": "2026-03-15T09:00:00Z",
    "scans": [
      {
        "id": "scan_003",
        "result": "NORMAL",
        "confidence": 0.89,
        "createdAt": "2026-04-18T11:00:00Z"
      }
    ]
  }
]
```

### 12. Patient Detail Screen

**Route:** `/patients/[patientId]`

**UI Layout:**

```
┌─────────────────────────────┐
│    Jane Smith               │
│    [Back]  [Edit] [Delete]  │
│                             │
│  ┌─ Demographics ─────────┐ │
│  │ ID: P001                │ │
│  │ Age: 35 years           │ │
│  │ Gender: Female          │ │
│  │ DOB: May 15, 1990       │ │
│  │ Registered: Feb 1, 2026 │ │
│  └─────────────────────────┘ │
│                             │
│  ┌─ Scan History ─────────┐ │
│  │ Total Scans: 5          │ │
│  │ Pneumonia: 2            │ │
│  │ Normal: 3               │ │
│  │                         │ │
│  │ [Scan 1] - PNEUMONIA 92%│ │
│  │ [Scan 2] - NORMAL 91%   │ │
│  │ [View All Scans]        │ │
│  └─────────────────────────┘ │
│                             │
│  [Upload Scan] [Print Record]
└─────────────────────────────┘
```

**API Call:**

```
GET /patients/{patientId}
Authorization: Bearer {accessToken}
```

**Expected Response (200 OK):**

```json
{
  "id": "patient_123",
  "idNumber": "P001",
  "name": "Jane Smith",
  "age": 35,
  "gender": "FEMALE",
  "createdAt": "2026-02-01T10:00:00Z",
  "updatedAt": "2026-04-20T14:30:00Z",
  "scans": [
    {
      "id": "scan_001",
      "status": "COMPLETED",
      "result": "PNEUMONIA",
      "confidence": 0.92,
      "createdAt": "2026-04-20T14:30:00Z"
    },
    {
      "id": "scan_002",
      "status": "COMPLETED",
      "result": "NORMAL",
      "confidence": 0.91,
      "createdAt": "2026-04-15T10:00:00Z"
    },
    {
      "id": "scan_003",
      "status": "COMPLETED",
      "result": "NORMAL",
      "confidence": 0.88,
      "createdAt": "2026-04-10T15:00:00Z"
    },
    {
      "id": "scan_004",
      "status": "COMPLETED",
      "result": "PNEUMONIA",
      "confidence": 0.85,
      "createdAt": "2026-04-05T12:00:00Z"
    },
    {
      "id": "scan_005",
      "status": "COMPLETED",
      "result": "NORMAL",
      "confidence": 0.9,
      "createdAt": "2026-03-28T09:00:00Z"
    }
  ]
}
```

### 13. Create Patient Screen

**Route:** `/patients/create`

**UI Layout:**

```
┌─────────────────────────────┐
│    New Patient              │
│    [Back]                   │
│                             │
│  ID Number Input            │
│  Full Name Input            │
│  Age Input                  │
│  Gender Dropdown            │
│                             │
│  [Save Patient] [Cancel]    │
└─────────────────────────────┘
```

**API Call:**

```
POST /patients
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "idNumber": "P001",
  "name": "Jane Smith",
  "age": 35,
  "gender": "FEMALE"
}
```

**Expected Response (201 Created):**

```json
{
  "id": "patient_123",
  "idNumber": "P001",
  "name": "Jane Smith",
  "age": 35,
  "gender": "FEMALE",
  "createdAt": "2026-04-20T15:00:00Z",
  "updatedAt": "2026-04-20T15:00:00Z"
}
```

---

## Profile & Settings

### 14. Profile Screen

**Route:** `/(tabs)/profile`

**UI Layout:**

```
┌─────────────────────────────┐
│    Profile                  │
│                             │
│  ┌─ Avatar ───────────────┐ │
│  │  [Profile Picture]      │ │
│  │  [Edit Avatar]          │ │
│  └─────────────────────────┘ │
│                             │
│  Name: Dr. John Doe         │
│  Email: doctor@example.com  │
│  Role: Clinician            │
│  Specialization: Pulmonology│
│  Phone: +1234567890         │
│                             │
│  [Edit Profile]             │
│  [Change Password]          │
│                             │
│  ┌─ Menu ──────────────────┐ │
│  │ [⚙️ Settings]            │ │
│  │ [🔒 Privacy & Security]  │ │
│  │ [ℹ️ About]               │ │
│  │ [💬 Help Center]         │ │
│  │ [🔔 Notifications]       │ │
│  │ [📞 Contact Support]     │ │
│  │ [🚪 Logout]              │ │
│  └─────────────────────────┘ │
└─────────────────────────────┘
```

**API Call:**

```
GET /users/me
Authorization: Bearer {accessToken}
```

**Expected Response (200 OK):**

```json
{
  "id": "user_123",
  "email": "doctor@example.com",
  "name": "Dr. John Doe",
  "role": "CLINICIAN",
  "specialization": "Pulmonology",
  "phone": "+1234567890",
  "avatarUrl": "https://storage.example.com/avatar_123.jpg",
  "isVerified": true,
  "isActive": true,
  "createdAt": "2026-01-15T10:30:00Z",
  "updatedAt": "2026-04-20T14:22:00Z"
}
```

### 15. Edit Profile Screen

**Route:** `/profile/edit` (if exists) or modal on profile

**API Call (PUT):**

```
PUT /users/profile
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "Dr. John Doe",
  "phone": "+1234567890",
  "specialization": "Pulmonology",
  "avatarUrl": "https://storage.example.com/avatar_new.jpg"
}
```

**Expected Response (200 OK):**

```json
{
  "id": "user_123",
  "email": "doctor@example.com",
  "name": "Dr. John Doe",
  "role": "CLINICIAN",
  "specialization": "Pulmonology",
  "phone": "+1234567890",
  "avatarUrl": "https://storage.example.com/avatar_new.jpg",
  "isVerified": true,
  "isActive": true,
  "createdAt": "2026-01-15T10:30:00Z",
  "updatedAt": "2026-04-20T15:00:00Z"
}
```

### 16. Notifications Settings Screen

**Route:** `/profile/notifications`

**UI Layout:**

```
┌─────────────────────────────┐
│    Notification Settings    │
│    [Back]                   │
│                             │
│  ┌─ Push Notifications ───┐ │
│  │ ☑ Scan Results         │ │
│  │ ☑ System Alerts        │ │
│  │ ☑ Patient Updates      │ │
│  └─────────────────────────┘ │
│                             │
│  ┌─ Email Notifications ──┐ │
│  │ ☑ Daily Summary        │ │
│  │ ☑ Critical Alerts      │ │
│  │ ☑ Weekly Report        │ │
│  └─────────────────────────┘ │
│                             │
│  [Save Preferences]         │
└─────────────────────────────┘
```

**API Call (PUT):**

```
PUT /users/preferences
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "notifications": {
    "pushEnabled": true,
    "emailEnabled": true,
    "scanResults": true,
    "systemAlerts": true,
    "dailySummary": true
  }
}
```

### 17. Help Center Screen

**Route:** `/profile/help-center`

**UI Layout:**

```
┌─────────────────────────────┐
│    Help Center              │
│    [Back]                   │
│                             │
│  Search: [Search FAQ]       │
│                             │
│  ┌─ Getting Started ──────┐ │
│  │ How to upload a scan?   │ │
│  │ Understanding results   │ │
│  │ Managing patients       │ │
│  └─────────────────────────┘ │
│                             │
│  ┌─ Troubleshooting ──────┐ │
│  │ Scan processing failed  │ │
│  │ Login issues            │ │
│  │ App crashes             │ │
│  └─────────────────────────┘ │
│                             │
│  [Contact Support Button]   │
│  [FAQ Link]                 │
│  [Email: support@...]       │
└─────────────────────────────┘
```

**No API call** - Static content

### 18. Logout

**API Call:**

```
POST /auth/logout
Authorization: Bearer {accessToken}
```

**Expected Response (200 OK):**

```json
{
  "message": "Logged out successfully"
}
```

---

## Admin Features

### 19. Users Management Screen

**Route:** `/(tabs)/(admin)/users` (Only visible when `isAdmin === true`)

**UI Layout:**

```
┌─────────────────────────────┐
│    User Management          │
│    [Back]  [+ Add User]     │
│                             │
│  Search: [Search users]     │
│  Filter: [ADMIN] [CLINICIAN]│
│                             │
│  User List:                 │
│  ┌─ Dr. John Doe ────────┐ │
│  │ Role: Clinician         │ │
│  │ Email: doctor@...       │ │
│  │ Status: Active          │ │
│  │ Specialization: Pulmon  │ │
│  │ [Suspend] [Delete]      │ │
│  └─────────────────────────┘ │
│                             │
│  ┌─ Jane Admin ───────────┐ │
│  │ Role: Admin             │ │
│  │ Email: admin@...        │ │
│  │ Status: Active          │ │
│  │ [Suspend] [Delete]      │ │
│  └─────────────────────────┘ │
│                             │
│  [Load More...]             │
└─────────────────────────────┘
```

**API Call:**

```
GET /admin/users?skip=0&limit=20
Authorization: Bearer {accessToken}
```

**Expected Response (200 OK):**

```json
[
  {
    "id": "user_123",
    "email": "doctor@example.com",
    "name": "Dr. John Doe",
    "role": "CLINICIAN",
    "specialization": "Pulmonology",
    "isActive": true,
    "createdAt": "2026-01-15T10:30:00Z",
    "updatedAt": "2026-04-20T14:22:00Z"
  },
  {
    "id": "user_admin_001",
    "email": "admin@example.com",
    "name": "Jane Admin",
    "role": "ADMIN",
    "isActive": true,
    "createdAt": "2026-01-01T10:00:00Z",
    "updatedAt": "2026-04-20T10:00:00Z"
  }
]
```

### 20. Analytics Screen

**Route:** `/(tabs)/(admin)/all-scans` or `/(tabs)/(admin)/analytics`

**UI Layout:**

```
┌─────────────────────────────┐
│    Analytics                │
│    [Back]                   │
│                             │
│  ┌─ Key Metrics ──────────┐ │
│  │ Total Scans: 1,204      │ │
│  │ Pneumonia Rate: 43.2%   │ │
│  │ Avg Confidence: 0.89    │ │
│  │ Active Clinicians: 12   │ │
│  └─────────────────────────┘ │
│                             │
│  ┌─ Trends ───────────────┐ │
│  │ [Chart - Scans/Day]     │ │
│  │ [Chart - Results Dist]  │ │
│  │ [Chart - Confidence]    │ │
│  └─────────────────────────┘ │
│                             │
│  Date Range: [From] - [To]  │
│  [Export Report]            │
└─────────────────────────────┘
```

**API Call:**

```
GET /analytics/stats
Authorization: Bearer {accessToken}
```

**Expected Response:** (See Dashboard - Analytics Stats)

---

## Notifications

### 21. Notifications Center Screen

**Route:** `/notifications`

**UI Layout:**

```
┌─────────────────────────────┐
│    Notifications            │
│    [Back]  [Mark All Read]  │
│                             │
│  ┌─ Unread (3) ──────────┐ │
│  │ [New] Scan completed   │ │
│  │ Patient: Jane Smith    │ │
│  │ Result: Pneumonia 92%  │ │
│  │ 2 minutes ago          │ │
│  │ [Mark Read] [Delete]   │ │
│  └─────────────────────────┘ │
│                             │
│  ┌─ [New] System Update ──┐ │
│  │ AI Model v1.2.3 ready  │ │
│  │ 5 minutes ago          │ │
│  │ [Mark Read] [Delete]   │ │
│  └─────────────────────────┘ │
│                             │
│  ┌─ Read (12) ────────────┐ │
│  │ [Old] Scan processed   │ │
│  │ Yesterday at 3:45 PM   │ │
│  │ [Delete]               │ │
│  └─────────────────────────┘ │
└─────────────────────────────┘
```

**API Calls:**

#### Get All Notifications

```
GET /notifications
Authorization: Bearer {accessToken}
```

**Expected Response:** (See Dashboard - Notifications)

#### Mark as Read

```
PATCH /notifications/{notificationId}
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "read": true
}
```

**Expected Response (200 OK):**

```json
{
  "id": "notif_001",
  "title": "Scan Complete",
  "message": "Scan for patient Jane Smith has completed",
  "type": "SCAN",
  "read": true,
  "createdAt": "2026-04-20T14:35:00Z",
  "updatedAt": "2026-04-20T15:00:00Z",
  "userId": "user_123"
}
```

---

## Error Responses

### Common Error Codes

**400 Bad Request**

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email format",
    "password": "Password must be at least 8 characters"
  }
}
```

**401 Unauthorized**

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Invalid or expired token"
}
```

**403 Forbidden**

```json
{
  "statusCode": 403,
  "message": "Access denied",
  "error": "You don't have permission to access this resource"
}
```

**404 Not Found**

```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Scan with ID scan_999 does not exist"
}
```

**500 Internal Server Error**

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Something went wrong on the server"
}
```

---

## API Base URL

**Local Development:**

- iOS/Android Emulator: `http://10.0.2.2:3000`
- Physical Device: `http://192.168.x.x:3000` (use your local network IP)

**Production:**

- `https://api.pneumodetect.com`

---

## Authentication

All API calls (except `/auth/login`, `/auth/register`, `/auth/verify-otp`) require:

```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Token Format:** JWT (JSON Web Token)

---

## Summary

This documentation covers:

- ✅ 21 main screens/flows
- ✅ Complete API endpoints for each flow
- ✅ Request/response structures
- ✅ Error handling examples
- ✅ Authentication & headers
- ✅ UI layouts and descriptions

Use this as a reference when:

- Building API endpoints on the backend
- Debugging frontend API calls
- Designing new features
- Understanding data flow
