// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Your web app's Firebase configuration
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
const auth = getAuth(app); // Get the authentication instance
const db = getFirestore(app); // Get the Firestore instance

/**
 * Displays a temporary message to the user.
 * The message will fade out and then be hidden.
 * @param {string} message - The message to display.
 * @param {string} divId - The ID of the div element where the message will be displayed.
 */
function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);
    if (messageDiv) {
        messageDiv.style.display = "block"; // Ensure the div is visible
        messageDiv.innerHTML = message;
        messageDiv.style.opacity = 1; // Set full opacity

        // Fade out after 5 seconds
        setTimeout(() => {
            messageDiv.style.opacity = 0;
            // Hide the div completely after the fade-out transition (e.g., 1 second for transition)
            setTimeout(() => {
                messageDiv.style.display = "none";
            }, 1000); 
        }, 5000); // Message visible for 5 seconds
    } else {
        console.warn(`Message div with ID '${divId}' not found. Cannot display message: "${message}"`);
    }
}

// --- Sign Up Logic ---
const signUpButton = document.getElementById('submitSignUp');
if (signUpButton) {
    signUpButton.addEventListener('click', async (event) => {
        event.preventDefault(); // Prevent default form submission

        // Get input values, using optional chaining for robustness
        const email = document.getElementById('rEmail')?.value;
        const password = document.getElementById('rPassword')?.value;
        const firstName = document.getElementById('fName')?.value;
        const lastName = document.getElementById('lName')?.value;

        // Basic client-side input validation
        if (!email || !password || !firstName || !lastName) {
            showMessage('Please fill in all registration fields.', 'signUpMessage');
            return; // Stop execution if validation fails
        }

        try {
            // 1. Create user with email and password in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("User registered successfully:", user.uid);

            // 2. Store additional user data (firstName, lastName, email, role) in Firestore
            const userData = {
                email: email,
                firstName: firstName,
                lastName: lastName,
                role: "user" // Assign a default role for new registrations
            };
            const userDocRef = doc(db, "users", user.uid); // Reference to the user's document in 'users' collection
            await setDoc(userDocRef, userData); // Set the document data

            showMessage('Account Created Successfully!', 'signUpMessage');
            // Redirect to a relevant page after successful registration
            window.location.href = 'index.html'; 

        } catch (error) {
            console.error("Error during sign-up:", error);
            const errorCode = error.code;
            let errorMessage = 'Unable to create account. Please try again.'; // Default error message

            // Provide specific user-friendly messages based on Firebase error codes
            switch (errorCode) {
                case 'auth/email-already-in-use':
                    errorMessage = 'This email address is already registered. Please use a different email or sign in.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'The email address provided is not valid.';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Password should be at least 6 characters long.';
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = 'Email/password accounts are not enabled. Please contact support.';
                    break;
                default:
                    errorMessage = `An unexpected error occurred: ${error.message}`;
                    break;
            }
            showMessage(errorMessage, 'signUpMessage');
        }
    });
} else {
    console.warn("Sign up button with ID 'submitSignUp' not found. Sign-up functionality may not be active.");
}

// --- Sign In Logic ---
const signInButton = document.getElementById('submitSignIn');
if (signInButton) {
    signInButton.addEventListener('click', async (event) => {
        event.preventDefault(); // Prevent default form submission

        // Get input values, using optional chaining for robustness
        const email = document.getElementById('email')?.value;
        const password = document.getElementById('password')?.value;

        // Basic client-side input validation
        if (!email || !password) {
            showMessage('Please enter both your email and password.', 'signInMessage');
            return; // Stop execution if validation fails
        }

        try {
            // 1. Sign in user with email and password
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("User signed in successfully:", user.uid);

            // Store user ID in local storage (useful for maintaining session or fetching user-specific data)
            localStorage.setItem('loggedInUserId', user.uid);

            showMessage('Login successful!', 'signInMessage');
            // Redirect to a specific page after successful login.
            // In a more advanced setup, you would fetch the user's role from Firestore here
            // and redirect to a role-specific dashboard (e.g., admin, user, hospital).
            window.location.href = 'dashboard.html'; 

        } catch (error) {
            console.error("Error during sign-in:", error);
            const errorCode = error.code;
            let errorMessage = 'Login failed. Please check your credentials.'; // Default error message

            // Provide specific user-friendly messages based on Firebase error codes
            switch (errorCode) {
                case 'auth/invalid-credential': // Firebase v9+ often uses this for both invalid email and wrong password
                case 'auth/wrong-password': // Older error code, good to include for compatibility
                case 'auth/user-not-found': // Older error code, good to include for compatibility
                    errorMessage = 'Incorrect email or password. Please try again.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'The email address provided is not valid.';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'Your account has been disabled. Please contact support.';
                    break;
                default:
                    errorMessage = `An unexpected error occurred: ${error.message}`;
                    break;
            }
            showMessage(errorMessage, 'signInMessage');
        }
    });
} else {
    console.warn("Sign in button with ID 'submitSignIn' not found. Sign-in functionality may not be active.");
}
