# Firebase Troubleshooting Guide for BloodConnect

## 🚨 **Common Firebase Errors & Solutions**

### **1. "Too Many Requests" Error**

#### **Error Message:**
```
Firebase: We have blocked all requests from this device due to unusual activity. Try again later. (auth/too-many-requests)
```

#### **Causes:**
- Too many authentication attempts in a short time
- Multiple failed login attempts
- Rapid email verification requests
- Testing with multiple accounts

#### **Solutions:**

##### **Immediate Fix:**
1. **Wait 1-2 hours** - Firebase automatically lifts the block
2. **Clear browser data:**
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   ```
3. **Try different network:**
   - Switch to mobile hotspot
   - Use different WiFi
   - Try incognito/private mode

##### **Prevention:**
- Implement rate limiting (provided in `rate-limiter.js`)
- Add delays between requests
- Use proper error handling

---

### **2. "Network Request Failed" Error**

#### **Error Message:**
```
Firebase: A network error (such as timeout, interrupted connection or unreachable host) has occurred. (auth/network-request-failed)
```

#### **Solutions:**
1. **Check internet connection**
2. **Try different network**
3. **Clear browser cache**
4. **Disable VPN/proxy**
5. **Check Firebase status:** [Firebase Status Page](https://status.firebase.google.com/)

---

### **3. "Invalid Email" Error**

#### **Error Message:**
```
Firebase: The email address is badly formatted. (auth/invalid-email)
```

#### **Solutions:**
1. **Validate email format:**
   ```javascript
   function isValidEmail(email) {
       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       return emailRegex.test(email);
   }
   ```
2. **Check for typos**
3. **Ensure proper email format**

---

### **4. "User Not Found" Error**

#### **Error Message:**
```
Firebase: There is no user record corresponding to this identifier. (auth/user-not-found)
```

#### **Solutions:**
1. **Check if user exists in Firebase Console**
2. **Verify email spelling**
3. **Check if user was deleted**
4. **Create user if needed**

---

### **5. "Wrong Password" Error**

#### **Error Message:**
```
Firebase: The password is invalid or the user does not have a password. (auth/wrong-password)
```

#### **Solutions:**
1. **Reset password in Firebase Console**
2. **Use "Forgot Password" feature**
3. **Check password complexity requirements**

---

## 🔧 **Code Improvements**

### **Enhanced Error Handling:**

```javascript
// Better error handling for authentication
function handleAuthError(error) {
    switch(error.code) {
        case 'auth/too-many-requests':
            return 'Too many requests. Please wait 1-2 hours before trying again.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your internet connection.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/user-not-found':
            return 'No account found with this email address.';
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.';
        case 'auth/email-already-in-use':
            return 'An account with this email already exists.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters.';
        default:
            return 'An error occurred: ' + error.message;
    }
}
```

### **Rate Limiting Implementation:**

```javascript
// Add to your HTML files
<script src="rate-limiter.js"></script>

// Use in your authentication code
const authWrapper = new FirebaseAuthWrapper(auth);

// Instead of: auth.signInWithEmailAndPassword(email, password)
// Use: authWrapper.signInWithEmailAndPassword(email, password)
```

---

## 🛠️ **Firebase Console Management**

### **Check Authentication Status:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `bloodconnect2-d094a`
3. Go to **Authentication** → **Users**
4. Check if users exist and are enabled

### **Reset User Passwords:**
1. In Firebase Console → Authentication → Users
2. Find the user
3. Click the three dots → **Reset Password**
4. User will receive password reset email

### **Enable/Disable Users:**
1. In Firebase Console → Authentication → Users
2. Find the user
3. Toggle **Disabled** status

### **Check Firestore Data:**
1. Go to **Firestore Database** → **Data**
2. Check `users` collection
3. Verify user documents exist

---

## 🔍 **Debugging Steps**

### **1. Check Browser Console:**
```javascript
// Open browser console (F12)
// Look for error messages
console.log('Firebase Auth State:', auth.currentUser);
```

### **2. Test Firebase Connection:**
```javascript
// Test if Firebase is working
firebase.auth().onAuthStateChanged((user) => {
    console.log('Auth State Changed:', user);
});
```

### **3. Verify Configuration:**
```javascript
// Check if Firebase config is correct
console.log('Firebase Config:', firebaseConfig);
```

### **4. Test Network Connectivity:**
```javascript
// Test if you can reach Firebase
fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + firebaseConfig.apiKey, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@test.com', password: 'test123' })
}).then(response => console.log('Network test:', response.status));
```

---

## 📱 **Testing Strategies**

### **1. Use Test Accounts:**
- Create dedicated test accounts
- Don't use real user accounts for testing
- Use different email providers for testing

### **2. Implement Delays:**
```javascript
// Add delays between requests
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Use in your code
await delay(1000); // Wait 1 second
```

### **3. Monitor Request Frequency:**
```javascript
// Track request frequency
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000; // 2 seconds

function canMakeRequest() {
    const now = Date.now();
    if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
        return false;
    }
    lastRequestTime = now;
    return true;
}
```

---

## 🚀 **Prevention Best Practices**

### **1. Implement Proper Error Handling:**
- Always catch and handle errors
- Provide user-friendly error messages
- Log errors for debugging

### **2. Add Rate Limiting:**
- Limit requests per user
- Implement exponential backoff
- Use the provided `rate-limiter.js`

### **3. Validate Input:**
- Check email format
- Validate password strength
- Sanitize user input

### **4. Monitor Usage:**
- Track authentication attempts
- Monitor error rates
- Set up alerts for unusual activity

---

## 📞 **Getting Help**

### **Firebase Support:**
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)
- [Firebase Status](https://status.firebase.google.com/)

### **Common Solutions:**
1. **Clear browser data**
2. **Try different network**
3. **Wait for rate limit to reset**
4. **Check Firebase Console**
5. **Verify configuration**

### **Emergency Workarounds:**
1. **Use Firebase Console** to manage users directly
2. **Create users manually** in Firebase Console
3. **Reset passwords** through Firebase Console
4. **Disable/enable users** as needed

---

## ✅ **Quick Fix Checklist**

When you encounter errors:

- [ ] Clear browser data (localStorage, sessionStorage)
- [ ] Try different network/device
- [ ] Wait 1-2 hours for rate limits
- [ ] Check Firebase Console for user status
- [ ] Verify Firebase configuration
- [ ] Check internet connection
- [ ] Try incognito/private mode
- [ ] Check Firebase status page
- [ ] Review error logs in console
- [ ] Test with different email accounts

Your BloodConnect application should now handle Firebase errors much more gracefully! 🚀

