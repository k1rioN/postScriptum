// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbon11I710cZ1X_L4LpQiDLQiA5qhIOZc",
  authDomain: "socialapp-ad261.firebaseapp.com",
  projectId: "socialapp-ad261",
  storageBucket: "socialapp-ad261.appspot.com",
  messagingSenderId: "767783112702",
  appId: "1:767783112702:web:319863696c723561b93aaf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth =  getAuth();
export const storage = getStorage(app);
export const database = getFirestore();