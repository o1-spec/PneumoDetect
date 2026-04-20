# PneumoDetect Documentation - README

This folder contains comprehensive documentation about the PneumoDetect application, mapping UI screens to API endpoints and expected responses.

## 📁 Documentation Files

### 1. **UI_API_DOCUMENTATION.md** - MAIN REFERENCE

**Comprehensive guide with complete details for each screen**

- 📋 Full UI layouts with ASCII diagrams
- 🔗 Complete API requests and responses
- 📝 JSON examples for every API call
- ⚠️ Error response examples
- 🎯 21 screens documented end-to-end

**Use this when:**

- Building backend endpoints
- Debugging frontend API issues
- Designing new features
- Understanding complete data structures

**Screens covered:**

1. Login
2. Signup
3. OTP Verification
4. Dashboard (Main)
5. Scan Upload
6. Scan Processing
7. Scan Results
8. Explainable AI
9. Patient List
10. Patient Details
11. Create Patient
12. Profile
13. Notifications
14. Admin - Users
15. Admin - Analytics
16. System Status
17. Report Generation
    ...and more!

---

### 2. **API_QUICK_REFERENCE.md** - QUICK LOOKUP

**Fast cheat sheet for API endpoints**

- 🚀 All endpoints in simple tables
- 📊 Organized by feature/resource
- 🔄 Quick reference data flows
- 💾 Example JSON structures
- 🧪 curl command examples for testing

**Use this when:**

- You need a quick API endpoint lookup
- Creating test requests
- Quick reference during development
- Showing API surface to teammates

**Sections:**

- Authentication APIs
- Dashboard APIs
- Scan Upload APIs
- Patient Management APIs
- User Profile APIs
- Notification APIs
- Admin APIs
- Analytics APIs

---

### 3. **UI_TO_API_MAPPING.md** - VISUAL MAPPING

**Visual diagrams showing which APIs are called on each screen**

- 🎨 Screen-by-screen visual flowcharts
- 🔀 Data flow diagrams
- 📱 ASCII UI layouts with API calls overlaid
- 🔄 Complete user journey flows
- 📊 API call frequency reference

**Use this when:**

- Understanding which APIs a screen needs
- Designing screen flows
- Troubleshooting data display issues
- Planning feature implementation

**Features:**

- ASCII UI layouts for each screen
- Arrows showing which APIs are called
- Highlighted data sections showing API responses
- Navigation flows between screens
- Data transformation examples

---

## 🎯 Quick Start Guide

### For Backend Developers

1. Start with **API_QUICK_REFERENCE.md** to see all endpoints
2. Read **UI_API_DOCUMENTATION.md** for each endpoint you're building
3. Reference **UI_TO_API_MAPPING.md** to see context of how it's used

### For Frontend Developers

1. Use **UI_TO_API_MAPPING.md** to find which APIs to call
2. Check **UI_API_DOCUMENTATION.md** for exact request/response format
3. Keep **API_QUICK_REFERENCE.md** open for quick lookups

### For Product/Design Team

1. Review **UI_TO_API_MAPPING.md** for visual screen flows
2. Reference **UI_API_DOCUMENTATION.md** for specific features
3. Use data structure examples for mockup planning

---

## 📊 Key API Patterns

### Authentication

```
POST /auth/login → get accessToken
Use token in Authorization header for all subsequent calls
POST /auth/logout → end session
```

### Dashboard Data Loading

```
Parallel calls (with error handling):
├─ GET /analytics/stats
├─ GET /analytics/scans/results
├─ GET /scans
├─ GET /notifications
└─ GET /dashboard/system-status

If one fails, dashboard still shows with empty sections
```

### Scan Upload & Analysis

```
POST /scans/upload → get scanId
  ↓
GET /scans/{scanId} (polling every 2-3s)
  ↓
When status=COMPLETED:
├─ GET /scans/{scanId} (get results)
├─ GET /scans/{scanId}/explainability (get explanation)
└─ GET /reports/{scanId} (get full report)
```

### Patient Management

```
GET /patients → list all
GET /patients/{id} → view one
POST /patients → create
PUT /patients/{id} → edit
DELETE /patients/{id} → remove
```

---

## 🔐 Authentication

All API calls (except authentication endpoints) require:

```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

The accessToken is obtained from:

- `POST /auth/login` (returns in response)
- `POST /auth/register` (returns in response)
- `POST /auth/verify-otp` (returns in response)

---

## 📱 API Endpoints Summary

### Authentication (3)

- POST /auth/login
- POST /auth/register
- POST /auth/verify-otp
- POST /auth/logout

### Dashboard (5)

- GET /analytics/stats
- GET /analytics/scans/results
- GET /scans
- GET /notifications
- GET /dashboard/system-status

### Scans (6)

- POST /scans/upload
- GET /scans
- GET /scans/{scanId}
- GET /scans/{scanId}/explainability
- PATCH /scans/{scanId}/status
- PUT /scans/{scanId}/notes

### Patients (5)

- GET /patients
- GET /patients/{patientId}
- POST /patients
- PUT /patients/{patientId}
- DELETE /patients/{patientId}

### Users (5)

- GET /users/me
- PUT /users/profile
- PUT /users/password
- GET /users/preferences
- PUT /users/preferences

### Notifications (3)

- GET /notifications
- PATCH /notifications/{notificationId}
- DELETE /notifications/{notificationId}

### Admin (4)

- GET /admin/users
- PATCH /admin/users/{userId}/status
- DELETE /admin/users/{userId}
- GET /reports/{scanId}

### Analytics (5)

- GET /analytics/stats
- GET /analytics/scans/results
- GET /analytics/patients
- GET /analytics/doctors
- GET /analytics/model-performance

**Total: ~40 endpoints**

---

## 🚀 Base URLs

### Development

- **Emulator (Android):** `http://10.0.2.2:3000`
- **Emulator (iOS):** `http://localhost:3000`
- **Physical Device:** `http://192.168.x.x:3000` (your local network IP)

