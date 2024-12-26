// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider  } from 'firebase/auth'
import { executeMutation } from "firebase/data-connect";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6ZgSFq7KrhGRTLoNMRyy9bOibXbrwGuE",
  authDomain: "superchat-1043c.firebaseapp.com",
  projectId: "superchat-1043c",
  storageBucket: "superchat-1043c.firebasestorage.app",
  messagingSenderId: "947031551209",
  appId: "1:947031551209:web:2e332ed4ea3a77701b9478"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// initialize google authentification
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const firestoreDb = getFirestore(app)