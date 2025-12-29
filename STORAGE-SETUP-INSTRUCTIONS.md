# Firebase Storage Setup Instructions

## Why Uploads Are Failing

The upload issue is **definitely related to Firebase Storage security rules**. If Storage rules are not configured or are too restrictive, uploads will fail silently or get stuck.

## Quick Fix Steps

### 1. Configure Firebase Storage Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `bloodconnect-b5142`
3. Navigate to **Storage** in the left sidebar
4. Click on the **Rules** tab
5. Copy and paste the rules from `firebase-storage-rules.txt`
6. Click **Publish**

### 2. Update Realtime Database Rules

1. In Firebase Console, go to **Realtime Database**
2. Click on the **Rules** tab
3. Copy and paste the updated rules from `realtime-database-rules.txt`
4. Click **Publish**

## What the Rules Do

### Storage Rules
- Allows users to upload verification documents to their own folder (`verifications/{userId}/`)
- Enforces 5MB file size limit
- Only allows images (JPG, PNG) and PDF files
- Allows users to read their own documents
- Admins can read all verification documents

### Database Rules
- Adds `verifications` path so verification metadata can be saved
- Adds `donationSchedules` path for donation scheduling
- Adds `hospitalEvents` path for event management

## Testing the Fix

After updating the rules:

1. Clear your browser cache
2. Try uploading a verification document again
3. Check the browser console (F12) for any errors
4. The upload should now work properly!

## Common Issues

### Issue: "Permission denied" error
**Solution:** Make sure you've updated both Storage and Database rules and published them.

### Issue: Upload still hangs
**Solution:** 
- Check your internet connection
- Try uploading a smaller file (under 2MB)
- Check browser console for specific error messages

### Issue: "File too large" error
**Solution:** Storage rules enforce a 5MB limit. Compress your images or use PDF instead.

## Need Help?

If uploads still fail after updating rules:
1. Check the browser console (F12 → Console tab)
2. Look for error messages starting with "storage/" or "database/"
3. Share the error message for further assistance

