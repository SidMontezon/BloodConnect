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

  // Flag to prevent multiple verification requests in a short time
  let canSendVerification = true;

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
          showMessage('Sign-in Successful! A verification code has been sent to your email.', 'signInMessage');

          // Check if we can send the verification email
          if (canSendVerification) {
            canSendVerification = false; // Disable sending more verification emails

            sendEmailVerification(user)
              .then(() => {
                // After sending email verification, show the verification form
                document.getElementById('signInForm').style.display = 'none'; // Hide login form
                document.getElementById('verificationForm').style.display = 'block'; // Show verification form

                // Re-enable sending verification after 1 minute (60 seconds)
                setTimeout(() => {
                  canSendVerification = true; // Allow sending verification again after delay
                }, 60000); // 60 seconds delay
              })
              .catch((error) => {
                console.error("Error sending email verification:", error);
                showMessage('Failed to send verification email. Please try again later.', 'signInMessage');
              });
          } else {
            showMessage('Please wait before requesting another verification email.', 'signInMessage');
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

  // Verification functionality
  const submitVerification = document.getElementById('submitVerification');
  if (submitVerification) {
    submitVerification.addEventListener('click', (event) => {
      event.preventDefault();
      const verificationCode = document.getElementById('verificationCode').value;

      // Simulate checking the verification code
      // In a real-world scenario, you'd check the actual code sent by Firebase
      if (verificationCode === '123456') { // Replace with real validation logic
        showMessage('Email verified successfully. You are now logged in!', 'signInMessage');
        // Redirect user to dashboard or home
        window.location.href = 'dashboard.html';
      } else {
        showMessage('Invalid verification code. Please try again.', 'signInMessage');
      }
    });
  }

  // Handling the email verification link when the user clicks on it
  const urlParams = new URLSearchParams(window.location.search);
  const oobCode = urlParams.get('oobCode'); // Get the verification code from the URL

  if (oobCode) {
    applyActionCode(auth, oobCode)  // Apply the code to verify the user's email
      .then(() => {
        showMessage('Your email has been successfully verified!', 'signInMessage');
        // Proceed to the next part of your flow (e.g., login or redirect)
        window.location.href = 'dashboard.html';
      })
      .catch((error) => {
        console.error("Error applying verification code:", error);
        showMessage('Failed to verify email. Please try again.', 'signInMessage');
      });
  }
});
