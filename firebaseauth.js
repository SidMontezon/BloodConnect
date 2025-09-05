import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendEmailVerification, confirmPasswordReset } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

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
          showMessage('Sign-in Successful! A verification code has been sent to your email.', 'signInMessage');

          // Send email verification (second step of 2FA)
          sendEmailVerification(user)
            .then(() => {
              // After sending email verification, show the verification form
              document.getElementById('signInForm').style.display = 'none';  // Hide login form
              document.getElementById('verificationForm').style.display = 'block';  // Show verification form
            })
            .catch((error) => {
              console.error("Error sending email verification:", error);
              showMessage('Failed to send verification email', 'signInMessage');
            });
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

      // You would need to verify this code against the Firebase user's sent verification link
      // (usually by checking the URL for the code)

      // For this example, we simulate a basic code verification.
      // In a real scenario, you can compare it with the code sent to the email
      if (verificationCode === '123456') {  // Replace with real logic to validate the code
        showMessage('Email verified successfully. You are now logged in!', 'signInMessage');
        // Redirect user to dashboard or home
        window.location.href = 'dashboard.html';
      } else {
        showMessage('Invalid verification code. Please try again.', 'signInMessage');
      }
    });
  }

});
