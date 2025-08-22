// Import Firebase core & services
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
    getFirestore,
    setDoc,
    doc
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

// Utility: Show messages on the screen
function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);
    if (messageDiv) {
        messageDiv.style.display = "block";
        messageDiv.innerHTML = message;
        messageDiv.style.opacity = 1;

        setTimeout(() => {
            messageDiv.style.opacity = 0;
            setTimeout(() => {
                messageDiv.style.display = "none";
            }, 1000);
        }, 5000);
    } else {
        console.warn(`Message div with ID '${divId}' not found. Cannot display message: "${message}"`);
    }
}

// --- Sign Up with Email Verification ---
const signUpButton = document.getElementById('submitSignUp');
if (signUpButton) {
    signUpButton.addEventListener('click', async (event) => {
        event.preventDefault();

        const email = document.getElementById('rEmail')?.value;
        const password = document.getElementById('rPassword')?.value;
        const firstName = document.getElementById('fName')?.value;
        const lastName = document.getElementById('lName')?.value;

        if (!email || !password || !firstName || !lastName) {
            showMessage('Please fill in all registration fields.', 'signUpMessage');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await sendEmailVerification(user); // Send verification email

            const userData = {
                email,
                firstName,
                lastName,
                role: "user"
            };

            await setDoc(doc(db, "users", user.uid), userData);

            showMessage('Account created! Please verify your email before logging in.', 'signUpMessage');
            // No redirect here to ensure they verify first

        } catch (error) {
            console.error("Error during sign-up:", error);
            let errorMessage = 'Unable to create account. Please try again.';
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'This email address is already registered.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email format.';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Password must be at least 6 characters.';
                    break;
            }
            showMessage(errorMessage, 'signUpMessage');
        }
    });
} else {
    console.warn("Sign-up button with ID 'submitSignUp' not found.");
}

// --- Sign In with Email Verification Check ---
const signInButton = document.getElementById('submitSignIn');
if (signInButton) {
    signInButton.addEventListener('click', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email')?.value;
        const password = document.getElementById('password')?.value;

        if (!email || !password) {
            showMessage('Please enter both your email and password.', 'signInMessage');
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (!user.emailVerified) {
                showMessage('Please verify your email before continuing.', 'signInMessage');
                return;
            }

            localStorage.setItem('loggedInUserId', user.uid);
            showMessage('Login successful!', 'signInMessage');
            window.location.href = 'dashboardx.html';

        } catch (error) {
            console.error("Error during sign-in:", error);
            let errorMessage = 'Login failed. Please check your credentials.';
            switch (error.code) {
                case 'auth/invalid-credential':
                case 'auth/wrong-password':
                case 'auth/user-not-found':
                    errorMessage = 'Incorrect email or password.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email format.';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'Your account has been disabled.';
                    break;
                default:
                    errorMessage = `Unexpected error: ${error.message}`;
                    break;
            }
            showMessage(errorMessage, 'signInMessage');
        }
    });
} else {
    console.warn("Sign-in button with ID 'submitSignIn' not found.");
}
