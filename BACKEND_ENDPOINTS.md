# 🔌 PneumoDetect Backend Endpoints Specification

This document outlines all the necessary backend endpoints required for the PneumoDetect React Native application.

**Total Endpoints: 44**  
**Last Updated:** April 20, 2026

---

## 📋 Table of Contents

1. [Authentication (7)](#authentication)
2. [User Management (2)](#user-management)
3. [Patient Management (6)](#patient-management)
4. [Scan Management (7)](#scan-management)
5. [Analytics & Dashboard (8)](#analytics--dashboard)
6. [Notifications (5)](#notifications)
7. [User Activity (2)](#user-activity)
8. [Admin Management (4)](#admin-management)
9. [Support Messages (3)](#support-messages)

---

## 🔐 Authentication

**Base Path:** `/auth`

### 1. Login

- **Method:** `POST`
- **Endpoint:** `/auth/login`
- **Description:** User login with email and password
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }
  ```
- **Response:**
  ```json
  {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "CLINICIAN",
    "specialization": "Radiology",
    "phone": "+1234567890",
    "avatarUrl": "https://...",
    "isVerified": true,
    "isActive": true,
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z",
    "accessToken": "jwt_token_here"
  }
  ```
- **Status Codes:** 200 (success), 401 (invalid credentials), 400 (validation error)

### 2. Register

- **Method:** `POST`
- **Endpoint:** `/auth/register`
- **Description:** Create a new user account
- **Request Body:**
  ```json
  {
    "email": "newuser@example.com",
    "password": "securePassword123",
    "name": "Jane Doe",
    "role": "CLINICIAN",
    "specialization": "Pulmonology",
    "phone": "+1234567890"
  }
  ```
- **Response:** Same as login (includes accessToken)
- **Status Codes:** 201 (created), 400 (validation error), 409 (email exists)

### 3. Verify OTP

- **Method:** `POST`
- **Endpoint:** `/auth/verify-otp`
- **Description:** Verify email with OTP code
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "code": "123456"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Email verified successfully",
    "accessToken": "jwt_token_here"
  }
  ```
- **Status Codes:** 200 (success), 400 (invalid code), 404 (user not found)

### 4. Resend OTP

- **Method:** `POST`
- **Endpoint:** `/auth/resend-otp`
- **Description:** Resend OTP code to email
- **Request Body:**
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "OTP sent to your email"
  }
  ```
- **Status Codes:** 200 (success), 404 (user not found), 429 (too many attempts)

### 5. Change Password

- **Method:** `POST`
- **Endpoint:** `/auth/change-password`
- **Description:** Change user password (authenticated)
- **Auth:** Required (Bearer token)
- **Request Body:**
  ```json
  {
    "currentPassword": "oldPassword123",
    "newPassword": "newPassword456"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Password changed successfully"
  }
  ```
- **Status Codes:** 200 (success), 401 (unauthorized), 400 (validation error)

### 6. Delete Account

- **Method:** `DELETE`
- **Endpoint:** `/users/account`
- **Description:** Delete user account (authenticated)
- **Auth:** Required (Bearer token)
- **Request Body:**
  ```json
  {
    "password": "confirmPassword123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Account deleted successfully"
  }
  ```
- **Status Codes:** 200 (success), 401 (unauthorized), 400 (invalid password)

### 7. Logout

- **Method:** `POST`
- **Endpoint:** `/auth/logout`
- **Description:** Logout user (authenticated)
- **Auth:** Required (Bearer token)
- **Response:**
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```
- **Status Codes:** 200 (success), 401 (unauthorized)

---

## 👤 User Management

**Base Path:** `/users`

### 1. Get Current User

- **Method:** `GET`
- **Endpoint:** `/users/me`
- **Description:** Get logged-in user's profile
- **Auth:** Required (Bearer token)
- **Response:** User object (see Authentication/Login response)
- **Status Codes:** 200 (success), 401 (unauthorized)

### 2. Update Profile

- **Method:** `PUT`
- **Endpoint:** `/users/profile`
- **Description:** Update user profile information
- **Auth:** Required (Bearer token)
- **Request Body:**
  ```json
  {
    "name": "Updated Name",
    "phone": "+9876543210",
    "specialization": "Pediatrics",
    "avatarUrl": "https://new-avatar-url.com/image.jpg"
  }
  ```
- **Response:** Updated User object
- **Status Codes:** 200 (success), 401 (unauthorized), 400 (validation error)

---

## 🏥 Patient Management

**Base Path:** `/patients`

### 1. Get All Patients

- **Method:** `GET`
- **Endpoint:** `/patients`
- **Description:** Retrieve all patients (with optional pagination/filtering)
- **Auth:** Required (Bearer token)
- **Query Parameters:**
  - `skip`: number (optional, default: 0)
  - `take`: number (optional, default: 10)
  - `search`: string (optional)
- **Response:**
  ```json
  [
    {
      "id": "uuid",
      "idNumber": "P12345",
      "name": "Patient Name",
      "age": 45,
      "gender": "MALE",
      "email": "patient@example.com",
      "phone": "+1234567890",
      "address": "123 Main St, City",
      "medicalHistory": "Asthma, Allergies",
      "scanCount": 5,
      "pneumoniaDetected": 1,
      "lastScanDate": "2026-04-15T10:30:00Z",
      "createdAt": "2026-01-01T00:00:00Z",
      "updatedAt": "2026-04-20T00:00:00Z"
    }
  ]
  ```
- **Status Codes:** 200 (success), 401 (unauthorized)

### 2. Get Patient By ID

- **Method:** `GET`
- **Endpoint:** `/patients/:patientId`
- **Description:** Get specific patient details
- **Auth:** Required (Bearer token)
- **Path Parameters:** `patientId` (uuid)
- **Response:** Patient object (see Get All Patients)
- **Status Codes:** 200 (success), 401 (unauthorized), 404 (not found)

### 3. Create Patient

- **Method:** `POST`
- **Endpoint:** `/patients`
- **Description:** Create a new patient record
- **Auth:** Required (Bearer token)
- **Request Body:**
  ```json
  {
    "idNumber": "P12345",
    "name": "New Patient",
    "age": 35,
    "gender": "FEMALE",
    "email": "patient@example.com",
    "phone": "+1234567890",
    "address": "123 Main St, City",
    "medicalHistory": "None"
  }
  ```
- **Response:** Created Patient object
- **Status Codes:** 201 (created), 401 (unauthorized), 400 (validation error), 409 (duplicate ID)

### 4. Update Patient

- **Method:** `PUT`
- **Endpoint:** `/patients/:patientId`
- **Description:** Update patient information
- **Auth:** Required (Bearer token)
- **Path Parameters:** `patientId` (uuid)
- **Request Body:** Same as Create Patient (partial updates allowed)
- **Response:** Updated Patient object
- **Status Codes:** 200 (success), 401 (unauthorized), 400 (validation error), 404 (not found)

### 5. Delete Patient

- **Method:** `DELETE`
- **Endpoint:** `/patients/:patientId`
- **Description:** Delete a patient record
- **Auth:** Required (Bearer token)
- **Path Parameters:** `patientId` (uuid)
- **Response:**
  ```json
  {
    "success": true,
    "message": "Patient deleted successfully"
  }
  ```
- **Status Codes:** 200 (success), 401 (unauthorized), 404 (not found)

### 6. Search Patients

- **Method:** `GET`
- **Endpoint:** `/patients`
- **Description:** Search patients by name or ID
- **Auth:** Required (Bearer token)
- **Query Parameters:**
  - `search`: string (name or ID)
- **Response:** Array of matching Patient objects
- **Status Codes:** 200 (success), 401 (unauthorized)

---

## 📸 Scan Management

**Base Path:** `/scans`

### 1. Get All Scans

- **Method:** `GET`
- **Endpoint:** `/scans`
- **Description:** Retrieve all scans with pagination
- **Auth:** Required (Bearer token)
- **Query Parameters:**
  - `skip`: number (optional)
  - `take`: number (optional)
- **Response:**
  ```json
  [
    {
      "id": "uuid",
      "patientId": "uuid",
      "patientName": "Patient Name",
      "doctorId": "uuid",
      "status": "COMPLETED",
      "result": "NORMAL",
      "confidence": 0.95,
      "imageUrl": "https://...",
      "heatmapUrl": "https://...",
      "notes": "Clear chest X-ray",
      "uploadedAt": "2026-04-20T10:30:00Z",
      "processedAt": "2026-04-20T10:35:00Z",
      "createdAt": "2026-04-20T10:30:00Z",
      "updatedAt": "2026-04-20T10:35:00Z"
    }
  ]
  ```
- **Status Codes:** 200 (success), 401 (unauthorized)

### 2. Get Scan By ID

- **Method:** `GET`
- **Endpoint:** `/scans/:scanId`
- **Description:** Get specific scan details
- **Auth:** Required (Bearer token)
- **Path Parameters:** `scanId` (uuid)
- **Response:** Scan object (see Get All Scans)
- **Status Codes:** 200 (success), 401 (unauthorized), 404 (not found)

### 3. Get Scans By Patient ID

- **Method:** `GET`
- **Endpoint:** `/scans/patient/:patientId`
- **Description:** Get all scans for a specific patient
- **Auth:** Required (Bearer token)
- **Path Parameters:** `patientId` (uuid)
- **Response:** Array of Scan objects
- **Status Codes:** 200 (success), 401 (unauthorized), 404 (patient not found)

### 4. Upload Scan

- **Method:** `POST`
- **Endpoint:** `/scans/upload`
- **Description:** Upload X-ray image for a patient
- **Auth:** Required (Bearer token)
- **Content-Type:** `multipart/form-data`
- **Request Body:**
  ```
  FormData:
  - file: binary image file (JPEG/PNG)
  - patientId: uuid
  - notes: string (optional)
  ```
- **Response:** Scan object with status "UPLOADED"
- **Status Codes:** 201 (created), 401 (unauthorized), 400 (validation error)

### 5. Process Scan

- **Method:** `POST`
- **Endpoint:** `/scans/:scanId/process`
- **Description:** Start AI analysis on uploaded scan
- **Auth:** Required (Bearer token)
- **Path Parameters:** `scanId` (uuid)
- **Response:**
  ```json
  {
    "id": "uuid",
    "status": "PROCESSING",
    "message": "Analysis started"
  }
  ```
- **Status Codes:** 202 (accepted), 401 (unauthorized), 404 (not found)

### 6. Update Scan

- **Method:** `PATCH`
- **Endpoint:** `/scans/:scanId`
- **Description:** Update scan information
- **Auth:** Required (Bearer token)
- **Path Parameters:** `scanId` (uuid)
- **Request Body:**
  ```json
  {
    "result": "NORMAL",
    "notes": "Updated notes"
  }
  ```
- **Response:** Updated Scan object
- **Status Codes:** 200 (success), 401 (unauthorized), 400 (validation error), 404 (not found)

### 7. Delete Scan

- **Method:** `DELETE`
- **Endpoint:** `/scans/:scanId`
- **Description:** Delete a scan record
- **Auth:** Required (Bearer token)
- **Path Parameters:** `scanId` (uuid)
- **Response:**
  ```json
  {
    "success": true,
    "message": "Scan deleted successfully"
  }
  ```
- **Status Codes:** 200 (success), 401 (unauthorized), 404 (not found)

---

## 📊 Analytics & Dashboard

**Base Path:** `/analytics` or `/dashboard`

### 1. Get Analytics Stats

- **Method:** `GET`
- **Endpoint:** `/analytics/stats`
- **Description:** Get overview statistics for dashboard
- **Auth:** Required (Bearer token)
- **Response:**
  ```json
  {
    "totalScans": 1250,
    "totalPatients": 450,
    "pneumoniaDetected": 280,
    "accuracyRate": 94.5,
    "totalDoctors": 15,
    "activeDoctorsToday": 8
  }
  ```
- **Status Codes:** 200 (success), 401 (unauthorized)

### 2. Get Dashboard Metrics

- **Method:** `GET`
- **Endpoint:** `/analytics/dashboard`
- **Description:** Get comprehensive dashboard metrics
- **Auth:** Required (Bearer token)
- **Response:**
  ```json
  {
    "totalScans": 1250,
    "scansThisMonth": 180,
    "pneumoniaDetected": 280,
    "pneumoniaThisMonth": 45,
    "accuracyRate": 94.5,
    "avgConfidence": 0.92,
    "activeUsers": 12,
    "systemHealth": "Operational"
  }
  ```
- **Status Codes:** 200 (success), 401 (unauthorized)

### 3. Get Scan Results Timeline

- **Method:** `GET`
- **Endpoint:** `/analytics/scans/results`
- **Description:** Get scan results data for charting
- **Auth:** Required (Bearer token)
- **Query Parameters:**
  - `dateFrom`: ISO string (optional)
  - `dateTo`: ISO string (optional)
  - `groupBy`: "day" | "week" | "month" (optional)
- **Response:**
  ```json
  {
    "resultBreakdown": {
      "pneumonia": 280,
      "normal": 970,
      "pneumoniaPercentage": 22.4,
      "normalPercentage": 77.6
    },
    "confidenceDistribution": {
      "excellent": 850,
      "good": 350,
      "fair": 50
    },
    "timelineData": [
      {
        "date": "2026-04-20",
        "scans": 15,
        "pneumonia": 3,
        "normal": 12,
        "averageConfidence": 0.93
      }
    ],
    "totalScans": 1250,
    "averageConfidence": 0.92
  }
  ```
- **Status Codes:** 200 (success), 401 (unauthorized)

### 4. Get Patient Analytics

- **Method:** `GET`
- **Endpoint:** `/analytics/patients`
- **Description:** Get patient-related analytics
- **Auth:** Required (Bearer token)
- **Response:**
  ```json
  {
    "totalPatients": 450,
    "newPatientsThisMonth": 25,
    "patientsWithPneumonia": 95,
    "averageScansPerPatient": 2.8,
    "topPatients": [
      {
        "id": "uuid",
        "name": "John Doe",
        "idNumber": "P001",
        "scanCount": 12,
        "pneumoniaDetected": 3,
        "lastScanDate": "2026-04-20T10:30:00Z"
      }
    ]
  }
  ```
- **Status Codes:** 200 (success), 401 (unauthorized)

### 5. Get Doctor Analytics

- **Method:** `GET`
- **Endpoint:** `/analytics/doctors`
- **Description:** Get doctor performance analytics (Admin only)
- **Auth:** Required (Bearer token, Admin role)
- **Response:**
  ```json
  {
    "totalDoctors": 15,
    "activeDoctorsThisMonth": 12,
    "doctors": [
      {
        "id": "uuid",
        "name": "Dr. Jane Smith",
        "email": "jane@example.com",
        "scanCount": 150,
        "pneumoniaDetected": 45,
        "accuracyRate": 95.2,
        "averageConfidence": 0.94,
        "lastActiveAt": "2026-04-20T14:30:00Z"
      }
    ]
  }
  ```
- **Status Codes:** 200 (success), 401 (unauthorized), 403 (forbidden - admin only)

### 6. Get Model Performance

- **Method:** `GET`
- **Endpoint:** `/analytics/model-performance`
- **Description:** Get AI model performance metrics (Admin only)
- **Auth:** Required (Bearer token, Admin role)
- **Response:**
  ```json
  {
    "overallMetrics": {
      "accuracy": 0.945,
      "precision": 0.942,
      "recall": 0.938,
      "f1Score": 0.94
    },
    "byModelVersion": [
      {
        "version": "1.0.0",
        "accuracy": 0.93,
        "precision": 0.927,
        "recall": 0.925,
        "f1Score": 0.926,
        "scanCount": 500
      }
    ],
    "confidenceThresholdAnalysis": [
      {
        "threshold": 0.8,
        "accuracy": 0.95,
        "precision": 0.952,
        "recall": 0.948,
        "f1Score": 0.95
      }
    ]
  }
  ```
- **Status Codes:** 200 (success), 401 (unauthorized), 403 (forbidden - admin only)

### 7. Get Activity Timeline

- **Method:** `GET`
- **Endpoint:** `/analytics/activity-timeline`
- **Description:** Get user activity events
- **Auth:** Required (Bearer token)
- **Query Parameters:**
  - `userId`: uuid (optional)
  - `dateFrom`: ISO string (optional)
  - `dateTo`: ISO string (optional)
  - `type`: event type (optional)
- **Response:**
  ```json
  {
    "events": [
      {
        "id": "uuid",
        "type": "SCAN_UPLOADED",
        "timestamp": "2026-04-20T10:30:00Z",
        "user": { "id": "uuid", "name": "Dr. John" },
        "scan": { "id": "uuid", "patientName": "Patient X" },
        "details": { "patientId": "uuid" }
      }
    ],
    "totalEvents": 450,
    "dateRange": {
      "from": "2026-04-01T00:00:00Z",
      "to": "2026-04-30T23:59:59Z"
    }
  }
  ```
- **Status Codes:** 200 (success), 401 (unauthorized)

### 8. Get System Status

- **Method:** `GET`
- **Endpoint:** `/dashboard/system-status`
- **Description:** Get system health and status
- **Auth:** Required (Bearer token)
- **Response:**
  ```json
  {
    "aiModel": "Operational",
    "database": "Connected",
    "storage": "78% Used"
  }
  ```
- **Status Codes:** 200 (success), 401 (unauthorized)

---

## 🔔 Notifications

**Base Path:** `/notifications`

### 1. Get All Notifications

- **Method:** `GET`
- **Endpoint:** `/notifications`
- **Description:** Get user's notifications
- **Auth:** Required (Bearer token)
- **Response:**
  ```json
  [
    {
      "id": "uuid",
      "userId": "uuid",
      "title": "Scan Results Ready",
      "message": "Your scan analysis is complete",
      "type": "SCAN_COMPLETED",
      "read": false,
      "actionUrl": "/scans/uuid",
      "createdAt": "2026-04-20T10:30:00Z",
      "updatedAt": "2026-04-20T10:30:00Z"
    }
  ]
  ```
- **Status Codes:** 200 (success), 401 (unauthorized)

### 2. Get Notification By ID

- **Method:** `GET`
- **Endpoint:** `/notifications/:notificationId`
- **Description:** Get specific notification
- **Auth:** Required (Bearer token)
- **Path Parameters:** `notificationId` (uuid)
- **Response:** Notification object
- **Status Codes:** 200 (success), 401 (unauthorized), 404 (not found)

### 3. Update Notification

- **Method:** `PATCH`
- **Endpoint:** `/notifications/:notificationId`
- **Description:** Mark notification as read/unread
- **Auth:** Required (Bearer token)
- **Path Parameters:** `notificationId` (uuid)
- **Request Body:**
  ```json
  {
    "read": true
  }
  ```
- **Response:** Updated Notification object
- **Status Codes:** 200 (success), 401 (unauthorized), 404 (not found)

### 4. Mark All Notifications as Read

- **Method:** `POST`
- **Endpoint:** `/notifications/mark-all-read`
- **Description:** Mark all user notifications as read
- **Auth:** Required (Bearer token)
- **Response:**
  ```json
  {
    "success": true,
    "message": "All notifications marked as read"
  }
  ```
- **Status Codes:** 200 (success), 401 (unauthorized)

### 5. Delete Notification

- **Method:** `DELETE`
- **Endpoint:** `/notifications/:notificationId`
- **Description:** Delete a notification
- **Auth:** Required (Bearer token)
- **Path Parameters:** `notificationId` (uuid)
- **Response:**
  ```json
  {
    "success": true,
    "message": "Notification deleted"
  }
  ```
- **Status Codes:** 200 (success), 401 (unauthorized), 404 (not found)

---

## 📈 User Activity

**Base Path:** `/users`

### 1. Get User Activity History

- **Method:** `GET`
- **Endpoint:** `/users/activity`
- **Description:** Get user's scan and action history
- **Auth:** Required (Bearer token)
- **Response:**
  ```json
  {
    "userId": "uuid",
    "totalScans": 45,
    "totalPatients": 12,
    "lastActivityAt": "2026-04-20T14:30:00Z",
    "activities": [
      {
        "date": "2026-04-20",
        "scans": 5,
        "patients": 2,
        "actions": ["SCAN_UPLOADED", "SCAN_ANALYZED"]
      }
    ]
  }
  ```
- **Status Codes:** 200 (success), 401 (unauthorized)

### 2. Get Login History

- **Method:** `GET`
- **Endpoint:** `/users/activity/login`
- **Description:** Get user's login history
- **Auth:** Required (Bearer token)
- **Response:**
  ```json
  [
    {
      "id": "uuid",
      "userId": "uuid",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "loginAt": "2026-04-20T14:30:00Z",
      "logoutAt": "2026-04-20T18:45:00Z",
      "status": "ACTIVE"
    }
  ]
  ```
- **Status Codes:** 200 (success), 401 (unauthorized)

---

## 👨‍💼 Admin Management

**Base Path:** `/admin`

### 1. Get All Users

- **Method:** `GET`
- **Endpoint:** `/admin/users`
- **Description:** Get all system users (Admin only)
- **Auth:** Required (Bearer token, Admin role)
- **Query Parameters:**
  - `skip`: number (optional)
  - `take`: number (optional)
  - `role`: "ADMIN" | "CLINICIAN" (optional)
- **Response:** Array of User objects
- **Status Codes:** 200 (success), 401 (unauthorized), 403 (forbidden - admin only)

### 2. Get User By ID

- **Method:** `GET`
- **Endpoint:** `/admin/users/:userId`
- **Description:** Get specific user details (Admin only)
- **Auth:** Required (Bearer token, Admin role)
- **Path Parameters:** `userId` (uuid)
- **Response:** User object with additional admin info
- **Status Codes:** 200 (success), 401 (unauthorized), 403 (forbidden), 404 (not found)

### 3. Toggle User Status

- **Method:** `PATCH`
- **Endpoint:** `/admin/users/:userId/status`
- **Description:** Activate/deactivate user account (Admin only)
- **Auth:** Required (Bearer token, Admin role)
- **Path Parameters:** `userId` (uuid)
- **Request Body:**
  ```json
  {
    "isActive": true
  }
  ```
- **Response:**
  ```json
  {
    "id": "uuid",
    "isActive": true,
    "message": "User status updated"
  }
  ```
- **Status Codes:** 200 (success), 401 (unauthorized), 403 (forbidden), 404 (not found)

### 4. Delete User

- **Method:** `DELETE`
- **Endpoint:** `/admin/users/:userId`
- **Description:** Delete user account (Admin only)
- **Auth:** Required (Bearer token, Admin role)
- **Path Parameters:** `userId` (uuid)
- **Response:**
  ```json
  {
    "success": true,
    "message": "User deleted successfully"
  }
  ```
- **Status Codes:** 200 (success), 401 (unauthorized), 403 (forbidden), 404 (not found)

---

## 💬 Support Messages

**Base Path:** `/messages`

### 1. Send Support Message

- **Method:** `POST`
- **Endpoint:** `/messages/send`
- **Description:** Send support/contact message
- **Auth:** Required (Bearer token)
- **Request Body:**
  ```json
  {
    "subject": "Issue with scan upload",
    "message": "I'm having trouble uploading images"
  }
  ```
- **Response:**
  ```json
  {
    "id": "uuid",
    "subject": "Issue with scan upload",
    "message": "I'm having trouble uploading images",
    "userId": "uuid",
    "responded": false,
    "createdAt": "2026-04-20T10:30:00Z"
  }
  ```
- **Status Codes:** 201 (created), 401 (unauthorized), 400 (validation error)

### 2. Get All Messages

- **Method:** `GET`
- **Endpoint:** `/messages`
- **Description:** Get all support messages (Admin only)
- **Auth:** Required (Bearer token, Admin role)
- **Query Parameters:**
  - `skip`: number (optional)
  - `take`: number (optional)
  - `responded`: boolean (optional)
- **Response:** Array of message objects
- **Status Codes:** 200 (success), 401 (unauthorized), 403 (forbidden - admin only)

### 3. Mark Message as Responded

- **Method:** `PATCH`
- **Endpoint:** `/messages/:messageId`
- **Description:** Mark support message as responded (Admin only)
- **Auth:** Required (Bearer token, Admin role)
- **Path Parameters:** `messageId` (uuid)
- **Request Body:**
  ```json
  {
    "responded": true
  }
  ```
- **Response:**
  ```json
  {
    "id": "uuid",
    "responded": true,
    "respondedAt": "2026-04-20T11:00:00Z"
  }
  ```
- **Status Codes:** 200 (success), 401 (unauthorized), 403 (forbidden), 404 (not found)

---

## 🔒 Authentication & Authorization

### Bearer Token

All authenticated endpoints require the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

### Roles

- **ADMIN**: Full system access, user management, analytics
- **CLINICIAN**: Limited access, scan management, patient records

### Common Status Codes

- **200** - Success
- **201** - Created
- **202** - Accepted (async operation)
- **400** - Bad Request (validation error)
- **401** - Unauthorized (missing or invalid token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found
- **409** - Conflict (duplicate entry)
- **429** - Too Many Requests (rate limit)
- **500** - Internal Server Error

---

## 📝 Request/Response Format

### Standard Response Format

```json
{
  "success": true,
  "data": {
    /* endpoint-specific data */
  },
  "message": "Success message"
}
```

### Error Response Format

```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400,
  "details": {
    /* validation errors or additional info */
  }
}
```

---

## 🚀 Base URL

- **Development:** `http://localhost:3000`
- **Android Emulator:** `http://10.0.2.2:3000`
- **Production:** `https://api.pneumoscan.ai`

---

## 📞 Support

For API documentation, issues, or feature requests, contact the backend team.

**Version:** 1.0.0  
**Last Updated:** April 20, 2026  
**Total Endpoints:** 44
