// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
    getFirestore,
    setDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// EmailJS import as module
import emailjs from "https://cdn.emailjs.com/dist/email.min.js";

// Initialize EmailJS with your public key
emailjs.init("403pGDRb-rwGc0bva"); // Your EmailJS public key here

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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Utility function to display messages
function showMessage(message, divId) {
    const el = document.getElementById(divId);
    if (!el) return;
    el.style.display = "block";
    el.innerHTML = message;
    el.style.opacity = 1;
    setTimeout(() => {
        el.style.opacity = 0;
        setTimeout(() => {
            el.style.display = "none";
        }, 1000);
    }, 5000);
}

// --- SIGN-UP ---
const signUpButton = document.getElementById('submitSignUp');
if (signUpButton) {
    signUpButton.addEventListener('click', async (event) => {
        event.preventDefault();

        const email = document.getElementById('rEmail')?.value;
        const password = document.getElementById('rPassword')?.value;
        const firstName = document.getElementById('fName')?.value;
        const lastName = document.getElementById('lName')?.value;

        if (!email || !password || !firstName || !lastName) {
            showMessage('Please fill in all fields.', 'signUpMessage');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userData = { email, firstName, lastName, role: "user" };
            await setDoc(doc(db, "users", user.uid), userData);

            showMessage('Account created successfully. You can now log in.', 'signUpMessage');
        } catch (error) {
            let msg = 'Signup failed.';
            switch (error.code) {
                case 'auth/email-already-in-use':
                    msg = 'This email is already registered.';
                    break;
                case 'auth/invalid-email':
                    msg = 'Invalid email address.';
                    break;
                case 'auth/weak-password':
                    msg = 'Password should be at least 6 characters.';
                    break;
            }
            showMessage(msg, 'signUpMessage');
        }
    });
}

// --- SIGN-IN ---
const signInButton = document.getElementById('submitSignIn');
if (signInButton) {
    signInButton.addEventListener('click', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email')?.value;
        const password = document.getElementById('password')?.value;

        if (!email || !password) {
            showMessage('Enter both email and password.', 'signInMessage');
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            // ✅ Generate and send 6-digit verification code
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            sessionStorage.setItem('tempLoginCode', code);

            const templateParams = {
                to_email: email,
                login_code: code
            };

            await emailjs.send('service_otkjg9d', 'template_mx54p5m', templateParams);

            showMessage('Verification code sent to your email.', 'signInMessage');
            const modal = new bootstrap.Modal(document.getElementById('codeModal'));
            modal.show();

        } catch (error) {
            let msg = 'Login failed.';
            if (error.code) {
                switch (error.code) {
                    case 'auth/user-not-found':
                    case 'auth/wrong-password':
                        msg = 'Incorrect email or password.';
                        break;
                    case 'auth/invalid-email':
                        msg = 'Invalid email.';
                        break;
                }
            } else if (error.text) {
                // Handle EmailJS errors here if needed
                msg = 'Failed to send code. Try again.';
            }
            console.error('Error during sign-in:', error);
            showMessage(msg, 'signInMessage');
        }
    });
}

// --- CODE VERIFICATION ---
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
            codeMessage.textContent = 'Incorrect code. Try again.';
        }
    });
}
