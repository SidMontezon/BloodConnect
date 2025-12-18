# BloodConnect - Quick Start Guide

## 🚀 Start Your System (Choose One Method)

### Option 1: Python (Easiest - Most systems have Python)
```bash
cd c:\Users\LENOVO\Documents\OnlineBloodBank\OnlineBloodBank\BloodConnect
python -m http.server 3000
```
Then open: **http://localhost:3000**

### Option 2: Node.js (if you have Node installed)
```bash
cd c:\Users\LENOVO\Documents\OnlineBloodBank\OnlineBloodBank\BloodConnect
npx http-server -p 3000
```
Then open: **http://localhost:3000**

### Option 3: Windows PowerShell
```powershell
cd "c:\Users\LENOVO\Documents\OnlineBloodBank\OnlineBloodBank\BloodConnect"
python -m http.server 3000
```
Then open: **http://localhost:3000**

---

## 📋 Test Accounts (Use These to Login)

### Admin Account
- **Email:** admin@test.com
- **Password:** Admin@12345

### Hospital Account
- **Email:** hospital@test.com
- **Password:** Hospital@12345

### Donor Account
- **Email:** donor@test.com
- **Password:** Donor@12345

---

## ✅ What Works in This System

### Index & Public Pages
- ✅ `index.html` - Home page (public)
- ✅ `login.html` - Login page (public)
- ✅ `register.html` - Create new account (public)
- ✅ `about.html` - About page (public)
- ✅ `contact.html` - Contact page (public)
- ✅ `faqs.html` - FAQ page (public)

### Admin Dashboards
- ✅ `admin.html` - Admin main dashboard
- ✅ `admin-users.html` - Manage all users
- ✅ `admin-manage-hospitals.html` - Manage hospitals
- ✅ `admin-inventory.html` - Monitor blood inventory
- ✅ `admin-approval-notifications.html` - View notifications
- ✅ `admin-donor-eligibility.html` - Manage donor eligibility
- ✅ `admin-donor-verifications.html` - Verify donors
- ✅ `admin-hospital-requests.html` - Review requests
- ✅ `admin-reports.html` - Generate reports

### Hospital Dashboards
- ✅ `hospital-dashboard.html` - Main dashboard
- ✅ `hospital-requests.html` - View blood requests
- ✅ `hospital-request-blood.html` - Submit new blood request
- ✅ `hospital-inventory.html` - Manage blood stock
- ✅ `hospital-patients.html` - Manage patients

### Donor Dashboards
- ✅ `donor-dashboard.html` - Main donor dashboard
- ✅ `donor-profile.html` - View/edit profile
- ✅ `donor-history.html` - Donation history
- ✅ `donate.html` - Schedule blood donation
- ✅ `donor-profile-verification.html` - Verify identity

---

## 🔧 System Architecture

### How It Works
1. **Frontend:** Pure HTML/CSS/JavaScript (no build needed)
2. **Backend:** Firebase Realtime Database (cloud-hosted)
3. **Authentication:** Firebase Authentication
4. **All data flows:** Pages → JavaScript modules → Firebase SDK → Cloud Database

### Core JavaScript Files
- `auth-manager.js` - Handles user login/logout and session
- `bloodConnectDB.js` - Database wrapper with all CRUD operations
- `firebase-realtime.js` - Firebase initialization and data methods
- `app-functions.js` - Business logic for donors, admins, hospitals
- `system-init.js` - System diagnostics
- `rate-limiter.js` - Login rate limiting

### Styling
- `red-cross-styles.css` - Red Cross themed design
- `styles.css` - Professional design system
- Bootstrap 5.3.0 - Responsive layout

---

## 🧪 Testing Workflows

### Test Donor Workflow
1. Open http://localhost:3000/login.html
2. Login as: donor@test.com / Donor@12345
3. You should see: donor-dashboard.html
4. Try:
   - View donation history
   - Edit your profile
   - Schedule a blood donation

### Test Hospital Workflow
1. Open http://localhost:3000/login.html
2. Login as: hospital@test.com / Hospital@12345
3. You should see: hospital-dashboard.html
4. Try:
   - Request blood from inventory
   - Manage blood inventory
   - Schedule blood donation events
   - Manage patients

### Test Admin Workflow
1. Open http://localhost:3000/login.html
2. Login as: admin@test.com / Admin@12345
3. You should see: admin.html
4. Try:
   - Manage all users
   - Manage hospitals
   - Review blood requests
   - Generate reports
   - Monitor inventory

---

## 🐛 Troubleshooting

### "Module not found" error?
- Make sure you're running via HTTP (not file://)
- Check browser console (F12) for errors

### "Firebase error"?
- Check you have internet connection
- Firebase config is correct in auth-manager.js

### "Cannot read property X of undefined"?
- Wait a few seconds for page to load
- Check browser console for specific error
- Reload the page

### No data showing?
- Make sure you're logged in
- Check browser console (F12) for errors
- Try creating a new account via register.html

---

## 📞 Support

This is a working prototype system. All core features are functional:
- ✅ User authentication (login/register/logout)
- ✅ Role-based access (admin/hospital/donor)
- ✅ Blood inventory management
- ✅ Blood request processing
- ✅ Donor scheduling
- ✅ Notifications
- ✅ Real-time database updates

Just start the server and test!
