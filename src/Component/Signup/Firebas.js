// Firebas.js (Initialize Firebase)
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';

import { getStorage } from 'firebase/storage'; 

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAOXzYgrx7i_LcbplKdWd26ccvXUBMN4oc",
  authDomain: "chat-app-65001.firebaseapp.com",
  projectId: "chat-app-65001",
  storageBucket: "chat-app-65001.appspot.com",
  messagingSenderId: "998325810025",
  appId: "1:998325810025:web:8cf6fa549177bec4c083f8",
  measurementId: "G-4K1C3J4MDZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app); // Initialize storage

export { auth,storage };
