import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendEmailVerification, applyActionCode } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', function () {
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
  const auth = getAuth();

  function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);
    if (!messageDiv) return;
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function () {
      messageDiv.style.opacity = 0;
    }, 5000);
  }

  function show2FAForm() {
    document.getElementById('signInForm').style.display = 'none';
    document.getElementById('verificationForm').style.display = 'block';
    // If not already present, add the 2FA input and button
    if (!document.getElementById('verificationCode')) {
      document.getElementById('verificationForm').innerHTML = `
        <input type="text" id="verificationCode" class="form-control" placeholder="Enter 2FA code" required />
        <button id="submitVerification" class="btn btn-login w-100 mt-2">Verify 2FA</button>
      `;
      document.getElementById('submitVerification').addEventListener('click', submit2FA);
    }
  }

  function hide2FAForm() {
    document.getElementById('signInForm').style.display = 'block';
    document.getElementById('verificationForm').style.display = 'none';
  }

  // SignIn functionality
  const signIn = document.getElementById('submitSignIn');
  if (signIn) {
    signIn.addEventListener('click', (event) => {
      event.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          if (user.emailVerified) {
            // Request backend to send 2FA code
            fetch('http://localhost:3000/send-2fa-code', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: user.email })
            })
            .then(res => res.json())
            .then(data => {
              if (data.success) {
                showMessage('2FA code sent to your email.', 'signInMessage');
                show2FAForm();
                sessionStorage.setItem('2fa_email', user.email);
              } else {
                showMessage('Failed to send 2FA code.', 'signInMessage');
              }
            })
            .catch(() => {
              showMessage('Error sending 2FA code.', 'signInMessage');
            });
          } else {
            showMessage('Please verify your email first.', 'signInMessage');
            sendEmailVerification(user).then(() => {
              showMessage('Verification email has been sent. Please check your inbox.', 'signInMessage');
            });
          }
        })
        .catch((error) => {
          const errorCode = error.code;
          if (errorCode === 'auth/invalid-credential') {
            showMessage('Incorrect Email or Password', 'signInMessage');
          } else {
            showMessage('Account does not exist', 'signInMessage');
          }
        });
    });
  }

  // 2FA Verification handler
  function submit2FA(event) {
    event.preventDefault();
    const code = document.getElementById('verificationCode').value;
    const email = sessionStorage.getItem('2fa_email');
    if (!email) {
      showMessage('Session expired. Please login again.', 'signInMessage');
      hide2FAForm();
      return;
    }
    fetch('http://localhost:3000/verify-2fa-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        showMessage('2FA verification successful!', 'signInMessage');
        sessionStorage.removeItem('2fa_email');
        window.location.href = 'dashboard.html';
      } else {
        showMessage('Invalid 2FA code.', 'signInMessage');
      }
    })
    .catch(() => {
      showMessage('Error verifying 2FA code.', 'signInMessage');
    });
  }

  // Handling the email verification link when the user clicks on it
  const urlParams = new URLSearchParams(window.location.search);
  const oobCode = urlParams.get('oobCode');
  if (oobCode) {
    applyActionCode(auth, oobCode)
      .then(() => {
        showMessage('Your email has been successfully verified!', 'signInMessage');
        window.location.href = 'dashboard.html';
      })
      .catch((error) => {
        console.error("Error applying verification code:", error);
        showMessage('Failed to verify email. Please try again.', 'signInMessage');
      });
  }
});