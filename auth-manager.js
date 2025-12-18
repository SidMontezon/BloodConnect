// Realtime Database Multi-Role Auth Manager for BloodConnect
// Fully non-restrictive login system without Firebase Auth

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

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
const db = getDatabase(app);

// Global current user
let currentUser = null;

// Auth Manager Class
class AuthManager {
    constructor() {
        this.listeners = [];
    }

    // Attempt login by email/password
    async login(email, password) {
        if (!email || !password) throw new Error("Email and password are required.");

        try {
            const usersRef = ref(db, "users");
            const snapshot = await get(usersRef);

            if (!snapshot.exists()) throw new Error("No users in database.");

            const allUsers = snapshot.val();
            let foundUser = null;
            let uid = null;

            for (const [key, userData] of Object.entries(allUsers)) {
                if (userData.email === email && userData.password === password) {
                    foundUser = userData;
                    uid = key;
                    break;
                }
            }

            if (!foundUser) throw new Error("Incorrect email or password.");

            // Update last login
            await update(ref(db, `users/${uid}`), {
                lastLogin: new Date().toISOString(),
                isOnline: true
            });

            currentUser = { uid, ...foundUser };
            this.notifyListeners(currentUser);

            // Persist minimal current user to localStorage for multi-page flow (no server session)
            try {
                const minimal = {
                    uid: currentUser.uid,
                    email: currentUser.email,
                    role: currentUser.role,
                    firstName: currentUser.firstName,
                    lastName: currentUser.lastName
                };
                localStorage.setItem('bc_currentUser', JSON.stringify(minimal));
            } catch (e) {
                // ignore localStorage errors
            }

            return currentUser;
        } catch (error) {
            throw error;
        }
    }

    // Logout user
    async logout() {
        if (!currentUser) return;
        await update(ref(db, `users/${currentUser.uid}`), {
            isOnline: false,
            lastSeen: new Date().toISOString()
        });
        currentUser = null;
        this.notifyListeners(null);
        // Remove persisted state
        try { localStorage.removeItem('bc_currentUser'); } catch (e) {}
        // Do not force a navigation here; logoutAndRedirect will perform navigation when desired.
    }

    // Add auth listener
    addListener(callback) {
        if (typeof callback === "function") {
            this.listeners.push(callback);
            // Call immediately if user is already logged in
            if (currentUser) callback(currentUser, currentUser);
        }
    }

    // Backwards-compatible alias used across pages
    addAuthListener(callback) {
        return this.addListener(callback);
    }

    // Remove listener
    removeListener(callback) {
        const index = this.listeners.indexOf(callback);
        if (index !== -1) this.listeners.splice(index, 1);
    }

    // Backwards-compatible alias
    removeAuthListener(callback) {
        return this.removeListener(callback);
    }

    // Notify all listeners
    notifyListeners(user) {
        this.listeners.forEach(cb => {
            try { cb(user, user); } catch (e) { console.error("AuthManager listener error:", e); }
        });
    }

    // Get current user
    getCurrentUser() {
        return currentUser;
    }

    // Backwards-compatible name used in some pages
    getCurrentUserData() {
        return this.getCurrentUser();
    }

    // Redirect based on role
    redirectByRole() {
        // Return the recommended path for the current role instead of forcing navigation.
        if (!currentUser || !currentUser.role) return null;

        switch (currentUser.role) {
            case "admin":
                return "admin.html";
            case "donor":
                return "donor-dashboard.html";
            case "hospital":
                return "hospital-dashboard.html";
            case "patient":
                return "patient-dashboard.html";
            default:
                return "dashboard.html";
        }
    }

    // Check role without enforcing redirects; returns true/false
    hasRole(role) {
        if (!currentUser || !currentUser.role) return false;
        return currentUser.role === role;
    }

    // Protect a page by allowed roles. If user not logged in -> redirect to login.
    // If logged in but role not allowed -> redirect to user's dashboard.
    // `allowedRoles` can be a string or array of strings. If omitted, simply requires login.
    protectPage(allowedRoles) {
        const target = window.location.pathname.split('/').pop();
        const allowed = typeof allowedRoles === 'string' ? [allowedRoles] : (Array.isArray(allowedRoles) ? allowedRoles : null);

        if (!currentUser) {
            const redirectParam = target ? `?redirect=${encodeURIComponent(target)}` : '';
            window.location.href = `login.html${redirectParam}`;
            return false;
        }

        if (allowed && allowed.length > 0 && !allowed.includes(currentUser.role)) {
            // Role not allowed: send the user to their dashboard instead
            const dash = this.redirectByRole();
            if (dash) window.location.href = dash;
            return false;
        }

        return true;
    }

    // Backwards-compatible logout helper used in pages
    async logoutAndRedirect() {
        // Perform logout and then navigate to the login page for a consistent flow
        await this.logout();
        try {
            window.location.href = 'login.html';
        } catch (e) {
            // ignore if navigation not possible in current context
        }
    }
}

// Create global instance
const authManager = new AuthManager();
window.authManager = authManager;
export default authManager;

// Hydrate from localStorage if present so redirects retain user context across pages
try {
    const raw = localStorage.getItem('bc_currentUser');
    if (raw) {
        const stored = JSON.parse(raw);
        if (stored && stored.uid) {
            currentUser = stored;
            // notify any listeners that may have been added after import
            authManager.notifyListeners(currentUser);
        }
    }
} catch (e) {
    // ignore storage parse errors
}

// AUTO-PROTECT: If a page imports this module, perform a best-effort role guard
try {
    const page = (window.location && window.location.pathname) ? window.location.pathname.split('/').pop() : null;
    if (page) {
        const p = page.toLowerCase();
        if (p === 'admin.html' || p.startsWith('admin-')) {
            authManager.protectPage('admin');
        } else if (p === 'donor-dashboard.html' || p.startsWith('donor-') || p === 'donor.html') {
            authManager.protectPage('donor');
        } else if (p === 'hospital-dashboard.html' || p.startsWith('hospital-') || p === 'hospital.html') {
            authManager.protectPage('hospital');
        }
    }
} catch (e) {
    // ignore any errors during auto-protect
}
