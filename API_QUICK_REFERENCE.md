# PneumoDetect - Quick API Reference Guide

**A quick cheat sheet for all API endpoints organized by flow**

---

## 🔐 Authentication APIs

| Screen | Method | Endpoint           | Purpose            |
| ------ | ------ | ------------------ | ------------------ |
| Login  | POST   | `/auth/login`      | Authenticate user  |
| Signup | POST   | `/auth/register`   | Create new account |
| OTP    | POST   | `/auth/verify-otp` | Verify email OTP   |
| Logout | POST   | `/auth/logout`     | End session        |

---

## 📊 Dashboard APIs

| Data          | Method | Endpoint                   | Returns                      |
| ------------- | ------ | -------------------------- | ---------------------------- |
| Stats         | GET    | `/analytics/stats`         | Total/failed/completed scans |
| Timeline      | GET    | `/analytics/scans/results` | Daily scan data for chart    |
| Recent Scans  | GET    | `/scans`                   | List of all scans            |
| Notifications | GET    | `/notifications`           | User notifications           |
| System Status | GET    | `/dashboard/system-status` | AI/DB/Storage status         |

---

## 📤 Scan Upload & Analysis APIs

| Action         | Method | Endpoint                         | Notes               |
| -------------- | ------ | -------------------------------- | ------------------- |
| Upload         | POST   | `/scans/upload`                  | Multipart form data |
| Get Scan       | GET    | `/scans/{scanId}`                | Poll for status     |
| Get Results    | GET    | `/scans/{scanId}`                | After completion    |
| Explainability | GET    | `/scans/{scanId}/explainability` | AI explanation      |
| Report         | GET    | `/reports/{scanId}`              | Full medical report |

---

## 👥 Patient Management APIs

| Action | Method | Endpoint                | Purpose            |
| ------ | ------ | ----------------------- | ------------------ |
| List   | GET    | `/patients`             | Get all patients   |
| Detail | GET    | `/patients/{patientId}` | Get single patient |
| Create | POST   | `/patients`             | Add new patient    |
| Update | PUT    | `/patients/{patientId}` | Edit patient       |
| Delete | DELETE | `/patients/{patientId}` | Remove patient     |

---

## 👤 User Profile APIs

| Action             | Method | Endpoint             | Purpose           |
| ------------------ | ------ | -------------------- | ----------------- |
| Get Profile        | GET    | `/users/me`          | Current user data |
| Update Profile     | PUT    | `/users/profile`     | Edit user info    |
| Change Password    | PUT    | `/users/password`    | Update password   |
| Get Preferences    | GET    | `/users/preferences` | User settings     |
| Update Preferences | PUT    | `/users/preferences` | Save settings     |

---

## 🔔 Notification APIs

| Action    | Method | Endpoint              | Purpose             |
| --------- | ------ | --------------------- | ------------------- |
| Get All   | GET    | `/notifications`      | List notifications  |
| Mark Read | PATCH  | `/notifications/{id}` | Mark as read        |
| Delete    | DELETE | `/notifications/{id}` | Remove notification |

---

## 👨‍💼 Admin APIs

| Action        | Method | Endpoint                       | Purpose        |
| ------------- | ------ | ------------------------------ | -------------- |
| Get Users     | GET    | `/admin/users`                 | List all users |
| Get User      | GET    | `/admin/users/{userId}`        | User details   |
| Toggle Status | PATCH  | `/admin/users/{userId}/status` | Active/Suspend |
| Delete User   | DELETE | `/admin/users/{userId}`        | Remove user    |

---

## 📈 Analytics APIs

| Action      | Method | Endpoint                       | Purpose            |
| ----------- | ------ | ------------------------------ | ------------------ |
| Stats       | GET    | `/analytics/stats`             | Overall statistics |
| Results     | GET    | `/analytics/scans/results`     | Result breakdown   |
| Patient     | GET    | `/analytics/patients`          | Patient analytics  |
| Doctor      | GET    | `/analytics/doctors`           | Doctor analytics   |
| Performance | GET    | `/analytics/model-performance` | AI model metrics   |

---

## 🔗 Request Headers

**All requests (except auth):**

