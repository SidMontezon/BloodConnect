// Unified Authentication Manager for BloodConnect
// This ensures consistent authentication across all pages

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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

// Global authentication state
let currentUser = null;
let currentUserData = null;
let authListeners = [];

// Authentication Manager Class
class AuthManager {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    async init() {
        if (this.isInitialized) return;
        
        console.log('AuthManager: Initializing...');
        
        // Set up auth state listener
        onAuthStateChanged(auth, async (user) => {
            console.log('AuthManager: Auth state changed:', user ? user.uid : 'No user');
            
            if (user) {
                currentUser = user;
                try {
                    // Get user data from Firestore
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists()) {
                        currentUserData = userDoc.data();
                        currentUserData.uid = user.uid;
                        console.log('AuthManager: User data loaded:', currentUserData);
                    } else {
                        console.log('AuthManager: User document not found');
                        currentUserData = null;
                    }
                } catch (error) {
                    console.error('AuthManager: Error loading user data:', error);
                    currentUserData = null;
                }
            } else {
                currentUser = null;
                currentUserData = null;
            }
            
            // Notify all listeners
            this.notifyListeners(user, currentUserData);
        });
        
        this.isInitialized = true;
        console.log('AuthManager: Initialized successfully');
    }

    // Add authentication listener
    addAuthListener(callback) {
        authListeners.push(callback);
        
        // If user is already authenticated, call callback immediately
        if (currentUser && currentUserData) {
            callback(currentUser, currentUserData);
        }
    }

    // Remove authentication listener
    removeAuthListener(callback) {
        const index = authListeners.indexOf(callback);
        if (index > -1) {
            authListeners.splice(index, 1);
        }
    }

    // Notify all listeners
    notifyListeners(user, userData) {
        authListeners.forEach(callback => {
            try {
                callback(user, userData);
            } catch (error) {
                console.error('AuthManager: Error in listener:', error);
            }
        });
    }

    // Get current user
    getCurrentUser() {
        return currentUser;
    }

    // Get current user data
    getCurrentUserData() {
        return currentUserData;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return currentUser !== null;
    }

    // Check if user has specific role
    hasRole(role) {
        return currentUserData && currentUserData.role === role;
    }

    // Redirect based on role
    redirectByRole() {
        if (!currentUserData) {
            console.log('AuthManager: No user data, redirecting to login');
            window.location.href = 'login.html';
            return;
        }

        const role = currentUserData.role;
        console.log('AuthManager: Redirecting based on role:', role);

        switch (role) {
            case 'admin':
                window.location.href = 'admin.html';
                break;
            case 'donor':
                window.location.href = 'donor-dashboard.html';
                break;
            case 'hospital':
                window.location.href = 'hospital-dashboard.html';
                break;
            case 'patient':
                window.location.href = 'patient-dashboard.html';
                break;
            default:
                window.location.href = 'dashboard.html';
                break;
        }
    }

    // Sign out
    async signOut() {
        try {
            await signOut(auth);
            console.log('AuthManager: User signed out');
        } catch (error) {
            console.error('AuthManager: Error signing out:', error);
        }
    }

    // Wait for authentication to be ready
    async waitForAuth() {
        return new Promise((resolve) => {
            if (this.isInitialized && currentUser !== undefined) {
                resolve({ user: currentUser, userData: currentUserData });
            } else {
                const listener = (user, userData) => {
                    this.removeAuthListener(listener);
                    resolve({ user, userData });
                };
                this.addAuthListener(listener);
            }
        });
    }
}

// Create global instance
const authManager = new AuthManager();

// Export for use in other files
window.AuthManager = AuthManager;
window.authManager = authManager;

// Utility functions
window.authUtils = {
    // Check authentication and redirect if needed
    requireAuth: (redirectUrl = 'login.html') => {
        return new Promise((resolve, reject) => {
            authManager.addAuthListener((user, userData) => {
                if (user && userData) {
                    resolve({ user, userData });
                } else {
                    console.log('AuthUtils: User not authenticated, redirecting to:', redirectUrl);
                    window.location.href = redirectUrl;
                    reject(new Error('User not authenticated'));
                }
            });
        });
    },

    // Get user role
    getUserRole: () => {
        return authManager.getCurrentUserData()?.role;
    },

    // Check if user has specific role
    requireRole: (requiredRole) => {
        return new Promise((resolve, reject) => {
            authManager.addAuthListener((user, userData) => {
                if (user && userData && userData.role === requiredRole) {
                    resolve({ user, userData });
                } else {
                    console.log(`AuthUtils: User does not have required role: ${requiredRole}`);
                    window.location.href = 'login.html';
                    reject(new Error(`User does not have required role: ${requiredRole}`));
                }
            });
        });
    }
};

console.log('AuthManager: Loaded successfully');
