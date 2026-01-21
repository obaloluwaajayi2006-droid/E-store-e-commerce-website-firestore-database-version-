import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

// Firebase configuration
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
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, app };
