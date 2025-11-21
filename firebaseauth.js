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
  storageBucket: "bloodconnect-b5142.firebasestorage.app",
  messagingSenderId: "631993835929",
  appId: "1:631993835929:web:75554aca166e9058473308"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase(app);

function showMessage(message, divId) {
  const el = document.getElementById(divId);
  if (!el) return;
  el.style.display = "block";
  el.textContent = message;
  el.style.opacity = 1;
  setTimeout(() => { el.style.opacity = 0; }, 4000);
}

async function logoutAndRedirect() {
  try { await signOut(auth); } catch (e) { /* ignore */ }
  sessionStorage.clear();
  // navigate to login and replace history to avoid back
  window.location.replace('login.html');
}

/* ===================== Signup ===================== */
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = (document.getElementById('signupEmail') || {}).value?.trim() || '';
    const password = (document.getElementById('signupPassword') || {}).value || '';
    const role = (document.getElementById('signupRole') || {}).value || 'donor';

    if (!email || !password) {
      showMessage('Please provide email and password.', 'signupMessage');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      await set(ref(db, `users/${uid}`), { email, role });
      showMessage('Account created. You may login now.', 'signupMessage');
      signupForm.reset();
    } catch (err) {
      console.error(err);
      showMessage('Signup failed: ' + (err.message || 'Try again'), 'signupMessage');
    }
  });
}

/* ===================== SignIn ===================== */
const signInForm = document.getElementById('signInForm');
if (signInForm) {
  signInForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = (document.getElementById('email') || {}).value?.trim() || '';
    const password = (document.getElementById('password') || {}).value || '';

    if (!email || !password) {
      showMessage('Provide email and password.', 'signInMessage');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      let role = 'donor';
      try {
        const snap = await get(ref(db, `users/${uid}/role`));
        if (snap.exists()) role = snap.val();
      } catch (dbErr) {
        console.warn('Could not read role:', dbErr);
      }

      sessionStorage.setItem('logged_in', 'true');
      sessionStorage.setItem('uid', uid);
      sessionStorage.setItem('role', role);
      sessionStorage.setItem('email', email);

      if (role === 'admin') {
        window.location.href = 'admin/dashboard.html';
      } else if (role === 'hospital') {
        window.location.href = 'hospital/dashboard.html';
      } else {
        window.location.href = 'donor/dashboard.html';
      }

      history.replaceState({}, '', window.location.href);
    } catch (err) {
      console.error(err);
      showMessage('Incorrect Email or Password', 'signInMessage');
    }
  });
}

/* ===================== Logout binding ===================== */
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    logoutAndRedirect();
  });
}

/* ===================== Back-button / bfcache handling ===================== */
/* Force logout/redirect when protected pages are revisited via back-button or page cache */
window.addEventListener('pageshow', (e) => {
  const protectedPaths = ['/admin/', '/hospital/', '/donor/', '/dashboard.html'];
  const path = window.location.pathname;
  const isProtected = protectedPaths.some(p => path.includes(p));
  if (isProtected && !sessionStorage.getItem('logged_in')) {
    window.location.replace('login.html');
    return;
  }
  if (e.persisted && sessionStorage.getItem('logged_in')) {
    logoutAndRedirect();
  }
});

window.addEventListener('popstate', () => {
  if (sessionStorage.getItem('logged_in')) {
    logoutAndRedirect();
  }
});

(function protectIfNeeded() {
  const protectedPaths = ['/admin/', '/hospital/', '/donor/', '/dashboard.html'];
  const path = window.location.pathname;
  if (protectedPaths.some(p => path.includes(p))) {
    if (!sessionStorage.getItem('logged_in')) {
      window.location.replace('login.html');
    }
  }
})();