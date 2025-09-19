# Firebase 2FA Setup Guide for BloodConnect

## Prerequisites
1. Firebase project already created
2. Firebase Authentication enabled
3. Firestore database configured

## Required Firebase Configuration

### 1. Enable Phone Authentication
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable "Phone" provider
3. Add your domain to authorized domains if testing locally

### 2. Enable Email Authentication
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable "Email/Password" provider
3. Configure email templates if needed

### 3. Firestore Security Rules
Add these rules to your Firestore security rules:

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
  }
}
```

### 4. Firebase Configuration
Your current Firebase config is already set up correctly:
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyBElBKqa9ThPR1TbEXlCu-wGdi0vE943O4",
    authDomain: "bloodconnect2-d094a.firebaseapp.com",
    projectId: "bloodconnect2-d094a",
    storageBucket: "bloodconnect2-d094a.firebasestorage.app",
    messagingSenderId: "124251937624",
    appId: "1:124251937624:web:a69830e6bd3ab62e66a32d"
};
```

## User Data Structure

The following fields are now stored in Firestore for each user:

```javascript
{
  role: "donor" | "hospital" | "admin",
  email: "user@example.com",
  name: "User Name",
  emailVerified: true | false,
  twoFactorEnabled: true | false,
  phoneNumber: "+639123456789" | "",
  createdAt: timestamp
}
```

## Features Implemented

### 1. Email Verification
- Required during signup
- Users must verify email before logging in
- Automatic email verification checking

### 2. Two-Factor Authentication (2FA)
- SMS-based 2FA using Firebase Phone Auth
- Email-based 2FA using custom verification codes
- Users can choose their preferred method
- 2FA can be enabled/disabled from settings page

### 3. Security Features
- Email verification required for all accounts
- Optional 2FA for enhanced security
- Phone number verification for SMS 2FA
- Secure session management

## File Structure

```
BloodConnect/
├── login.html              # Updated with 2FA support
├── Signup.html             # Updated with email verification
├── verify-email.html       # Email verification page
├── verify-2fa.html         # 2FA verification page
├── 2fa-settings.html       # 2FA management page
└── firebase-setup-guide.md # This guide
```

## Testing the Implementation

### 1. Test Email Verification
1. Sign up with a new account
2. Check email for verification link
3. Click verification link or use verify-email.html
4. Try logging in

### 2. Test 2FA Setup
1. Login to an account
2. Go to 2fa-settings.html
3. Add phone number
4. Enable 2FA
5. Logout and login again
6. Complete 2FA verification

### 3. Test SMS 2FA
1. Enable 2FA with phone number
2. Login and select SMS verification
3. Enter phone number
4. Enter received SMS code

### 4. Test Email 2FA
1. Enable 2FA
2. Login and select email verification
3. Check email for verification code
4. Enter code on verification page

## Security Considerations

1. **Phone Number Validation**: Only Philippine numbers (+63) are supported
2. **Code Expiration**: Email verification codes expire after 10 minutes
3. **Rate Limiting**: Firebase handles SMS rate limiting
4. **Session Management**: User sessions are properly managed
5. **Data Validation**: All inputs are validated before processing

## Troubleshooting

### Common Issues:

1. **SMS not received**: Check phone number format and Firebase Phone Auth setup
2. **Email not received**: Check spam folder and email provider settings
3. **Verification codes not working**: Check code expiration and format
4. **Firebase errors**: Check console for detailed error messages

### Debug Steps:

1. Check browser console for JavaScript errors
2. Verify Firebase configuration
3. Check Firestore security rules
4. Test with different email providers
5. Verify phone number format

## Next Steps

1. Test all functionality thoroughly
2. Customize email templates in Firebase Console
3. Add more security features if needed
4. Consider adding backup codes for 2FA
5. Implement account recovery options

## Support

For issues with this implementation:
1. Check Firebase Console for authentication logs
2. Review browser console for JavaScript errors
3. Verify all Firebase services are properly configured
4. Test with different browsers and devices
