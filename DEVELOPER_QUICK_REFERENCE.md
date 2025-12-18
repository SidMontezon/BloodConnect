# BloodConnect - Developer Quick Reference Card

## 🚀 Quick Start (60 seconds)

```javascript
// Step 1: Validate system (in browser console)
window.validateBloodConnect()

// Step 2: Check current user
const user = await authManager.getCurrentUserData()
console.log('User:', user.email, 'Role:', user.role)

// Step 3: Try a function
const dashboard = await appFunctions.getDonorDashboard(user.uid)
console.log('Dashboard:', dashboard)
```

---

## 📚 Core Imports

```javascript
// In any page, import what you need:

// Auth Management
import authManager from './auth-manager.js'

// Database Operations
import bloodConnectDB from './bloodConnectDB.js'

// Business Logic (use this for everything!)
import appFunctions from './app-functions.js'

// Page Initialization
import pageLoader from './page-loader.js'
```

---

## 🔑 Essential Functions

### Authentication
```javascript
authManager.getAuthUser()                    // Current Firebase user
authManager.getCurrentUserData()             // User data with role
authManager.logoutAndRedirect()              // Logout
authManager.addAuthListener(callback)        // Listen for auth changes
```

### Donor Operations
```javascript
appFunctions.getDonorDashboard(donorId)      // Dashboard stats
appFunctions.scheduleDonation({...})         // Schedule donation
appFunctions.checkDonorEligibility(donorId)  // Check 56-day rule
appFunctions.getDonationSchedules(donorId)   // Get scheduled donations
appFunctions.applyForEligibilityCheck(uid)   // Apply for verification
```

### Hospital Operations
```javascript
appFunctions.getHospitalDashboard(hospitalId)      // Hospital stats
appFunctions.createBloodRequest({...})             // Request blood
appFunctions.getHospitalBloodRequests(hospitalId)  // Get requests
appFunctions.createHospitalEvent({...})            // Schedule event
appFunctions.getHospitalDonationSchedules(id)      // Get screenings
appFunctions.approveDonationSchedule(scheduleId)   // Approve screening
```

### Admin Operations
```javascript
appFunctions.getAdminDashboard()             // System overview
appFunctions.getUsers()                      // All users
appFunctions.getBloodInventory()             // All blood stock
appFunctions.approveBloodRequest(requestId)  // Approve request
appFunctions.setDonorEligibility(donorId)    // Set eligibility
```

### Notifications
```javascript
appFunctions.createNotification({             // Send notification
  userId,
  type: 'donation',
  title: 'Notification Title',
  message: 'Notification message',
  priority: 'high'
})

appFunctions.getNotifications(userId)         // Get all notifications
appFunctions.markNotificationAsRead(notifId)  // Mark as read
```

---

## 🎯 Page Setup Template

```html
<head>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <!-- Your content -->
  
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <script type="module">
    import authManager from './auth-manager.js'
    import appFunctions from './app-functions.js'
    import pageLoader from './page-loader.js'
    
    // Initialize page
    authManager.addAuthListener((user, userData) => {
      if (!user) {
        window.location.href = 'login.html'
        return
      }
      
      // Verify role if needed
      if (userData.role !== 'donor') {
        alert('Access denied')
        window.location.href = 'login.html'
        return
      }
      
      // Load page data
      loadPageData(userData)
      pageLoader.addLogoutHandler('logoutBtn')
    })
    
    async function loadPageData(userData) {
      try {
        // Load your data
        const data = await appFunctions.getDonorDashboard(userData.uid)
        // Update UI
      } catch (error) {
        console.error('Error:', error)
        pageLoader.showMessage('Error loading data', 'danger')
      }
    }
  </script>
</body>
```

---

## 🔧 Common Tasks

### Create a Button That Calls a Function
```html
<button onclick="performAction()">Click Me</button>

<script type="module">
  import appFunctions from './app-functions.js'
  
  window.performAction = async () => {
    try {
      const result = await appFunctions.createBloodRequest({
        hospitalId: 'hospital123',
        bloodType: 'O+',
        quantity: 5
      })
      
      if (result.success) {
        alert('Request created: ' + result.id)
      } else {
        alert('Error: ' + result.message)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }
</script>
```

