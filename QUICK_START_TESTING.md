# BloodConnect - Quick Start & Testing Guide

## 🚀 Quick Start

### 1. System Validation
Open browser console and run:
```javascript
window.validateBloodConnect()
```

This will test all libraries, authentication, database, and functions.

### 2. Run Diagnostics
```javascript
window.diagnoseBloodConnect()
```

Shows current user, database access, and available functions.

## 🧪 Testing All Three Workflows

### SETUP: Create Test User Accounts

1. Go to `register.html`
2. Create these accounts:

**Test Donor:**
```
Name: John Donor
Email: donor@test.com
Password: Test@12345
Blood Type: O+
Role: Donor
```

**Test Admin:**
```
Name: Jane Admin
Email: admin@test.com
Password: Admin@12345
Role: Admin
```

**Test Hospital:**
```
Name: Medical Hospital
Email: hospital@test.com
Password: Hospital@12345
Role: Hospital
```

---

## 👤 DONOR WORKFLOW TEST

### Step 1: Login as Donor
```
URL: /login.html
Email: donor@test.com
Password: Test@12345
```

**Expected:**
- Redirect to `donor-dashboard.html`
- See personalized greeting with donor name
- Statistics show: 0 donations, 0 appointments

### Step 2: Dashboard Functions
```
Expected visible sections:
✓ Welcome banner with donor name
✓ Stats (Total Donations, Upcoming Appointments, Lives Saved, Days Until Eligible)
✓ Quick Actions (Schedule Donation, Update Profile, View History)
✓ Recent Activity (Recent Donations table - empty)
✓ Donation Schedule (empty initially)
✓ Hospital Events (nearby blood drives)
✓ Eligibility Status (checking...)
```

### Step 3: Schedule Donation
```
URL: /donate.html
Actions:
1. Click "Schedule Donation" button on dashboard
2. Fill form:
   - Hospital: Select any available
   - Blood Type: O+
   - Preferred Date: Tomorrow or later
   - Time: 10:00 AM
3. Click "Schedule Donation"
```

**Expected:**
- Success message
- Donation appears in "My Donation Schedule" section
- Status: "pending_screening"

### Step 4: Check Eligibility
```
Actions:
1. View dashboard
2. Check "Donation Eligibility Status" section
3. For first-time donor: Shows "Eligible to Donate"
4. After donation: Shows "You can donate in 56 days"
```

### Step 5: Apply for Eligibility Check
```
Actions:
1. If applicable, scroll to "Apply for Eligibility Check" section
2. Click "Apply for Eligibility Check" button
```

**Expected:**
- Alert: "Eligibility check application submitted!"
- Application recorded in database

---

## 🏥 HOSPITAL WORKFLOW TEST

### Step 1: Login as Hospital
```
URL: /login.html
Email: hospital@test.com
Password: Hospital@12345
```

**Expected:**
- Redirect to `hospital-dashboard.html`
- Hospital name in title
- Dashboard statistics

### Step 2: Dashboard Sections
```
Expected visible:
✓ Hospital Stats (Total Blood Units, Pending Requests, Active Patients, Urgent Alerts)
✓ Quick Actions (Request Blood, Check Inventory, Manage Patients, Schedule Event)
✓ Recent Blood Requests (table - empty or existing requests)
✓ Blood Type Distribution (chart)
✓ Donation Screenings (table - empty initially)
✓ Upcoming Events (empty)
✓ Emergency Alerts (none)
```

### Step 3: Request Blood
```
Actions:
1. Click "Request Blood" button
2. Fill form:
   - Blood Type: O+
   - Quantity: 5 units
   - Patient Name: Test Patient
   - Urgency: Normal
3. Click "Submit Request"
```

**Expected:**
- Success: Request appears in "Recent Blood Requests"
- Status: "pending" (awaiting admin approval)

### Step 4: Schedule Donation Event
```
Actions:
1. Click "Schedule Event" button in Quick Actions
2. Modal appears with form:
   - Event Name: "Monthly Blood Drive"
   - Event Date: Future date
   - Event Time: 10:00 AM
   - Location: Hospital address
   - Description: Optional
3. Click "Schedule Event"
```

**Expected:**
- Success: Event appears in "Upcoming Events"
- Notifications sent to all donors and admins

### Step 5: Manage Donors Screening
```
Actions:
1. Check "Donation Screenings" table
2. Find any pending donor (from Step 3 of Donor workflow)
3. Click "Schedule Screening" if status is "pending_screening"
4. Fill screening details:
   - Screening Date: Tomorrow
   - Screening Time: 2:00 PM
   - Notes: Optional
5. Click "Schedule Screening"
```

**Expected:**
- Donor receives notification of scheduled screening
- Status updates to "screening_scheduled"

### Step 6: Determine Donor Eligibility
```
Actions:
1. In Donation Screenings, find scheduled screening
2. Click "Mark Eligible" or "Mark Ineligible"
   - If "Mark Eligible": Donor gets eligibility notification
   - If "Mark Ineligible": Provide reason for ineligibility
3. Click confirm
```

**Expected:**
- Donation status updates to "screening_passed" or "screening_failed"
- Donor receives notification with result
- Admin notified of eligibility determination

---

## 👨‍💼 ADMIN WORKFLOW TEST

### Step 1: Login as Admin
```
URL: /login.html
Email: admin@test.com
Password: Admin@12345
```

**Expected:**
- Redirect to `admin.html`
- See admin dashboard with all sections
- Blood stock overview for all blood types

