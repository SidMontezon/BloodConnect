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

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyAG6Drx2JJlBX1TGvLMWPHp_D2xBDTPIjI",
    authDomain: "bloodconnect-b5142.firebaseapp.com",
    databaseURL: "https://bloodconnect-b5142-default-rtdb.firebaseio.com",
    projectId: "bloodconnect-b5142",
    storageBucket: "bloodconnect-b5142.appspot.com",
    messagingSenderId: "631993835929",
    appId: "1:631993835929:web:75554aca166e9058473308"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Utility function to display messages
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
        console.warn(`Message div with ID '${divId}' not found.`);
    }
}

// --- Sign-Up Handler ---
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

            await sendEmailVerification(user);

            const userData = {
                email,
                firstName,
                lastName,
                role: "user"
            };

            await setDoc(doc(db, "users", user.uid), userData);

            showMessage('Account created! Please verify your email before logging in.', 'signUpMessage');
        } catch (error) {
            console.error("Sign-up error:", error);
            let errorMessage = 'Unable to create account. Please try again.';
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'This email is already registered.';
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
}

// --- Sign-In Handler ---
const signInButton = document.getElementById('submitSignIn');
if (signInButton) {
    signInButton.addEventListener('click', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email')?.value;
        const password = document.getElementById('password')?.value;

        if (!email || !password) {
            showMessage('Please enter both email and password.', 'signInMessage');
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (!user.emailVerified) {
                showMessage('Please verify your email before continuing.', 'signInMessage');
                return;
            }

            // ✅ Step 1: Generate and send 6-digit code
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            sessionStorage.setItem('tempLoginCode', code);

            // --- SIMULATE SENDING EMAIL ---
            console.log(`🚨 Simulated: Code ${code} sent to ${email}`);
            showMessage('A verification code has been sent to your email (simulated).', 'signInMessage');

            // ✅ Step 2: Show modal
            const codeModal = new bootstrap.Modal(document.getElementById('codeModal'));
            codeModal.show();

        } catch (error) {
            console.error("Sign-in error:", error);
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
                    errorMessage = 'This account is disabled.';
                    break;
                default:
                    errorMessage = `Unexpected error: ${error.message}`;
                    break;
            }
            showMessage(errorMessage, 'signInMessage');
        }
    });
}

// --- Resend Verification Email ---
const resendVerificationBtn = document.getElementById('resendVerificationBtn');
if (resendVerificationBtn) {
    resendVerificationBtn.addEventListener('click', async () => {
        const email = document.getElementById('email')?.value;
        const password = document.getElementById('password')?.value;

        if (!email || !password) {
            showMessage('Please enter your email and password first.', 'signInMessage');
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (user.emailVerified) {
                showMessage('Your email is already verified.', 'signInMessage');
                return;
            }

            await sendEmailVerification(user);
            showMessage('Verification email resent. Check your inbox or spam.', 'signInMessage');
        } catch (error) {
            console.error('Resend verification error:', error);
            let errorMessage = 'Could not resend verification email.';
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'No account found with this email.';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Incorrect password.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email format.';
                    break;
            }
            showMessage(errorMessage, 'signInMessage');
        }
    });
}

// --- Code Verification Modal Logic ---
const verifyCodeBtn = document.getElementById('verifyCodeBtn');
if (verifyCodeBtn) {
    verifyCodeBtn.addEventListener('click', () => {
        const inputCode = document.getElementById('emailCodeInput')?.value;
        const expectedCode = sessionStorage.getItem('tempLoginCode');
        const codeMessage = document.getElementById('codeMessage');

        if (inputCode === expectedCode) {
            codeMessage.textContent = '';
            localStorage.setItem('loggedInUserId', auth.currentUser.uid);
            window.location.href = 'dashboardx.html';
        } else {
            codeMessage.textContent = 'Incorrect code. Please try again.';
        }
    });
}
