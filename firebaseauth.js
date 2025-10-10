import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Firebase configuration - Using the correct project where user accounts exist
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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Show message function
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

// --- Signup Logic ---
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
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store additional user info including role in Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName: fName,
        lastName: lName,
        email: email,
        role: role,
        createdAt: new Date()
      });

      // Redirect to login page after successful signup
      window.location.href = 'login.html';
    } catch (error) {
      showMessage(error.message, 'signUpMessage');
    }
  });
}

// --- Login Logic with proper error handling ---
const signInForm = document.getElementById('signInForm');
if (signInForm) {
  signInForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errorMessageElement = document.getElementById('signInMessage');

    // Clear previous error messages
    if (errorMessageElement) {
      errorMessageElement.textContent = '';
      errorMessageElement.style.color = 'red';
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Authenticated user:", user);

      // Check if email is verified
      if (!user.emailVerified) {
        if (errorMessageElement) {
          errorMessageElement.textContent = "Please verify your email before logging in. Check your inbox for a verification email.";
          errorMessageElement.style.color = "orange";
        }
        return;
      }

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role || 'user';
        
        console.log("User role:", role);
        
        // Redirect based on role
        redirectUser(role);
      } else {
        console.error("No user document found in Firestore.");
        if (errorMessageElement) {
          errorMessageElement.textContent = "User data not found. Please contact support.";
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      
      if (errorMessageElement) {
        if (error.code === 'auth/user-not-found') {
          errorMessageElement.textContent = "No account found with this email address.";
        } else if (error.code === 'auth/wrong-password') {
          errorMessageElement.textContent = "Incorrect password. Please try again.";
        } else if (error.code === 'auth/invalid-email') {
          errorMessageElement.textContent = "Invalid email address format.";
        } else if (error.code === 'auth/too-many-requests') {
          errorMessageElement.textContent = "Too many failed attempts. Please try again later.";
        } else if (error.code === 'auth/network-request-failed') {
          errorMessageElement.textContent = "Network error. Please check your internet connection.";
        } else {
          errorMessageElement.textContent = "Login failed: " + error.message;
        }
      }
    }
  });
}

// Function to redirect user based on role
function redirectUser(role) {
  if (role === "admin") {
    window.location.href = "admin.html";
  } else if (role === "donor" || role === "user") {
    window.location.href = "donatordashboard.html";
  } else if (role === "hospital") {
    window.location.href = "dashboard.html"; // Assuming hospital dashboard
  } else {
    window.location.href = "index.html";
  }
}
