# BloodConnect System - Complete Setup & Troubleshooting Guide

## System Architecture

BloodConnect is a comprehensive blood donation management system with three main user roles:

### 1. **Donor** (Donors who want to donate blood)
- Dashboard: `donor-dashboard.html`
- Schedule donations
- Track donation history
- Check eligibility status
- Apply for eligibility verification

### 2. **Admin** (System administrators)
- Dashboard: `admin.html`
- Manage users
- Manage hospitals
- Monitor blood inventory
- Review donor registrations and verifications
- Approve/reject blood requests
- Generate reports

### 3. **Hospital** (Blood banks and hospitals)
- Dashboard: `hospital-dashboard.html`
- Request blood
- Manage inventory
- Schedule donor screening events
- Track donations
- Manage patients

## Key Files & Functions

### Core Libraries
- **firebase-integration.js**: Firebase Auth and Firestore integration
- **firebaseauth.js**: ES6 module for Firebase Auth
- **firebase-realtime.js**: Realtime Database helper functions
- **bloodConnectDB.js**: Database abstraction layer
- **auth-manager.js**: Unified authentication manager
- **app-functions.js**: All business logic functions
- **page-loader.js**: Page initialization utilities
- **system-init.js**: System startup and diagnostics

### Main Pages

#### For Donors
- `login.html` - Login page
- `register.html` / `Signup.html` - Registration
- `donor-dashboard.html` - Main donor dashboard
- `donate.html` - Schedule donation
- `donor-history.html` - Donation history

#### For Admins
- `admin.html` - Admin dashboard
- `admin-users.html` - Manage users
- `admin-manage-hospitals.html` - Manage hospitals
- `admin-inventory.html` - Blood inventory
- `admin-donor-eligibility.html` - Manage donor eligibility
- `admin-hospital-requests.html` - Approve/reject blood requests
- `admin-approval-notifications.html` - Notifications
- `admin-reports.html` - Generate reports

#### For Hospitals
- `hospital-dashboard.html` - Hospital main dashboard
- `hospital-inventory.html` - Manage blood inventory
- `hospital-requests.html` - Blood requests
- `hospital-patients.html` - Patient management

## Database Structure

The system uses Firebase Realtime Database. **Note:** If database nodes don't exist, Firebase will automatically create them when new data is written to those paths. You only need to provide initial seed data for testing.

```
/users
  /{userId}
    - firstName
    - lastName
    - email
    - role (donor/admin/hospital)
    - bloodType (for donors)
    - isEligible
    - status
    - etc.

/bloodInventory
  /{hospitalId}
    - bloodType quantities
    - lastUpdated
    - etc.

/bloodRequests
  /{requestId}
    - hospitalId
    - bloodType
    - quantity
    - status (pending/approved/rejected)
    - requestedDate
    - etc.

/donations
  /{donationId}
    - donorId
    - hospitalId
    - bloodType
    - quantity
    - donationDate
    - status
    - etc.

/donationSchedules
  /{scheduleId}
    - donorId
    - hospitalId
    - status
    - donationDate
    - etc.
```

## Setup Instructions

### 1. Initial Setup
```bash
# Install dependencies
npm install

# No additional setup needed - system uses Firebase
```

### 2. Configuration
- Firebase credentials are already configured in:
  - `firebase-integration.js`
  - `firebaseauth.js`
  - `firebase-realtime.js`
  - `auth-manager.js`
  - `app-functions.js`

### 3. Enable System Features
- Add `system-init.js` to your main HTML files
- Add `app-functions.js` import to all pages that need backend operations
- Add `page-loader.js` import for page initialization

## Testing the System

### 1. User Registration & Login

**Create Test Donor Account:**
```
Email: donor@test.com
Password: Test@123
Role: Donor
```

**Create Test Admin Account:**
```
Email: admin@test.com
Password: Admin@123
Role: Admin
```

**Create Test Hospital Account:**
```
Email: hospital@test.com
Password: Hospital@123
Role: Hospital
```

### 2. Test Workflows

#### Donor Workflow
1. Register as donor → `register.html`
2. Login → `login.html`
3. View dashboard → `donor-dashboard.html`
4. Schedule donation → `donate.html`
5. Check eligibility
6. Apply for eligibility check
7. View donation history

#### Admin Workflow
1. Login as admin → `login.html`
2. Access admin dashboard → `admin.html`
3. Manage eligibility → `admin-donor-eligibility.html`
4. Review verifications → `admin-donor-verifications.html`
6. Approve/reject blood requests → `admin-hospital-requests.html`
7. View blood inventory → `admin-inventory.html`
8. Generate reports → `admin-reports.html`

