import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signOut,
} from "firebase/auth";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHiDw5-uXPHcoKteYDxG1tE1BNkVjVkaY",
  authDomain: "chatbotksd.firebaseapp.com",
  projectId: "chatbotksd",
  storageBucket: "chatbotksd.firebasestorage.app",
  messagingSenderId: "345463865636",
  appId: "1:345463865636:web:4fd24a4cb3d77fb9d8b3b1",
  measurementId: "G-FP4ENL0V3Q",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signInAnonymously,
  signOut,
  doc,
  getDoc,
  setDoc,
};