### Step 2: Dashboard Overview
```
Expected Cards/Sections:
✓ Total Blood Stock Across All Hospitals (read-only)
✓ Admin Management Options:
  - Manage Users
  - Manage Hospitals
  - Blood Inventory
  - Approval Notifications
  - Hospital Requests
  - Donor Registrations
  - Donor Eligibility
  - Donor Verifications
  - Reports & Analytics
```

### Step 3: Manage Donor Eligibility
```
URL: /admin-donor-eligibility.html
Actions:
1. View list of all donors
2. Click "Mark Eligible" or "Mark Ineligible" buttons
3. Confirm action
```

**Expected:**
- Donor eligibility status updates
- Donor receives notification
- Status reflects in donor dashboard

### Step 4: Review Blood Inventory
```
URL: /admin-inventory.html
Actions:
1. View blood stock by type
2. See totals across all hospitals
3. Check availability status
```

**Expected:**
- All blood types listed (A+, A-, B+, B-, AB+, AB-, O+, O-)
- Quantities show 0 initially (no data yet)
- Status shows "Available" or "Out of Stock"

### Step 5: Approve Blood Requests
```
URL: /admin-hospital-requests.html
Actions:
1. View pending blood requests (from Hospital Step 3)
2. Click "Approve" or "Reject"
3. If rejecting, provide reason
```

**Expected:**
- Hospital receives notification of approval/rejection
- Request status updates in hospital dashboard
- If approved, inventory should be allocated

### Step 6: Manage Hospitals
```
URL: /admin-manage-hospitals.html
Actions:
1. View list of all hospitals
2. Click on hospital to view details
3. Check inventory levels
4. View request history
```

**Expected:**
- Hospital list with all registered hospitals
- Hospital details accessible
- Inventory shown by blood type

### Step 7: Generate Reports
```
URL: /admin-reports.html
Actions:
1. View system statistics
2. Check:
   - Total blood units in system
   - Pending requests
   - Completed requests
   - Total donations
3. View graphs and charts if available
```

**Expected:**
- Statistics calculated from database
- Reports generated correctly
- Charts display if implemented

### Step 8: Donor Verifications (Removed)

The donor verification workflow and admin verification pages have been removed from this installation. Use donor dashboards and admin eligibility tools for donor management.

---

## ✅ VERIFICATION CHECKLIST

### Authentication & Authorization
- [ ] Donors can login and see donor dashboard
- [ ] Admins can login and see admin dashboard
- [ ] Hospitals can login and see hospital dashboard
- [ ] Non-authenticated users redirected to login
- [ ] Users can logout successfully

### Donor Features
- [ ] View dashboard with statistics
- [ ] Schedule donation with hospital and date
- [ ] Check donation eligibility
- [ ] View donation history
- [ ] Receive notifications of screening invites
- [ ] Receive eligibility determination notifications

### Hospital Features
- [ ] View hospital dashboard
- [ ] Request blood (quantity, type, urgency)
- [ ] View blood requests status
- [ ] Schedule donation events
- [ ] Manage donor screenings
- [ ] Mark donors as eligible/ineligible
- [ ] Receive approval/rejection notifications

### Admin Features
- [ ] View overall blood inventory
- [ ] Manage all users (view, edit, delete)
- [ ] Approve/reject donor registrations
- [ ] Review and approve/reject blood requests
- [ ] Determine donor eligibility
- [ ] Review donor verification documents
- [ ] View system reports and analytics
- [ ] Manage hospital accounts

### Database Operations
- [ ] Data saves to Firebase correctly
- [ ] Real-time updates work
- [ ] Notifications created and delivered
- [ ] Eligibility records updated
- [ ] Screening records saved

### Error Handling
- [ ] Invalid credentials show error
- [ ] Missing required fields show validation errors
- [ ] Network errors handled gracefully
- [ ] Database errors shown to user
- [ ] Page redirects work on errors

---

## 🐛 Troubleshooting During Testing

### Page won't load
```javascript
// Check in console
window.validateBloodConnect()
window.checkBloodConnectLibraries()
```

### Data not showing
```javascript
// Check database access
const users = await bloodConnectDB.getUsers()
console.log('Users:', users)

const inventory = await bloodConnectDB.getBloodInventory()
console.log('Inventory:', inventory)
```

### User not authenticated
```javascript
// Check current user
const user = await authManager.getCurrentUserData()
console.log('Current user:', user)
```

### Notifications not appearing
```javascript
// Check notifications
const notifications = await bloodConnectDB.getNotifications(userId)
console.log('Notifications:', notifications)
```

---

## 📊 Expected Test Results

### Successful Test
```
✓ All pages load without errors
✓ All three user roles can login
✓ Dashboard data displays correctly
✓ CRUD operations work (Create, Read, Update, Delete)
✓ Notifications are sent and received
✓ Role-based access control enforced
✓ Database operations complete successfully
```

### Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "Access denied" on admin page | Verify user role is "admin" in Firebase |
| No data showing on dashboard | Check Firebase Realtime DB has data, not just Firestore |
| Notifications not appearing | Verify notifications path in Firebase, check user ID |
| Can't schedule donation | Ensure date is in future, required fields filled |
| Blood inventory empty | Add sample data to bloodInventory path in Firebase |

---

## 📝 Test Report Template

Date: ___________
Tester: ___________

### Test Results
- Donor Workflow: [ ] PASS [ ] FAIL
- Admin Workflow: [ ] PASS [ ] FAIL
- Hospital Workflow: [ ] PASS [ ] FAIL

### Issues Found
1. ________________
2. ________________
3. ________________

### Notes
_________________________________________________

---

**Ready to test? Start with Step 1: System Validation!**

For questions or issues, run `window.validateBloodConnect()` and check the console output.
