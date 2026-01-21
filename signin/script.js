import { loginUser } from "../firebase/firestore.js";

let fetched = {};

const signIn = async () => {
  if (email.value.trim() === '' || password.value.trim() === '') {
    errorMessage.style.display = "block";
    errorMessage2.style.display = 'none';
  } else {
    errorMessage.style.display = 'none'
    try {
      btn.innerHTML = `
            <span class="spinner-grow spinner-grow-sm" aria-hidden="true"></span>
            <span role="status">Loading ...</span>
          `
      const signinDetails = {
        email: email.value,
        password: password.value
      }
      const user = await loginUser(signinDetails.email, signinDetails.password);
      console.log('User logged in:', user);
      setTimeout(() => {
        window.location.href = '../index.html';
      }, 2000)
    } catch (error) {
      errorMessage2.style.display = 'block';
      errorMessage.style.display = 'none';
      btn.innerHTML = 'Sign In';
      console.error('Login error:', error);
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

      if (errorCode === "auth/account-exists-with-different-credential") {
        console.warn("Account exists with another provider. Continuing...");


        window.location.href = '../index.html';
      } else {
        alert(error.message);
      }
    });
}

window.google = google;
window.github = github;