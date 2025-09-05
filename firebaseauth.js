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

  // Function to display messages
  function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function () {
      messageDiv.style.opacity = 0;
    }, 5000);
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

          // Check if the user's email is verified
          if (user.emailVerified) {
            showMessage('Login Successful!', 'signInMessage');
            window.location.href = 'dashboard.html'; // Redirect to the dashboard
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

  // Handling the email verification link when the user clicks on it
  const urlParams = new URLSearchParams(window.location.search);
  const oobCode = urlParams.get('oobCode'); // Get the verification code from the URL

  if (oobCode) {
    applyActionCode(auth, oobCode)  // Apply the code to verify the user's email
      .then(() => {
        showMessage('Your email has been successfully verified!', 'signInMessage');
        // Redirect after successful verification
        window.location.href = 'dashboard.html';
      })
      .catch((error) => {
        console.error("Error applying verification code:", error);
        showMessage('Failed to verify email. Please try again.', 'signInMessage');
      });
  }
});
