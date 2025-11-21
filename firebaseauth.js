// ================= FIREBASE INIT =================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  get
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAG6Drx2JJlBX1TGvLMWPHp_D2xBDTPIjI",
  authDomain: "bloodconnect-b5142.firebaseapp.com",
  databaseURL: "https://bloodconnect-b5142-default-rtdb.firebaseio.com",
  projectId: "bloodconnect-b5142",
  storageBucket: "bloodconnect-b5142.firebaseapp.com",
  messagingSenderId: "631993835929",
  appId: "1:631993835929:web:75554aca166e9058473308"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase(app);

// ================= UTIL =================
function showMessage(message, divId) {
  const el = document.getElementById(divId);
  if (!el) return;
  el.style.display = "block";
  el.textContent = message;
  el.style.opacity = 1;
  setTimeout(() => { el.style.opacity = 0; }, 4000);
}

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
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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
    }
  });
}

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

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

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
