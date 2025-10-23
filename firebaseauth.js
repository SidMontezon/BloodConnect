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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Message display helper
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
  }, 4000);
}

// ==================== SIGNUP ====================
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fName = document.getElementById("fName").value.trim();
    const lName = document.getElementById("lName").value.trim();
    const email = document.getElementById("rEmail").value.trim();
    const password = document.getElementById("rPassword").value;
    const role = document.getElementById("userRole").value;

    if (!role) {
      showMessage("Please select your role.", "signUpMessage");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        firstName: fName,
        lastName: lName,
        email: email,
        role: role,
        createdAt: new Date()
      });

      showMessage("Account created successfully! Redirecting...", "signUpMessage");
      setTimeout(() => (window.location.href = "login.html"), 1500);
    } catch (error) {
      showMessage(error.message, "signUpMessage");
    }
  });
}

// ==================== LOGIN ====================
const signInForm = document.getElementById("signInForm");
if (signInForm) {
  signInForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const role = userDoc.data().role;

        // Redirect based on role
        switch (role) {
          case "admin":
            window.location.href = "admin.html";
            break;
          case "donor":
            window.location.href = "donatordashboard.html";
            break;
          case "hospital":
            window.location.href = "hospital-dashboard.html";
            break;
          case "patient":
            window.location.href = "patient-dashboard.html";
            break;
          default:
            window.location.href = "dashboard.html";
            break;
        }
      } else {
        showMessage("User data not found. Please contact support.", "signInMessage");
      }
    } catch (error) {
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/invalid-credential"
      ) {
        showMessage("Incorrect email or password.", "signInMessage");
      } else {
        showMessage(error.message, "signInMessage");
      }
    }
  });
}
