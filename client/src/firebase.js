import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Replace with your Firebase config
const firebaseConfig = {
     apiKey: "AIzaSyCCviafJ5j7SMKpu27OntMxCBYHYA0KZsY",

  authDomain: "movieflix-19c15.firebaseapp.com",

  projectId: "movieflix-19c15",

  storageBucket: "movieflix-19c15.firebasestorage.app",

  messagingSenderId: "586615703476",

  appId: "1:586615703476:web:5bacb0414143cb55a854e1",

  measurementId: "G-XJDR73Y330"

};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
