import { registerUser } from "../firebase/firestore.js";

const createAccount = async () => {
  if (firstName.value.trim() === "" || lastName.value.trim() === "" || email.value.trim() === "" || password.value.trim() === "") {
    errorMessage.style.display = "block";
    errorMessage2.style.display = 'none';
    errorMessage3.style.display = 'none'

  } else {
    errorMessage.style.display = "none";
    const userInfo = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value
    }
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const confirmEmail = emailRegex.test(userInfo.email);
    const confirmPassword = passwordRegex.test(userInfo.password);
    if (confirmEmail) {
      if (confirmPassword) {
        try {
          btn.innerHTML = `
            <span class="spinner-grow spinner-grow-sm" aria-hidden="true"></span>
            <span role="status">Loading ...</span>
          `;
          await registerUser(userInfo);
          setTimeout(() => {
            window.location.href = '../signin/index.html';
          }, 2000)
        } catch (error) {
          if (error.message === 'Email already registered') {
            alert('Account already exists!');
            window.location.href = '../signin/index.html';
          } else {
            alert('Error creating account: ' + error.message);
            btn.innerHTML = 'Create Account';
          }
        }
      } else {
        errorMessage3.style.display = 'block'
        errorMessage2.style.display = 'none';
        errorMessage.style.display = 'none'
      }
    } else {
      errorMessage2.style.display = 'block';
      errorMessage.style.display = 'none'
      errorMessage3.style.display = 'none'
    }
  }
}

// Continue with google  & github button

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7RJNXJvCyxJW59ge_30HcpDQrS3SGYCQ",
  authDomain: "e-store-project-24928.firebaseapp.com",
  projectId: "e-store-project-24928",
  storageBucket: "e-store-project-24928.firebasestorage.app",
  messagingSenderId: "108352256578",
  appId: "1:108352256578:web:9abfa1487e033c09668bdb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const provider2 = new GithubAuthProvider();

const google = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user
      console.log(user);
      if (user) {
        setTimeout(() => {
          window.location.href = '../index.html'
        }, 1000)
      } else {
        window.location.href = '../signup/index.html'
      };
    }).catch((error) => {
      const errorCode = error.code;
      console.log(errorCode)
    });
}

const github = () => {
  signInWithPopup(auth, provider2)
    .then((result) => {
      const user = result.user;
      console.log(user);

      setTimeout(() => {
        window.location.href = '../index.html';
      }, 1000)
    })
    .catch((error) => {
      const errorCode = error.code;
      console.log(errorCode);

      // ⚠️ If account already exists with a different provider
      if (errorCode === "auth/account-exists-with-different-credential") {
        console.warn("Account exists with another provider. Continuing...");

        // Force redirect even if Firebase rejects the login
        window.location.href = '../index.html';
      } else {
        alert(error.message);
      }
    });
}

window.google = google;
window.github = github;