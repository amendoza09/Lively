import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDwKBPJETsiwTWLXtGFIcvzdXvqqBDfEf0",
  authDomain: "lively-2f6ea.firebaseapp.com",
  projectId: "lively-2f6ea",
  storageBucket: "lively-2f6ea.firebasestorage.app",
  messagingSenderId: "1088967220274",
  appId: "1:1088967220274:web:e7437a41023e63a71df02b",
  measurementId: "G-VTLR3Q24ZL"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };