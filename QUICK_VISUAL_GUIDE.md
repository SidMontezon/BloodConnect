# BloodConnect - Quick Visual Guide 📊

## 🚀 Getting Started (2 Steps)

### Step 1: Open Terminal
```
Windows: Command Prompt or PowerShell
Mac: Terminal
Linux: Terminal
```

### Step 2: Run Command
```bash
cd c:\Users\LENOVO\Documents\OnlineBloodBank\OnlineBloodBank\BloodConnect
python -m http.server 3000
```

**You should see:**
```
Serving HTTP on 0.0.0.0 port 3000 (http://0.0.0.0:3000/) ...
```

### Step 3: Open Browser
```
http://localhost:3000
```

---

## 🔐 Login Credentials

### Admin
```
📧 admin@test.com
🔑 Admin@12345
```

### Hospital  
```
📧 hospital@test.com
🔑 Hospital@12345
```

### Donor
```
📧 donor@test.com
🔑 Donor@12345
```

---

## 🗺️ Site Map

```
http://localhost:3000/
│
├── Public Pages (No Login)
│   ├── index.html            ← Home page
│   ├── login.html            ← User login
│   ├── register.html         ← Create account
│   ├── about.html            ← About us
│   ├── contact.html          ← Contact
│   └── faqs.html             ← FAQ
│
├── 👤 Donor Pages (Login Required)
│   ├── donor-dashboard.html  ← Main dashboard
│   ├── donate.html           ← Schedule donation
│   ├── donor-history.html    ← See past donations
│   └── donor-profile.html    ← Edit profile
│
├── 🏥 Hospital Pages (Login Required)
│   ├── hospital-dashboard.html      ← Main dashboard
│   ├── hospital-inventory.html      ← Manage blood stock
│   ├── hospital-request-blood.html  ← Request blood
│   ├── hospital-requests.html       ← View requests
│   └── hospital-patients.html       ← Manage patients
│
└── 👨‍💼 Admin Pages (Login Required)
    ├── admin.html                      ← Main dashboard
    ├── admin-users.html                ← Manage users
    ├── admin-manage-hospitals.html     ← Manage hospitals
    ├── admin-inventory.html            ← Monitor blood stock
    ├── admin-hospital-requests.html    ← Review requests
    ├── admin-donor-eligibility.html    ← Check eligibility
    ├── admin-donor-verifications.html  ← Verify donors
    └── admin-reports.html              ← View reports
```

---

## 👤 Donor Workflow

```
                    ┌─────────────────┐
                    │  Start Here     │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ http://localhost│
                    │      :3000      │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Click "Login"  │
                    └────────┬────────┘
                             │
        ┌────────────────────┴────────────────────┐
        │                                         │
┌───────▼────────┐                      ┌────────▼─────────┐
│ New Donor?     │                      │ Existing Donor?  │
│ Click Register │                      │ Enter Email &    │
│ Create Account │                      │ Password         │
└───────┬────────┘                      └────────┬─────────┘
        │                                        │
        └────────────────┬───────────────────────┘
                         │
            ┌────────────▼──────────────┐
            │ Donor Dashboard Loaded    │
            │ - View Stats              │
            │ - Donation History        │
            │ - Eligibility Status      │
            └────────────┬──────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
┌────────▼────────┐ ┌────▼─────────┐ ┌──▼──────────────┐
│ Schedule a New  │ │ View History │ │ Edit Profile    │
│ Donation        │ │ of Donations │ │ Update Info     │
│ (donate.html)   │ │ (history)    │ │ (profile.html)  │
└─────────────────┘ └──────────────┘ └─────────────────┘
```

---

## 🏥 Hospital Workflow

```
                    ┌─────────────────┐
                    │  Start Here     │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ http://localhost│
                    │      :3000      │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Login Page     │
                    └────────┬────────┘
                             │
                ┌────────────▼────────────────┐
                │ Enter Hospital Credentials: │
                │ hospital@test.com          │
                │ Hospital@12345             │
                └────────────┬───────────────┘
                             │
                ┌────────────▼──────────────────┐
                │ Hospital Dashboard           │
                │ - Blood Inventory Stats      │
                │ - Pending Requests           │
                │ - Scheduled Screenings       │
                │ - Upcoming Events            │
                └────────────┬─────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌───────▼────────┐  ┌──────▼──────┐
│ Manage Blood   │  │ Request Blood  │  │ Add Patient │
│ Inventory      │  │ From System    │  │             │
│ - Add Units    │  │ (req-blood)    │  │ (patients)  │
│ - Update Qty   │  │                │  │             │
│ (inventory)    │  └────────────────┘  └─────────────┘
└────────────────┘

        ┌────────────────────────┐
        │  Schedule Donation     │
        │  Event                 │
        │ - Date & Time          │
        │ - Location             │
        │ - Description          │
        │ (from dashboard)       │
        └────────────────────────┘
```

---

## 👨‍💼 Admin Workflow

