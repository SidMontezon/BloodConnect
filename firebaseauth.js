// Firebase compat imports
import firebase from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js";
import "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js";
import "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js";

// Firebase configuration
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
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Function to show messages to the user
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

// --- Check if the user is already logged in ---
auth.onAuthStateChanged((user) => {
  if (user) {
    // If the user is logged in, check their role and redirect accordingly
    db.collection("users").doc(user.uid).get().then(doc => {
      if (doc.exists) {
        const userData = doc.data();
        const role = userData.role;
        if (role === 'admin') {
          window.location.href = 'admin.html';
        } else if (role === 'hospital') {
          window.location.href = 'hospital.html';
        } else if (role === 'donor') {
          window.location.href = 'donor.html';
        }
      }
    });
  }
});

// --- Login Logic ---
const signInForm = document.getElementById('signInForm');
if (signInForm) {
  signInForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Simple form validation
    if (!email || !password) {
      showMessage('Please enter both email and password.', 'signInMessage');
      return;
    }

    try {
      // Sign in the user with email and password
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Fetch user role from Firestore after successful login
      const userDoc = await db.collection("users").doc(user.uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        const role = userData.role;

        // Redirect based on user role
        if (role === 'admin') {
          window.location.href = 'admin.html';
        } else if (role === 'hospital') {
          window.location.href = 'hospital.html';
        } else if (role === 'donor') {
          window.location.href = 'donor.html';
        } else {
          showMessage('User role is not defined.', 'signInMessage');
        }
      } else {
        showMessage('User data not found.', 'signInMessage');
      }
    } catch (error) {
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        showMessage('Incorrect Email or Password', 'signInMessage');
      } else {
        showMessage(error.message, 'signInMessage');
      }
    }
  });
}
