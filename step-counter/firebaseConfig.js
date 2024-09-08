// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZFoJXMGSd_m4X7OSxpQIF-44lAICgkGs",
  authDomain: "step-counter-10f91.firebaseapp.com",
  projectId: "step-counter-10f91",
  storageBucket: "step-counter-10f91.appspot.com",
  messagingSenderId: "617016710719",
  appId: "1:617016710719:web:d6291f1fe450030db60a8a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
