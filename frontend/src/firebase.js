// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "estate-mern-8688d.firebaseapp.com",
  projectId: "estate-mern-8688d",
  storageBucket: "estate-mern-8688d.appspot.com",
  messagingSenderId: "546431741488",
  appId: "1:546431741488:web:23f6e7743fb675cd8107f5",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