### Load and Display Data in a Table
```html
<table id="myTable">
  <tbody id="tableBody"></tbody>
</table>

<script type="module">
  import appFunctions from './app-functions.js'
  
  async function loadTable() {
    try {
      const data = await appFunctions.getUsers()
      const tbody = document.getElementById('tableBody')
      tbody.innerHTML = ''
      
      Object.entries(data).forEach(([id, user]) => {
        const row = document.createElement('tr')
        row.innerHTML = `
          <td>${user.email}</td>
          <td>${user.role}</td>
          <td>${user.firstName} ${user.lastName}</td>
        `
        tbody.appendChild(row)
      })
    } catch (error) {
      console.error('Error loading table:', error)
    }
  }
  
  loadTable()
</script>
```

### Show a Success/Error Message
```javascript
import pageLoader from './page-loader.js'

// Show success
pageLoader.showMessage('Operation successful!', 'success', 3000)

// Show error
pageLoader.showMessage('Something went wrong', 'danger', 3000)

// Show info
pageLoader.showMessage('Please wait...', 'info', 5000)
```

### Format Date and Status
```javascript
import pageLoader from './page-loader.js'

// Format date
const dateStr = pageLoader.formatDate('2025-12-20', 'date')          // 12/20/2025
const timeStr = pageLoader.formatDate('2025-12-20T14:30', 'time')    // 2:30:00 PM
const fullStr = pageLoader.formatDate('2025-12-20T14:30', 'datetime') // 12/20/2025, 2:30 PM

// Format status
const badge = pageLoader.formatStatus('pending')  // <span class="badge bg-warning">pending</span>
```

---

## 🧪 Browser Console Commands

```javascript
// Validate entire system
window.validateBloodConnect()

// Run diagnostics
window.diagnoseBloodConnect()

// Check libraries
window.checkBloodConnectLibraries()

// Get current user
const user = await authManager.getCurrentUserData()

// Get all users
const users = await bloodConnectDB.getUsers()

// Get inventory
const inv = await bloodConnectDB.getBloodInventory()

// Get donations
const donations = await bloodConnectDB.getDonations()

// Create test notification
await appFunctions.createNotification({
  userId: 'user123',
  type: 'test',
  title: 'Test Notification',
  message: 'This is a test'
})
```

---

## 🚨 Debugging Tips

### Page Won't Load
```javascript
// Check what went wrong
window.validateBloodConnect()

// Check auth
const user = await authManager.getAuthUser()
console.log('Authenticated:', !!user)

// Check modules
window.checkBloodConnectLibraries()
```

### Data Not Showing
```javascript
// Check database connection
const data = await bloodConnectDB.getUsers()
console.log('Database working:', !!data)

// Check specific data
const users = await bloodConnectDB.getUsers()
console.log('Users:', users)

// Check inventory
const inv = await bloodConnectDB.getBloodInventory()
console.log('Inventory:', inv)
```

### Function Not Found
```javascript
// Check app functions available
console.log('App functions:', Object.keys(appFunctions))

// Check specific function
console.log('Function exists:', typeof appFunctions.getDonorDashboard)
```

### User Not Authenticated
```javascript
// Check current user
const user = await authManager.getCurrentUserData()
console.log('User:', user)
console.log('Role:', user?.role)

// Check auth listener
authManager.addAuthListener((user, userData) => {
  console.log('Auth listener:', { user: user?.email, role: userData?.role })
})
```

---

## 📊 Response Format

All `appFunctions` return standardized responses:

```javascript
// Success
{
  success: true,
  id: "generated_id",          // For create operations
  message: "Success message"
}

// Error
{
  success: false,
  message: "Error description"
}
```

---

## 🔐 Role Check Template

```javascript
import authManager from './auth-manager.js'

// Check for specific role
authManager.addAuthListener((user, userData) => {
  if (!user) {
    // Not authenticated
    window.location.href = 'login.html'
    return
  }
  
  const userRole = userData?.role
  
  if (userRole === 'admin') {
    // Load admin page
  } else if (userRole === 'hospital') {
    // Load hospital page
  } else if (userRole === 'donor') {
    // Load donor page
  } else {
    // Unknown role
    window.location.href = 'login.html'
  }
})
```

---

## 💾 Save Operation Pattern

