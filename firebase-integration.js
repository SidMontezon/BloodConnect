// Firebase Integration Script - Non-Restrictive Multi-Role Login
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getDatabase, ref, get, update, set } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
import authManager from './auth-manager.js';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAG6Drx2JJlBX1TGvLMWPHp_D2xBDTPIjI",
  authDomain: "bloodconnect-b5142.firebaseapp.com",
  databaseURL: "https://bloodconnect-b5142-default-rtdb.firebaseio.com",
  projectId: "bloodconnect-b5142",
  storageBucket: "bloodconnect-b5142.firebasestorage.app",
  messagingSenderId: "631993835929",
  appId: "1:631993835929:web:75554aca166e9058473308"
};

// Initialize Firebase
let app;
if (getApps().length) {
  app = getApp();
} else {
  app = initializeApp(firebaseConfig);
}
const db = getDatabase(app);

// Utility: show messages
function showMessage(message, divId) {
  const messageDiv = document.getElementById(divId);
  if (!messageDiv) return;
  messageDiv.style.display = "block";
  messageDiv.textContent = message;
  messageDiv.style.opacity = 1;
  setTimeout(() => {
    messageDiv.style.opacity = 0;
    setTimeout(() => {
      messageDiv.style.display = "none";
    }, 500);
  }, 5000);
}

// ========================= LOGIN =========================
const signInForm = document.getElementById('signInForm');
if (signInForm) {
  signInForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    try {
      // Use centralized auth manager to perform login and set current user
      try {
        const user = await authManager.login(email, password);
        showMessage('Login successful!', 'signInMessage');

        // Redirect to recommended dashboard for better flow (no server session used)
        const role = user.role || 'donor';
        const recommended = role === 'admin' ? 'admin.html' : (role === 'hospital' ? 'hospital-dashboard.html' : 'donor-dashboard.html');
        // Small delay so user sees message then navigates
        setTimeout(() => { window.location.href = recommended; }, 700);
      } catch (err) {
        showMessage(err.message || 'Incorrect Email or Password', 'signInMessage');
      }

    } catch (error) {
      console.error('Login error:', error);
      showMessage('Login error: ' + error.message, 'signInMessage');
    }
  });
}

// ========================= SIGNUP =========================
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const fName = document.getElementById('fName').value.trim();
    const lName = document.getElementById('lName').value.trim();
    const email = document.getElementById('rEmail').value.trim();
    const password = document.getElementById('rPassword').value;
    const role = document.getElementById('userRole').value;

    if (!role) {
      showMessage('Please select a role.', 'signUpMessage');
      return;
    }

      try {
      const usersRef = ref(db, 'users');
      const snapshot = await get(usersRef);
      const allUsers = snapshot.exists() ? snapshot.val() : {};

      // Check for duplicate email
      for (const uid in allUsers) {
        if (allUsers[uid].email === email) {
          showMessage('Email already registered.', 'signUpMessage');
          return;
        }
      }

      const uid = `uid_${Date.now()}`;
      const userData = {
        uid,
        firstName: fName,
        lastName: lName,
        email,
        password,
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await set(ref(db, `users/${uid}`), userData);

      // Optional: create welcome notification
      await set(ref(db, `notifications/${uid}_welcome`), {
        userId: uid,
        type: "system",
        title: "Welcome to BloodConnect!",
        message: `Your ${role} account has been created successfully.`,
        isRead: false,
        createdAt: new Date().toISOString()
      });

      showMessage('Account created successfully!', 'signUpMessage');

      // Auto-login the user using authManager for a smooth flow, then redirect
      try {
        const user = await authManager.login(email, password);
        const recommended = user.role === 'admin' ? 'admin.html' : (user.role === 'hospital' ? 'hospital-dashboard.html' : 'donor-dashboard.html');
        setTimeout(() => { window.location.href = recommended; }, 700);
      } catch (err) {
        // If auto-login fails, instruct user to sign in manually
        showMessage('Account created. Please sign in to continue.', 'signUpMessage');
      }

    } catch (error) {
      console.error(error);
      showMessage(error.message, 'signUpMessage');
    }
  });
}
