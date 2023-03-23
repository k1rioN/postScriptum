// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_L0hhZdRabfj5VLTj8a10hP5rRhGSrhs",
  authDomain: "psapp-610d9.firebaseapp.com",
  projectId: "psapp-610d9",
  storageBucket: "psapp-610d9.appspot.com",
  messagingSenderId: "832378079131",
  appId: "1:832378079131:web:10b820ac63ca59937ec33e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth =  getAuth();
export const storage = getStorage();
export const database = getFirestore();