```javascript
async function saveData() {
  try {
    const result = await appFunctions.updateDonorProfile(userId, {
      firstName: 'John',
      email: 'john@example.com',
      phone: '+1234567890'
    })
    
    if (result.success) {
      pageLoader.showMessage('Profile updated!', 'success')
      // Refresh data if needed
    } else {
      pageLoader.showMessage(result.message, 'danger')
    }
  } catch (error) {
    console.error('Save error:', error)
    pageLoader.showMessage('Error saving data', 'danger')
  }
}
```

---

## 📱 Modal/Dialog Pattern

```javascript
async function showConfirmDialog(message) {
  return new Promise((resolve) => {
    if (window.confirm(message)) {
      resolve(true)
    } else {
      resolve(false)
    }
  })
}

// Usage
const confirmed = await showConfirmDialog('Delete this item?')
if (confirmed) {
  // Proceed with deletion
}
```

---

## 🎨 UI Update Pattern

```javascript
function updateUI(data) {
  // Update text
  document.getElementById('donorName').textContent = data.firstName
  
  // Update count
  document.getElementById('totalDonations').textContent = data.donationCount
  
  // Update badge
  document.getElementById('eligibilityBadge').className = 
    data.isEligible ? 'badge bg-success' : 'badge bg-danger'
  
  // Update table
  updateTable(data.donations)
}

function updateTable(rows) {
  const tbody = document.getElementById('tableBody')
  tbody.innerHTML = ''
  
  rows.forEach(row => {
    const tr = document.createElement('tr')
    tr.innerHTML = `
      <td>${row.date}</td>
      <td>${row.hospital}</td>
      <td><span class="badge bg-primary">${row.bloodType}</span></td>
    `
    tbody.appendChild(tr)
  })
}
```

---

## 🔄 Real-time Data Pattern

```javascript
// Listen to changes
let unsubscribe = null

function startListening() {
  unsubscribe = bloodConnectDB.listenToBloodInventory((data) => {
    console.log('Inventory updated:', data)
    updateUI(data)
  })
}

function stopListening() {
  if (unsubscribe) {
    unsubscribe()
  }
}

// Clean up when page unloads
window.addEventListener('beforeunload', () => {
  stopListening()
})
```

---

## 🎯 Form Submission Pattern

```javascript
document.getElementById('myForm').addEventListener('submit', async (e) => {
  e.preventDefault()
  
  try {
    // Get form data
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)
    
    // Validate
    if (!data.email || !data.password) {
      pageLoader.showMessage('All fields required', 'warning')
      return
    }
    
    // Submit
    const result = await appFunctions.someFunction(data)
    
    if (result.success) {
      pageLoader.showMessage('Saved successfully!', 'success')
      e.target.reset()
    } else {
      pageLoader.showMessage(result.message, 'danger')
    }
  } catch (error) {
    console.error('Form error:', error)
    pageLoader.showMessage('Error submitting form', 'danger')
  }
})
```

---

## 🆘 Error Handling Pattern

```javascript
async function safeOperation() {
  try {
    const result = await appFunctions.doSomething()
    
    if (!result.success) {
      // Operation failed but not an exception
      console.warn('Operation failed:', result.message)
      pageLoader.showMessage(result.message, 'warning')
      return false
    }
    
    return true
  } catch (error) {
    // Exception occurred
    console.error('Exception:', error)
    pageLoader.showMessage('An error occurred', 'danger')
    return false
  }
}
```

---

## 📞 Quick Troubleshooting

| Problem | Check |
|---------|-------|
| "Cannot read property 'addAuthListener'" | `window.checkBloodConnectLibraries()` |
| "appFunctions is undefined" | Import `app-functions.js` |
| "User not authenticated" | Check login page, run `window.diagnoseBloodConnect()` |
| "Database error" | Check Firebase console, verify data path |
| "Function not found" | Check function name spelling, run `Object.keys(appFunctions)` |

---

## 🎓 Getting Help

1. **Check Console**: Press F12, look for errors
2. **Run Validation**: `window.validateBloodConnect()`
3. **Check Docs**: See `SETUP_AND_TROUBLESHOOTING.md`
4. **Firebase Console**: Check database and permissions
5. **Network Tab**: Check API calls in DevTools

---

## 📌 Remember

- Always handle errors with try/catch
- Always show user feedback for operations
- Always check user is authenticated
- Always verify user has correct role
- Always clean up listeners on page unload
- Always use pageLoader for messages
- Always check console for errors

---

**Save this reference for quick lookups! 🚀**
