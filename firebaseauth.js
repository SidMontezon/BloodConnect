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

// Firebase configuration (Use your actual config from the first snippet)
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
      console.log("Attempting to create user with email:", email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User created in Firebase Auth:", user.uid);

      // Store additional user info including role in Firestore
      console.log("Attempting to write user data to Firestore for UID:", user.uid);
      await setDoc(doc(db, "users", user.uid), {
        firstName: fName,
        lastName: lName,
        email: email,
        role: role,
        createdAt: new Date()
      });
      console.log("User data successfully written to Firestore for UID:", user.uid);

      // Redirect to login page after successful signup
      window.location.href = 'login.html';
    } catch (error) {
      console.error("Signup error:", error);
      showMessage(error.message, 'signUpMessage');
    }
  });
}

// --- Login Logic ---
const signInForm = document.getElementById('signInForm');
if (signInForm) {
  signInForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    // const signInMessageDiv = document.getElementById('signInMessage'); // This variable is not used, can remove.

    try {
      console.log("Attempting to sign in with email:", email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User successfully authenticated by Firebase Auth:", user.uid);
      console.log("Attempting to fetch user document from Firestore for UID:", user.uid);

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role;
        console.log("User document found in Firestore. Data:", userData);
        console.log("User role:", role);

        // Redirect based on role (example, adjust as needed)
        if (role === 'admin') {
          window.location.href = 'admin.html';
        } else if (role === 'user' || role === 'donor') {
          window.location.href = 'donatordashboard.html'; // Example for user/donor
        } else if (role === 'hospital') {
          window.location.href = 'hospitaldashboard.html'; // Example for hospital
        } else {
          window.location.href = 'index.html'; // Default redirect
        }
      } else {
        console.warn("User document NOT found in Firestore for UID:", user.uid);
        showMessage('User data not found. Please contact support.', 'signInMessage');
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        showMessage('Incorrect Email or Password', 'signInMessage');
      } else {
        showMessage(error.message, 'signInMessage');
      }
    }
  });
}