# 🩸 BloodConnect - Complete System Documentation

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Core Files](#core-files)
4. [Quick Start](#quick-start)
5. [Testing Guide](#testing-guide)
6. [Troubleshooting](#troubleshooting)
7. [API Reference](#api-reference)

---

## System Overview

**BloodConnect** is a comprehensive blood donation and management system built with Firebase and modern web technologies. It serves three main user types:

### User Roles

| Role | Purpose | Access |
|------|---------|--------|
| **Donor** | Blood donors | `donor-dashboard.html` |
| **Admin** | System administrator | `admin.html` |
| **Hospital** | Blood banks/hospitals | `hospital-dashboard.html` |

---

## Architecture

### Technology Stack
- **Frontend**: HTML5, CSS3, Bootstrap 5.3, JavaScript ES6
- **Backend**: Firebase Realtime Database + Firestore
- **Authentication**: Firebase Authentication
- **Hosting**: Firebase Hosting
- **Version**: v1.0 (December 2025)

### System Flow

```
User Registration/Login
         ↓
Authentication (Firebase Auth)
         ↓
Role Determination
         ↓
Role-Specific Dashboard
         ↓
Operations (Create, Read, Update, Delete)
         ↓
Real-time Database Updates
         ↓
Notifications
```

---

## Core Files

### 📚 Essential Files

| File | Purpose | Imports |
|------|---------|---------|
| `firebaseauth.js` | Authentication (legacy) | Firebase Auth |
| `firebase-integration.js` | Firebase Firestore integration | Firebase Firestore |
| `firebase-realtime.js` | Realtime Database setup | Firebase Database |
| `auth-manager.js` | Central auth controller | Firebase Auth |
| `bloodConnectDB.js` | Database abstraction | `firebase-realtime.js` |
| `app-functions.js` | **ALL business logic** | `auth-manager.js`, `bloodConnectDB` |
| `page-loader.js` | Page initialization helper | `auth-manager.js`, `app-functions` |
| `system-init.js` | System startup | All modules |
| `system-validator.js` | System diagnostics | All modules |

### 🏠 Main Pages

**Donor Pages:**
- `login.html` - Login
- `register.html` / `Signup.html` - Registration
- `donor-dashboard.html` - Main dashboard
- `donate.html` - Schedule donation
- `donor-history.html` - Donation history
<!-- donor-profile-verification.html removed -->

**Admin Pages:**
- `admin.html` - Admin dashboard
- `admin-users.html` - User management
- `admin-manage-hospitals.html` - Hospital management
- `admin-inventory.html` - Blood inventory
- `admin-donor-eligibility.html` - Manage eligibility
- `admin-hospital-requests.html` - Approve requests
<!-- admin-donor-verifications.html removed -->
- `admin-reports.html` - Generate reports

**Hospital Pages:**
- `hospital-dashboard.html` - Hospital dashboard
- `hospital-inventory.html` - Manage inventory
- `hospital-requests.html` - Blood requests
- `hospital-patients.html` - Patient management

---

## Quick Start

### 1️⃣ Validate System
```javascript
// Open browser console (F12) and run:
window.validateBloodConnect()

// Expected output: All systems operational
```

### 2️⃣ Check Libraries
```javascript
window.checkBloodConnectLibraries()
```

### 3️⃣ Run Diagnostics
```javascript
window.diagnoseBloodConnect()
```

### 4️⃣ Create Test Accounts

Go to `/register.html` and create:
- **Donor**: donor@test.com / Test@12345
- **Admin**: admin@test.com / Admin@12345
- **Hospital**: hospital@test.com / Hospital@12345

### 5️⃣ Test Each Role

See `QUICK_START_TESTING.md` for detailed testing procedures.

---

## Testing Guide

### Test Scenarios

1. **Donor Workflow**
   - Register → Login → Schedule Donation → Check Eligibility → Apply for Verification

2. **Hospital Workflow**
   - Login → Request Blood → Schedule Event → Manage Screenings → Mark Eligible/Ineligible

3. **Admin Workflow**
   - Login → Approve Requests → Manage Users → Review Verifications → Generate Reports

See `QUICK_START_TESTING.md` for step-by-step testing guide.

---

## Troubleshooting

### Issue: "Access denied" on admin page

**Cause:** User role is not "admin"

**Fix:**
```javascript
// Check user role
const user = await authManager.getCurrentUserData()
console.log('Role:', user?.role)

// Verify in Firebase Database at: /users/{userId}/role
```

### Issue: Pages not loading

**Cause:** Module not loading or Firebase not initialized

**Fix:**
```javascript
// Run validation
window.validateBloodConnect()

// Check libraries
window.checkBloodConnectLibraries()

// Check browser console for errors
```

### Issue: Data not showing

**Cause:** Firebase paths or permissions issue

**Fix:**
```javascript
// Check data exists
const users = await bloodConnectDB.getUsers()
console.log('Users:', users)

const inventory = await bloodConnectDB.getBloodInventory()
console.log('Inventory:', inventory)
```

### Issue: Notifications not working

**Cause:** Notification path or user ID mismatch

**Fix:**
```javascript
// Check notifications
const notifications = await bloodConnectDB.getNotifications(userId)
console.log('Notifications:', notifications)

// Verify userId matches auth user
const authUser = await authManager.getAuthUser()
console.log('Auth UID:', authUser?.uid)
```

See `SETUP_AND_TROUBLESHOOTING.md` for comprehensive troubleshooting guide.

---

## API Reference

### Authentication Functions

```javascript
import authManager from './auth-manager.js'

// Get current authenticated user
const user = authManager.getAuthUser()

// Add listener for auth state changes
authManager.addAuthListener((user, userData) => {
  if (user) {
    console.log('User:', user.email)
    console.log('Role:', userData.role)
  }
})

// Logout
authManager.logoutAndRedirect()
```

### Donor Functions

```javascript
import appFunctions from './app-functions.js'

// Get dashboard data
const dashboard = await appFunctions.getDonorDashboard(donorId)

// Schedule donation
await appFunctions.scheduleDonation({
  donorId,
  hospitalId,
  bloodType: 'O+',
  donationDate: '2025-12-20'
})

// Check eligibility
const eligibility = await appFunctions.checkDonorEligibility(donorId)

// Get donation schedules
const schedules = await appFunctions.getDonationSchedules(donorId)

// Apply for eligibility check
await appFunctions.applyForEligibilityCheck(donorId)

// Update profile
await appFunctions.updateDonorProfile(donorId, {
  firstName: 'John',
  email: 'john@example.com'
})
```

### Hospital Functions

```javascript
// Get dashboard
const dashboard = await appFunctions.getHospitalDashboard(hospitalId)

// Create blood request
await appFunctions.createBloodRequest({
  hospitalId,
  bloodType: 'O+',
  quantity: 5,
  patientName: 'Patient Name'
})

// Get requests
const requests = await appFunctions.getHospitalBloodRequests(hospitalId)

// Update inventory
await appFunctions.updateInventory(inventoryId, {
  quantity: 10,
  status: 'available'
})

// Create event
await appFunctions.createHospitalEvent({
  hospitalId,
  eventName: 'Blood Drive',
  eventDate: '2025-12-20',
  location: 'Hospital Address'
})

// Get donation schedules for hospital
const schedules = await appFunctions.getHospitalDonationSchedules(hospitalId)

// Approve screening
await appFunctions.approveDonationSchedule(scheduleId, hospitalId)
```

### Admin Functions

```javascript
// Get dashboard
const dashboard = await appFunctions.getAdminDashboard()

// Get all users
const users = await appFunctions.getUsers()

// Get blood inventory
const inventory = await appFunctions.getBloodInventory()

// Get blood requests
const requests = await appFunctions.getBloodRequests()

// Approve blood request
await appFunctions.approveBloodRequest(requestId, adminId)

// Reject blood request
await appFunctions.rejectBloodRequest(requestId, reason, adminId)

// Get verifications
const verifications = await appFunctions.getVerifications()

// Approve verification
await appFunctions.approveVerification(verificationId, userId, adminId)

// Reject verification
await appFunctions.rejectVerification(verificationId, userId, reason, adminId)

// Set donor eligibility
await appFunctions.setDonorEligibility(donorId, true)

// Get hospitals
const hospitals = await appFunctions.getHospitals()

// Approve hospital
await appFunctions.approveHospitalRegistration(hospitalId)

// Reject hospital
await appFunctions.rejectHospitalRegistration(hospitalId, reason)
```

### Shared Functions

```javascript
// Create notification
await appFunctions.createNotification({
  userId,
  type: 'donation',
  title: 'Donation Scheduled',
  message: 'Your donation is scheduled for...',
  priority: 'high'
})

// Get notifications
const notifications = await appFunctions.getNotifications(userId)

// Mark notification as read
await appFunctions.markNotificationAsRead(notificationId)

// Record donation
await appFunctions.recordDonation({
  donorId,
  hospitalId,
  bloodType: 'O+',
  quantity: 450,
  donationDate: new Date().toISOString()
})
```

### Page Loader Functions

```javascript
import pageLoader from './page-loader.js'

// Initialize donor dashboard
const result = await pageLoader.initDonorDashboard()

// Initialize admin dashboard
const result = await pageLoader.initAdminDashboard()

// Initialize hospital dashboard
const result = await pageLoader.initHospitalDashboard()

// Show message
pageLoader.showMessage('Success message', 'success', 3000)

// Format date
pageLoader.formatDate('2025-12-20', 'date')
pageLoader.formatDate('2025-12-20T14:30:00', 'datetime')

// Format status
pageLoader.formatStatus('pending')

// Create badge
const badge = pageLoader.createBadge('Active', 'success')

// Get current user
const user = await pageLoader.getCurrentUser()

// Setup inactivity logout
pageLoader.setupInactivityLogout(30) // 30 minutes

// Add logout handler
pageLoader.addLogoutHandler('logoutBtn')
```

---

## File Structure

```
BloodConnect/
├── Core Firebase Files
│   ├── firebaseauth.js
│   ├── firebase-integration.js
│   ├── firebase-realtime.js
│   ├── auth-manager.js
│   └── firebase.json
│
├── Application Layer
│   ├── bloodConnectDB.js
│   ├── app-functions.js
│   ├── page-loader.js
│   ├── system-init.js
│   └── system-validator.js
│
├── Donor Pages
│   ├── login.html
│   ├── register.html
│   ├── Signup.html
│   ├── donor-dashboard.html
│   ├── donate.html
│   ├── donor-profile-verification.html
│   └── donor-history.html
│
├── Admin Pages
│   ├── admin.html
│   ├── admin-users.html
│   ├── admin-manage-hospitals.html
│   ├── admin-inventory.html
│   ├── admin-donor-eligibility.html
│   ├── admin-donor-verifications.html
│   ├── admin-hospital-requests.html
│   ├── admin-approval-notifications.html
│   └── admin-reports.html
│
├── Hospital Pages
│   ├── hospital-dashboard.html
│   ├── hospital-inventory.html
│   ├── hospital-requests.html
│   └── hospital-patients.html
│
├── Styles
│   ├── styles.css
│   ├── red-cross-styles.css
│   └── style.css
│
├── Utilities
│   ├── rate-limiter.js
│   ├── database-schema.js
│   └── realtime-database-rules.json
│
└── Documentation
    ├── README.md
    ├── SETUP_AND_TROUBLESHOOTING.md
    ├── QUICK_START_TESTING.md
    └── MASTER_INDEX.md (this file)
```

---

## Features Implemented

### ✅ Authentication
- [x] Login with email/password
- [x] User registration
- [x] Role-based access control
- [x] Session management
- [x] Logout functionality

### ✅ Donor Features
- [x] Dashboard with statistics
- [x] Schedule donations
- [x] Check eligibility status
- [x] Apply for eligibility verification
- [x] View donation history
- [x] Receive notifications
- [x] Update profile

### ✅ Hospital Features
- [x] Hospital dashboard
- [x] Request blood
- [x] Manage inventory
- [x] Schedule donation events
- [x] Screen donors
- [x] Determine donor eligibility
- [x] Track donations
- [x] Send notifications

### ✅ Admin Features
- [x] System dashboard
- [x] Manage users
- [x] Manage hospitals
- [x] Monitor blood inventory
- [x] Approve blood requests
- [x] Manage donor eligibility
- [x] Review verification documents
- [x] Generate reports
- [x] Send notifications

### ✅ Database Operations
- [x] Real-time data synchronization
- [x] CRUD operations
- [x] User management
- [x] Blood inventory tracking
- [x] Request management
- [x] Notification system
- [x] Verification tracking

### ✅ System Functions
- [x] Error handling
- [x] Form validation
- [x] Responsive design
- [x] Permission checking
- [x] Auto logout on inactivity
- [x] Browser back button protection
- [x] System diagnostics
- [x] Data validation

---

## Database Schema

```javascript
/users
  /{userId}
    firstName, lastName, email, role, phone
    bloodType, isEligible, lastDonationDate, etc.

/donations
  /{donationId}
    donorId, hospitalId, bloodType, quantity, date, status

/bloodInventory
  /{inventoryId}
    hospitalId, bloodType, quantity, location, status

/bloodRequests
  /{requestId}
    hospitalId, bloodType, quantity, status, requesterName, etc.

/donationSchedules
  /{scheduleId}
    donorId, hospitalId, status, date, bloodType, etc.

/hospitalEvents
  /{eventId}
    hospitalId, eventName, date, location, description

/verifications
  /{verificationId}
    userId, documents, status, reviewedBy, etc.

/notifications
  /{notificationId}
    userId, type, title, message, isRead, priority, etc.
```

---

## Security Features

- ✅ Firebase Authentication
- ✅ Role-based access control
- ✅ Session management
- ✅ Auto-logout on inactivity
- ✅ Encrypted data transmission
- ✅ Firebase security rules
- ✅ Input validation
- ✅ HTTPS only

---

## Performance Optimization

- ✅ Module-based architecture
- ✅ Lazy loading
- ✅ Efficient database queries
- ✅ Caching strategies
- ✅ Real-time listeners (selective)
- ✅ Optimized CSS/JS
- ✅ Bootstrap CDN

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers

---

## Support & Contact

For issues:
1. Check `SETUP_AND_TROUBLESHOOTING.md`
2. Run `window.validateBloodConnect()`
3. Review console errors
4. Check Firebase console

---

## Version History

**v1.0 - December 2025**
- Initial release
- All three roles implemented
- Complete feature set
- Comprehensive documentation
- System validation tools

---

## License

BloodConnect © 2025 - All Rights Reserved

---

**Last Updated:** December 12, 2025  
**Status:** ✅ Production Ready  
**Maintainer:** BloodConnect Development Team

---

## 📞 Quick Reference

| Action | Command |
|--------|---------|
| Validate System | `window.validateBloodConnect()` |
| Run Diagnostics | `window.diagnoseBloodConnect()` |
| Check Libraries | `window.checkBloodConnectLibraries()` |
| Get Current User | `const user = await authManager.getCurrentUserData()` |
| Logout | `authManager.logoutAndRedirect()` |
| Check Blood Inventory | `const inv = await bloodConnectDB.getBloodInventory()` |
| Get All Users | `const users = await bloodConnectDB.getUsers()` |
| Create Notification | `await appFunctions.createNotification({...})` |

---

**Ready to use BloodConnect? Start with System Validation!** 🚀

```javascript
// Copy and paste into browser console:
window.validateBloodConnect()
```
