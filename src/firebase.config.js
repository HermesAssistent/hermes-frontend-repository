// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBzYGQ4Kk8IWptOHANMYEgNxKy-Po-ClSE",
  authDomain: "hermes-assistant-6c198.firebaseapp.com",
  projectId: "hermes-assistant-6c198",
  storageBucket: "hermes-assistant-6c198.firebasestorage.app",
  messagingSenderId: "427922081274",
  appId: "1:427922081274:web:dfbdc1463b4cd15d825043",
  measurementId: "G-HJEW140E2C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);