### Production

- `https://api.pneumodetect.com`

---

## 📋 Common Response Codes

| Code | Meaning      | Example Scenario          |
| ---- | ------------ | ------------------------- |
| 200  | Success      | GET request returned data |
| 201  | Created      | POST created new resource |
| 204  | No Content   | DELETE successful         |
| 400  | Bad Request  | Validation failed         |
| 401  | Unauthorized | Invalid/expired token     |
| 403  | Forbidden    | No permission             |
| 404  | Not Found    | Resource doesn't exist    |
| 500  | Server Error | Backend issue             |

---

## 🔄 User Flows

### New User Journey

```
1. Signup Screen → POST /auth/register
2. OTP Verification → POST /auth/verify-otp
3. Dashboard → GET /analytics/stats, /scans, etc.
```

### Scan Analysis Journey

```
1. Upload Screen → POST /scans/upload (get scanId)
2. Processing Screen → GET /scans/{scanId} (polling)
3. Results Screen → GET /scans/{scanId}/explainability + /reports/{scanId}
```

### Admin Features Journey

```
1. Dashboard → Users button only visible if admin
2. Users Screen → GET /admin/users
3. Analytics Screen → GET /analytics/stats, /patients, etc.
```

---

## 💡 Tips for Using This Documentation

### For Debugging API Issues

1. Find the screen route in your logs
2. Check **UI_TO_API_MAPPING.md** to see which APIs it calls
3. Compare your API responses with **UI_API_DOCUMENTATION.md**
4. Check that all required fields are present

### For Adding New Features

1. Start with **UI_API_DOCUMENTATION.md** section for similar features
2. Design your API response structure similarly
3. Update the frontend to handle your new API
4. Add your new endpoint to these docs

### For Code Reviews

1. Check if response data matches **UI_API_DOCUMENTATION.md**
2. Verify error handling follows the patterns
3. Ensure proper authentication headers
4. Review data transformations

---

## 🔗 File Cross-References

**Need to understand scan results flow?**
→ Check UI_TO_API_MAPPING.md "Scan Upload & Analysis" section
→ Then read UI_API_DOCUMENTATION.md "Scan Details & Results"
→ Quick lookup: API_QUICK_REFERENCE.md

**Need to build /analytics/stats endpoint?**
→ Read API_QUICK_REFERENCE.md for endpoint location
→ Read UI_API_DOCUMENTATION.md for expected response format
→ Check UI_TO_API_MAPPING.md to see how it's used

**Need to understand admin features?**
→ Check UI_TO_API_MAPPING.md "Admin Screens" section
→ Read UI_API_DOCUMENTATION.md "Admin Features"
→ Cross-reference with API_QUICK_REFERENCE.md

---

## 📝 Document Maintenance

These documents are living documents and should be updated when:

- New endpoints are added
- API response structures change
- UI flows are modified
- New screens are created

**Format for updates:**

- Keep consistent with existing sections
- Include complete JSON examples
- Add error cases
- Update all three documents if adding new feature

---

## 🎓 Learning Path

**If you're new to PneumoDetect:**

1. **Start here:** API_QUICK_REFERENCE.md (5 min read)
2. **Then read:** UI_TO_API_MAPPING.md (10 min read)
3. **Deep dive:** UI_API_DOCUMENTATION.md (relevant sections)

**If you're implementing a specific feature:**

1. **Find the feature:** Scan through UI_TO_API_MAPPING.md
2. **Get details:** Read that section in UI_API_DOCUMENTATION.md
3. **Implement:** Build API/frontend with exact spec
4. **Test:** Use curl examples from API_QUICK_REFERENCE.md

**If you're debugging:**

1. **Identify screen:** Look at app logs/stack trace
2. **Find APIs:** Check UI_TO_API_MAPPING.md for that screen
3. **Compare responses:** Check UI_API_DOCUMENTATION.md
4. **Fix mismatch:** Update backend or frontend

---

## ✅ Checklist for New APIs

Before considering an API "done", ensure:

- ✅ Documented in API_QUICK_REFERENCE.md
- ✅ Full request/response in UI_API_DOCUMENTATION.md
- ✅ Error cases documented
- ✅ Added to UI_TO_API_MAPPING.md
- ✅ Frontend implements it correctly
- ✅ Matches UI data display needs
- ✅ Error handling in place
- ✅ Tested with real data

---

## 🤝 Contributing

To add/update documentation:

1. Make changes to the relevant .md file
2. Keep formatting consistent
3. Add complete JSON examples
4. Include error cases
5. Test that links still work
6. Update all three files if needed

---

## 📞 Questions?

If something is unclear in these docs:

- Check if there's a cross-reference to another section
- Look for similar examples
- Ask teammates who worked on that feature
- Update docs if you find a gap

---

**Last Updated:** April 20, 2026
**Version:** 1.0
**Maintained by:** Development Team