```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

---

## 📋 Response Status Codes

| Code | Meaning      | Example                |
| ---- | ------------ | ---------------------- |
| 200  | Success      | Data returned          |
| 201  | Created      | Resource created       |
| 400  | Bad Request  | Validation failed      |
| 401  | Unauthorized | Invalid token          |
| 403  | Forbidden    | No permission          |
| 404  | Not Found    | Resource doesn't exist |
| 500  | Server Error | Server issue           |

---

## 🔄 Key Data Flows

### Flow 1: User Login → Dashboard

```
1. POST /auth/login → Get accessToken
2. GET /analytics/stats → Get stats
3. GET /analytics/scans/results → Get timeline
4. GET /scans → Get recent scans
5. GET /notifications → Get alerts
6. GET /dashboard/system-status → Get status
```

### Flow 2: Upload & Analyze Scan

```
1. POST /scans/upload → Upload image
2. GET /scans/{scanId} → Poll (every 2-3s)
3. GET /scans/{scanId} → Completed
4. GET /scans/{scanId}/explainability → Get explanation
5. GET /reports/{scanId} → Get report
```

### Flow 3: Manage Patients

```
1. GET /patients → List patients
2. GET /patients/{id} → View details
3. POST /patients → Create patient
4. PUT /patients/{id} → Edit patient
5. DELETE /patients/{id} → Delete patient
```

### Flow 4: Admin Management

```
1. GET /admin/users → List all users
2. PATCH /admin/users/{id}/status → Toggle status
3. DELETE /admin/users/{id} → Delete user
```

---

## 💾 Data Structure Examples

### Scan Object

```json
{
  "id": "scan_001",
  "status": "COMPLETED",
  "result": "PNEUMONIA",
  "confidence": 0.92,
  "imageUrl": "https://...",
  "heatmapUrl": "https://...",
  "patientId": "patient_123",
  "clinicianId": "user_123",
  "createdAt": "2026-04-20T14:30:00Z",
  "analyzedAt": "2026-04-20T14:35:00Z"
}
```

### Patient Object

```json
{
  "id": "patient_123",
  "idNumber": "P001",
  "name": "Jane Smith",
  "age": 35,
  "gender": "FEMALE",
  "createdAt": "2026-02-01T10:00:00Z"
}
```

### User Object

```json
{
  "id": "user_123",
  "email": "doctor@example.com",
  "name": "Dr. John Doe",
  "role": "CLINICIAN",
  "specialization": "Pulmonology",
  "phone": "+1234567890",
  "isVerified": true,
  "isActive": true
}
```

### Notification Object

```json
{
  "id": "notif_001",
  "title": "Scan Complete",
  "message": "Scan processed successfully",
  "type": "SCAN",
  "read": false,
  "createdAt": "2026-04-20T14:35:00Z"
}
```

---

## 🚨 Common Error Responses

### Validation Error (400)

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email format",
    "password": "Password too short"
  }
}
```

### Authentication Error (401)

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Invalid credentials"
}
```

### Permission Error (403)

```json
{
  "statusCode": 403,
  "message": "Forbidden",
  "error": "You don't have permission"
}
```

### Not Found (404)

```json
{
  "statusCode": 404,
  "message": "Not Found",
  "error": "Scan not found"
}
```

---

## 🎯 Testing Endpoints

### Login Test

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@example.com",
    "password": "password123"
  }'
```

### Dashboard Test

```bash
curl -X GET http://localhost:3000/analytics/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Upload Scan Test

```bash
curl -X POST http://localhost:3000/scans/upload \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "image=@/path/to/scan.jpg" \
  -F "patientId=patient_123"
```

---

## 📝 Notes

- All timestamps are in ISO 8601 format (`YYYY-MM-DDTHH:mm:ssZ`)
- Confidence scores are between 0 and 1 (0.92 = 92%)
- Results are: `PNEUMONIA`, `NORMAL`, `PNEUMONIA_DETECTED`, `CONCERNS`
- Statuses are: `UPLOADED`, `PROCESSING`, `COMPLETED`, `FAILED`
- Roles are: `CLINICIAN`, `PATIENT`, `ADMIN` (when implemented)

---

**For detailed information, see: `UI_API_DOCUMENTATION.md`**
