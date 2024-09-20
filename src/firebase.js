import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCzxcVvFtyJhDyrso6v76HrYIL7esmm6mo",
  authDomain: "zotsystem.firebaseapp.com",
  projectId: "zotsystem",
  storageBucket: "zotsystem.appspot.com",
  messagingSenderId: "958097250992",
  appId: "1:958097250992:web:e0329e1b5909b9f9cc3975"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);