#### Hospital Workflow
1. Login as hospital → `login.html`
2. Access dashboard → `hospital-dashboard.html`
3. View blood inventory → `hospital-inventory.html`
4. Create blood requests
5. Schedule donor screening events
6. Manage donation schedules
7. Track donations

## Troubleshooting

### Issue: "Access denied" on admin page

**Solution:**
Make sure user role is set to "admin" in Firebase database:
```javascript
// Check user role
const user = await authManager.getCurrentUserData();
console.log('User role:', user?.role);
```

### Issue: Blood inventory not showing

**Solution:**
1. Check if inventory data exists in Firebase
2. Verify hospital ID matches inventory records
3. Run diagnostics: `window.diagnoseBloodConnect()`

### Issue: Pages not loading properly

**Solution:**
1. Open browser console (F12)
2. Run `window.checkBloodConnectLibraries()` to check all modules
3. Check for JavaScript errors
4. Verify Firebase is initialized correctly

### Issue: Donations not being saved

**Solution:**
1. Check Firebase Realtime Database permissions
2. Verify donation data structure matches schema
3. Check browser console for network errors
4. Ensure user is authenticated

## Browser Console Diagnostics

Open browser console (F12) and run these commands:

```javascript
// Check system status
window.diagnoseBloodConnect()

// Check libraries
window.checkBloodConnectLibraries()

// Get current user
const user = await authManager.getCurrentUserData()
console.log('Current user:', user)

// Check blood inventory
const inventory = await bloodConnectDB.getBloodInventory()
console.log('Inventory:', inventory)

// Check users
const users = await bloodConnectDB.getUsers()
console.log('Users:', users)

// Check donations
const donations = await bloodConnectDB.getDonations()
console.log('Donations:', donations)
```

## Common Functions Reference

### Authentication Functions
```javascript
// Import in your page
import appFunctions from './app-functions.js'

// Logout
await appFunctions.logout()

// Get user data
const userData = await appFunctions.getUserData(userId)
```

### Donor Functions
```javascript
// Get donor dashboard
const dashboard = await appFunctions.getDonorDashboard(donorId)

// Schedule donation
await appFunctions.scheduleDonation({
  donorId,
  hospitalId,
  bloodType,
  donationDate
})

// Check eligibility
const eligibility = await appFunctions.checkDonorEligibility(donorId)

// Get donation schedules
const schedules = await appFunctions.getDonationSchedules(donorId)
```

### Admin Functions
```javascript
// Get admin dashboard
const dashboard = await appFunctions.getAdminDashboard()

// Get blood inventory
const inventory = await appFunctions.getBloodInventory()

// Get all users
const users = await appFunctions.getUsers()
```

### Hospital Functions
```javascript
// Get hospital dashboard
const dashboard = await appFunctions.getHospitalDashboard(hospitalId)

// Create blood request
await appFunctions.createBloodRequest({
  hospitalId,
  bloodType,
  quantity,
  patientName
})

// Get hospital blood requests
const requests = await appFunctions.getHospitalBloodRequests(hospitalId)

// Create hospital event
await appFunctions.createHospitalEvent({
  hospitalId,
  eventName,
  eventDate,
  location
})
```

## API Response Format

All functions return success/error responses:

```javascript
// Success response
{
  success: true,
  id: "generated_id",
  message: "Operation successful"
}

// Error response
{
  success: false,
  message: "Error description"
}
```

## Security Notes

1. All pages check user authentication before loading
2. Role-based access control is enforced
3. Firebase security rules should be configured appropriately
4. Sensitive data is encrypted in transit
5. Session timeouts are configured in page-loader.js

## Performance Tips

1. Use `bloodConnectDB` for all Firebase operations
2. Cache frequently accessed data
3. Implement pagination for large datasets
4. Use real-time listeners only when necessary
5. Unsubscribe from listeners when pages are closed

## Support & Development

For issues or questions:
1. Check browser console for error messages
2. Run `window.diagnoseBloodConnect()` for system status
3. Review Firebase console for data/permissions issues
4. Check network tab in browser DevTools for API errors

## Version Info
- BloodConnect v1.0
- Firebase SDK v10.11.1
- Bootstrap v5.3.0
- Date: December 2025

---

**Last Updated:** December 12, 2025
