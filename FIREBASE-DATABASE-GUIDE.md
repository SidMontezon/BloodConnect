# Firebase Database Management Guide for BloodConnect

## 🗄️ **Database Structure Overview**

Your BloodConnect application uses **Firestore** (NoSQL database) with the following collections:

### **Collections:**
1. **`users`** - User accounts and profiles
2. **`verificationCodes`** - Temporary 2FA verification codes
3. **`bloodDonations`** - Blood donation records
4. **`bloodRequests`** - Blood request records

---

## 👥 **User Management**

### **User Document Structure:**
```javascript
// Collection: users
// Document ID: {userUID}
{
  name: "John Doe",
  email: "john@example.com",
  role: "donor" | "hospital" | "admin",
  emailVerified: true | false,
  twoFactorEnabled: true | false,
  phoneNumber: "+639123456789" | "",
  createdAt: timestamp,
  createdBy: "adminUID" // Optional: who created this user
}
```

### **Adding Users - 3 Methods:**

#### **Method 1: Through Admin Panel (Recommended)**
1. Login as admin
2. Go to Dashboard → "Manage Users"
3. Fill out the "Add New User" form
4. User is automatically created in Firebase Auth + Firestore

#### **Method 2: Through Application Signup**
1. Users register at `Signup.html`
2. System automatically creates user in both Firebase Auth and Firestore
3. Email verification is required

#### **Method 3: Direct Firebase Console**
1. Go to Firebase Console → Authentication → Users
2. Click "Add User"
3. Manually add user data to Firestore

---

## 🔧 **Firebase Console Operations**

### **Accessing Firebase Console:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `bloodconnect2-d094a`
3. Navigate to different sections

### **Authentication Management:**
- **Path:** Authentication → Users
- **Actions:**
  - View all users
  - Add new users manually
  - Disable/enable users
  - Reset passwords
  - Delete users

### **Firestore Database Management:**
- **Path:** Firestore Database → Data
- **Collections:**
  - `users` - User profiles
  - `verificationCodes` - 2FA codes
  - `bloodDonations` - Donation records
  - `bloodRequests` - Request records

---

## 📊 **Database Operations Guide**

### **1. View All Users**
```javascript
// In Firebase Console or your app
db.collection("users").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
    });
});
```

### **2. Add User Programmatically**
```javascript
// Add user to Firestore
db.collection("users").doc(userUID).set({
    name: "Jane Doe",
    email: "jane@example.com",
    role: "donor",
    emailVerified: true,
    twoFactorEnabled: false,
    phoneNumber: "",
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
});
```

### **3. Update User Data**
```javascript
// Update specific fields
db.collection("users").doc(userUID).update({
    twoFactorEnabled: true,
    phoneNumber: "+639123456789"
});
```

### **4. Delete User**
```javascript
// Delete from Firestore
db.collection("users").doc(userUID).delete();

// Delete from Authentication (requires admin SDK)
// This should be done through Firebase Console or Admin SDK
```

### **5. Query Users by Role**
```javascript
// Get all donors
db.collection("users").where("role", "==", "donor").get();

// Get all hospitals
db.collection("users").where("role", "==", "hospital").get();

// Get all admins
db.collection("users").where("role", "==", "admin").get();
```

---

## 🛡️ **Security Rules**

### **Current Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Verification codes - users can only access their own
    match /verificationCodes/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admin can read all users
    match /users/{userId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
  }
}
```

---

## 📱 **Admin Panel Features**

The `admin-users.html` page provides:

### **Add Users:**
- ✅ Full name, email, password
- ✅ Role selection (donor, hospital, admin)
- ✅ Phone number (optional)
- ✅ Email verification status
- ✅ 2FA enable/disable

### **View Users:**
- ✅ List all users with details
- ✅ Search by name or email
- ✅ Filter by role
- ✅ View verification status
- ✅ View 2FA status

### **Manage Users:**
- ✅ Delete users
- ✅ View user details
- ✅ Track creation date

---

## 🔍 **Common Database Queries**

### **Get User by Email:**
```javascript
db.collection("users").where("email", "==", "user@example.com").get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
        });
    });
```

### **Get Users Created Today:**
```javascript
const today = new Date();
today.setHours(0, 0, 0, 0);

db.collection("users").where("createdAt", ">=", today).get()
    .then((querySnapshot) => {
        // Process users created today
    });
```

### **Get Users with 2FA Enabled:**
```javascript
db.collection("users").where("twoFactorEnabled", "==", true).get()
    .then((querySnapshot) => {
        // Process users with 2FA enabled
    });
```

---

## 🚨 **Important Notes**

### **User Roles:**
- **`admin`** - Full access to all features
- **`hospital`** - Can manage blood requests and donations
- **`donor`** - Can donate blood and view their records

### **Security Considerations:**
- Always verify user authentication before database operations
- Use proper Firestore security rules
- Never expose sensitive data in client-side code
- Regularly audit user permissions

### **Data Validation:**
- Email addresses must be valid
- Phone numbers should follow +63 format
- Roles must be one of: donor, hospital, admin
- Timestamps should use `serverTimestamp()`

---

## 🎯 **Quick Start Guide**

### **To Add Your First Admin User:**
1. Go to Firebase Console → Authentication
2. Click "Add User"
3. Enter admin email and password
4. Go to Firestore Database
5. Create document in `users` collection with:
   ```javascript
   {
     name: "Admin User",
     email: "admin@bloodconnect.com",
     role: "admin",
     emailVerified: true,
     twoFactorEnabled: false,
     phoneNumber: "",
     createdAt: serverTimestamp()
   }
   ```

### **To Test User Management:**
1. Login as admin
2. Go to Dashboard → "Manage Users"
3. Add a test user
4. Verify user appears in the list
5. Test search and filter functionality

---

## 📞 **Troubleshooting**

### **Common Issues:**
1. **Permission Denied** - Check Firestore security rules
2. **User Not Found** - Verify user exists in Authentication
3. **Data Not Saving** - Check field names and data types
4. **Search Not Working** - Ensure proper indexing

### **Debug Steps:**
1. Check browser console for errors
2. Verify Firebase configuration
3. Check Firestore security rules
4. Test with Firebase Console directly

Your BloodConnect application now has comprehensive user management capabilities! 🚀
