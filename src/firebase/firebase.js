// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1rkPdaw9RUvCeAPvL2FOVWCAa8JtBxqE",
  authDomain: "piggybank-a7c1f.firebaseapp.com",
  projectId: "piggybank-a7c1f",
  storageBucket: "piggybank-a7c1f.firebasestorage.app",
  messagingSenderId: "555181485867",
  appId: "1:555181485867:web:653895a3a1ad2537885f6e",
  measurementId: "G-693YYVGN5M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore and Auth
const db = getFirestore(app); // Initialize Firestore
const auth = getAuth(app); // Initialize Auth

// Export db and auth
export { db, auth };