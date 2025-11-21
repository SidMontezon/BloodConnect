// ================= FIREBASE INIT =================
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
  storageBucket: "bloodconnect-b5142.firebaseapp.com",
  messagingSenderId: "631993835929",
  appId: "1:631993835929:web:75554aca166e9058473308"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

<<<<<<< HEAD
// ================= UTIL =================
=======
// Message display helper
>>>>>>> 841b55b4f91e7b2a3f3cc2b65a89d18cd728eb83
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

<<<<<<< HEAD
async function logoutAndRedirect() {
  try { await signOut(auth); } catch (e) {}
  sessionStorage.clear();
  window.location.replace("login.html");
}

// ================= SIGNUP =================
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;
    const role = document.getElementById("signupRole").value; // donor / hospital / admin

    if (!email || !password) {
      showMessage("Please provide email and password.", "signupMessage");
=======
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
>>>>>>> 841b55b4f91e7b2a3f3cc2b65a89d18cd728eb83
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
<<<<<<< HEAD
      const uid = userCredential.user.uid;

      await set(ref(db, "users/" + uid), {
        email: email,
        role: role
      });

      showMessage("Account created successfully! You may login now.", "signupMessage");
      signupForm.reset();
    } catch (err) {
      console.error(err);
      showMessage("Signup failed: " + err.message, "signupMessage");
=======
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
>>>>>>> 841b55b4f91e7b2a3f3cc2b65a89d18cd728eb83
    }
  });
}

<<<<<<< HEAD
// ================= SIGN-IN =================
const signInForm = document.getElementById("signInForm");

if (signInForm) {
  signInForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
      showMessage("Provide email and password.", "signInMessage");
      return;
    }
=======
// ==================== LOGIN ====================
const signInForm = document.getElementById("signInForm");
if (signInForm) {
  signInForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
>>>>>>> 841b55b4f91e7b2a3f3cc2b65a89d18cd728eb83

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));

<<<<<<< HEAD
      // Read user role from database
      let role = "donor"; // default
      const snap = await get(ref(db, `users/${uid}`));

      if (snap.exists()) {
        const data = snap.val();
        role = data.role || "donor";
      }

      // Save session
      sessionStorage.setItem("logged_in", "true");
      sessionStorage.setItem("uid", uid);
      sessionStorage.setItem("role", role);
      sessionStorage.setItem("email", email);

      // Redirect based on role
      if (role === "admin") {
        window.location.href = "admin-dashboard.html";
      } else if (role === "hospital") {
        window.location.href = "hospital-dashboard.html";
      } else {
        window.location.href = "donor-dashboard.html";
      }

    } catch (err) {
      console.error(err);
      showMessage("Incorrect Email or Password", "signInMessage");
    }
  });
}

// ================= LOGOUT =================
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    logoutAndRedirect();
  });
}

// ================= PROTECTED PAGE HANDLING =================
(function protect() {
  const protectedPages = [
    "/admin-dashboard.html",
    "/hospital-dashboard.html",
    "/donor-dashboard.html"
  ];

  const currentPage = window.location.pathname;

  if (protectedPages.some(page => currentPage.includes(page))) {
    if (!sessionStorage.getItem("logged_in")) {
      window.location.replace("login.html");
    }
  }
})();

window.addEventListener("pageshow", (e) => {
  const protectedPages = [
    "/admin-dashboard.html",
    "/hospital-dashboard.html",
    "/donor-dashboard.html"
  ];

  const currentPage = window.location.pathname;

  if (protectedPages.some(page => currentPage.includes(page))) {
    if (!sessionStorage.getItem("logged_in")) {
      window.location.replace("login.html");
    }
  }

  if (e.persisted && sessionStorage.getItem("logged_in")) {
    logoutAndRedirect();
  }
});
=======
      if (userDoc.exists()) {
        const role = userDoc.data().role;

        // Redirect based on role
        switch (role) {
          case "admin":
            window.location.href = "admin.html";
            break;
          case "donor":
            window.location.href = "donor-dashboard.html";
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
>>>>>>> 841b55b4f91e7b2a3f3cc2b65a89d18cd728eb83
