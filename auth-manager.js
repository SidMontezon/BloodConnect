// Unified Authentication Manager for BloodConnect
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

// ---------------------------
// Prevent multiple Firebase apps
// ---------------------------
let app;
if (!getApps().length) {
    app = initializeApp({
        apiKey: "AIzaSyAG6Drx2JJlBX1TGvLMWPHp_D2xBDTPIjI",
        authDomain: "bloodconnect-b5142.firebaseapp.com",
        databaseURL: "https://bloodconnect-b5142-default-rtdb.firebaseio.com",
        projectId: "bloodconnect-b5142",
        storageBucket: "bloodconnect-b5142.firebasestorage.app",
        messagingSenderId: "631993835929",
        appId: "1:631993835929:web:75554aca166e9058473308"
    });
} else {
    app = getApps()[0];
}

const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);

// ---------------------------
let currentUser = null;
let currentUserData = null;
let listenerAdded = false;
let authListeners = [];
let hasRedirected = false;

// ---------------------------
class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        if (listenerAdded) return;

        listenerAdded = true;
        console.log("AuthManager initialized");

        onAuthStateChanged(auth, async (user) => {
            console.log("AuthStateChanged:", user ? user.uid : "Logged out");

            currentUser = user;
            currentUserData = null;

            if (user) {
                currentUserData = await this.loadUserData(user.uid);
            }

            // Notify listeners
            authListeners.forEach(cb => cb(currentUser, currentUserData));
        });
    }

    async loadUserData(uid) {
        try {
            const realtimeRef = ref(database, `users/${uid}`);
            const snap = await get(realtimeRef);

            if (snap.exists()) {
                return { uid, ...snap.val() };
            }

            const fsSnap = await getDoc(doc(db, "users", uid));
            if (fsSnap.exists()) {
                return { uid, ...fsSnap.data() };
            }

            return null;
        } catch (err) {
            console.error("User data load error:", err);
            return null;
        }
    }

    addAuthListener(callback) {
        authListeners.push(callback);

        // Immediately call if user already loaded
        if (currentUser !== null && currentUserData !== null) {
            callback(currentUser, currentUserData);
        }
    }

    // ---------------------
    // FIXED: NO DOUBLE REDIRECTS
    // ---------------------
    redirectByRole() {
        if (hasRedirected) return; // prevent looping
        hasRedirected = true;

        if (!currentUserData) {
            window.location.href = "login.html";
            return;
        }

        const role = currentUserData.role;
        console.log("Redirecting user role:", role);

        const routes = {
            admin: "admin.html",
            donor: "donor-dashboard.html",
            hospital: "hospital-dashboard.html",
            patient: "patient-dashboard.html"
        };

        window.location.href = routes[role] || "dashboard.html";
    }

    logout() {
        return signOut(auth);
    }
}

const authManager = new AuthManager();
window.authManager = authManager;
