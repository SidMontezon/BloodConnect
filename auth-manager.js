// Unified Authentication Manager for BloodConnect
// Central auth helper used by dashboard/admin pages. Attaches window.authManager.
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAG6Drx2JJlBX1TGvLMWPHp_D2xBDTPIjI",
  authDomain: "bloodconnect-b5142.firebaseapp.com",
  databaseURL: "https://bloodconnect-b5142-default-rtdb.firebaseio.com",
  projectId: "bloodconnect-b5142",
  storageBucket: "bloodconnect-b5142.firebasestorage.app",
  messagingSenderId: "631993835929",
  appId: "1:631993835929:web:75554aca166e9058473308"
};

// initialize app only once
if (!getApps().length) {
  initializeApp(firebaseConfig);
}
const auth = getAuth();
const db = getDatabase();

async function fetchUserData(uid) {
  if (!uid) return null;
  try {
    const snap = await get(ref(db, `users/${uid}`));
    return snap.exists() ? snap.val() : null;
  } catch (e) {
    console.error('fetchUserData error', e);
    return null;
  }
}

const authManager = {
  addAuthListener: (cb) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        cb(null, null);
        return;
      }
      const userData = await fetchUserData(user.uid);
      cb(user, userData);
    });
  },

  getCurrentUserData: async () => {
    const user = auth.currentUser;
    if (!user) return null;
    return await fetchUserData(user.uid);
  },

  redirectByRole: async () => {
    const user = auth.currentUser;
    if (!user) {
      window.location.href = 'login.html';
      return;
    }
    const userData = await fetchUserData(user.uid);
    const role = (userData && userData.role) || 'donor';
    if (role === 'admin') window.location.href = 'admin.html';
    else if (role === 'hospital') window.location.href = 'hospital-dashboard.html';
    else window.location.href = 'donor-dashboard.html';
  },

  logoutAndRedirect: async () => {
    try { await signOut(auth); } catch (e) { /* noop */ }
    window.location.replace('login.html');
  }
};

window.authManager = authManager;
export default authManager;