```
                    ┌─────────────────┐
                    │  Start Here     │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ http://localhost│
                    │      :3000      │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Login Page     │
                    └────────┬────────┘
                             │
                ┌────────────▼────────────────┐
                │ Enter Admin Credentials:    │
                │ admin@test.com             │
                │ Admin@12345                │
                └────────────┬───────────────┘
                             │
                ┌────────────▼──────────────────┐
                │ Admin Dashboard              │
                │ - Blood Type Inventory       │
                │ - System Overview            │
                │ - Recent Activity            │
                └────────────┬─────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼──────────┐ ┌──────▼────────────┐ ┌─────▼──────────┐
│ Manage Users     │ │ Manage Hospitals  │ │ Monitor        │
│ - View All       │ │ - View All        │ │ Inventory      │
│ - Edit Info      │ │ - Edit Details    │ │ - By Blood     │
│ - Delete         │ │ - Add New         │ │   Type         │
│ (users.html)     │ │ (manage-hosp)     │ │ (inventory)    │
└──────────────────┘ └───────────────────┘ └────────────────┘

   ┌──────────────────────────────────┐
   │ Review Blood Requests            │
   │ - View from All Hospitals        │
   │ - Approve or Reject              │
   │ - Send Notifications             │
   │ (hospital-requests.html)         │
   └──────────────────────────────────┘

   ┌──────────────────────────────────┐
   │ Donor Verification               │
   │ - Review Applications            │
   │ - Approve/Reject                 │
   │ - Send Results                   │
   │ (donor-verifications.html)       │
   └──────────────────────────────────┘

   ┌──────────────────────────────────┐
   │ Generate Reports                 │
   │ - Blood Stock Analysis           │
   │ - Request Statistics             │
   │ - Donor Activity                 │
   │ (reports.html)                   │
   └──────────────────────────────────┘
```

---

## 📱 Mobile Responsive

All pages work on:
- ✅ Desktop (1920px+)
- ✅ Laptop (1366px+)
- ✅ Tablet (768px+)
- ✅ Mobile (320px+)

Just resize your browser or test on phone with:
```
http://[your-computer-ip]:3000
```

---

## 🔄 Data Flow

```
┌─────────────────────────────────┐
│   Browser                       │
│   (HTML + JavaScript)           │
└──────────────┬──────────────────┘
               │
               │ ES Module Import
               ▼
        ┌──────────────────┐
        │ auth-manager.js  │
        │ bloodConnectDB   │
        │ app-functions.js │
        └────────┬─────────┘
                 │
                 │ Firebase SDK
                 ▼
        ┌──────────────────────┐
        │ Firebase Realtime    │
        │ Database             │
        │ (Cloud)              │
        └──────────────────────┘
                 ▲
                 │
        Data returns in real-time
```

---

## ❌ If Something Goes Wrong

### No data showing?
1. Refresh the page (F5)
2. Check internet connection
3. Wait 3 seconds for Firebase to load
4. Check browser console (F12)

### Functions not working?
1. Open Console (F12)
2. Look for red error messages
3. Check if you're logged in
4. Try logging out and back in

### Logout not working?
1. Close the browser tab
2. Or clear cache (Ctrl+Shift+Del)
3. Open new tab to http://localhost:3000

### Server won't start?
1. Check if port 3000 is available
2. Try different port: `python -m http.server 5000`
3. Check Python is installed: `python --version`

---

## 📊 System Features at a Glance

| Feature | Donor | Hospital | Admin |
|---------|:-----:|:--------:|:-----:|
| Login/Register | ✅ | ✅ | ✅ |
| Dashboard | ✅ | ✅ | ✅ |
| Schedule Donation | ✅ | ✅ | ✅ |
| Request Blood | ❌ | ✅ | ✅ |
| Manage Inventory | ❌ | ✅ | ✅ |
| Manage Users | ❌ | ❌ | ✅ |
| Manage Hospitals | ❌ | ❌ | ✅ |
| View Reports | ❌ | ❌ | ✅ |
| Notifications | ✅ | ✅ | ✅ |
| Logout | ✅ | ✅ | ✅ |

---

## 🎯 Common Tasks

### Task: "I want to request blood"
1. Login as hospital
2. Go to "Request Blood" page
3. Fill in patient details
4. Select blood type and quantity
5. Click Submit
6. Admin will review and approve

### Task: "I want to schedule a donation"
1. Login as donor
2. Go to "Donate" page
3. Select date, time, hospital
4. Click Schedule
5. Hospital will screen and confirm

### Task: "I want to add blood inventory"
1. Login as hospital
2. Go to "Inventory" page
3. Click "Add Blood Unit"
4. Enter blood type, quantity
5. Click Save
6. Inventory updates in real-time

### Task: "I want to see all requests"
1. Login as admin
2. Go to "Hospital Requests"
3. View all pending requests
4. Click to see details
5. Approve or reject

---

## 🎊 Ready?

```
python -m http.server 3000
→ http://localhost:3000
→ Login with test account
→ Start managing blood bank!
```

**That's it! You're done. 🎉**
