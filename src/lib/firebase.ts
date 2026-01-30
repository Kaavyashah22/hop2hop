import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCWhLK44m2FFKgsz-rtgxWC_er1inOId4I",
  authDomain: "indiamart-makeit.firebaseapp.com",
  projectId: "indiamart-makeit",
  storageBucket: "indiamart-makeit.firebasestorage.app",
  messagingSenderId: "116412251069",
  appId: "1:116412251069:web:53244624f1bd4b5a7930d4",
  measurementId: "G-B9SE3GG8J5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
