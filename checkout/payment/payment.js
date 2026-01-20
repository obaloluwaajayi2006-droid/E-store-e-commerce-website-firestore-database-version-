let addressData = JSON.parse(localStorage.getItem('addressData')) || [];
const lastAdress = addressData[addressData.length - 1];
console.log(lastAdress.fName, lastAdress.lName)

deliveryName.innerHTML = lastAdress.fName + ' ' + lastAdress.lName;
deliveryAddress.innerHTML = lastAdress.add;

// Paystack and firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD7RJNXJvCyxJW59ge_30HcpDQrS3SGYCQ",
  authDomain: "e-store-project-24928.firebaseapp.com",
  projectId: "e-store-project-24928",
  storageBucket: "e-store-project-24928.firebasestorage.app",
  messagingSenderId: "108352256578",
  appId: "1:108352256578:web:9abfa1487e033c09668bdb"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth();

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(user);
    document.getElementById('profileImg').innerHTML = `<img src="${user.photoURL}" alt="Profile" style="width: 32px; height: 32px; border-radius: 50%;">
      `
  } else {
    setTimeout(() => {
      window.location.href = '/signup/index.html';
    }, 1000)
  }
});