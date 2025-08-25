import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAs_d4UmQGQP3YvHk0qNGWj04A0B4gof2E", 
  authDomain: "heyteacher-web.firebaseapp.com",
  projectId: "heyteacher-web",
  storageBucket: "heyteacher-web.firebasestorage.app",
  messagingSenderId: "198109977023",
  appId: "1:198109977023:web:5ea46a5c516693a23e690a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
