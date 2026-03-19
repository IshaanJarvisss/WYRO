import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCz9cM7bUCAJnW2cr0qIZxaS60mWgRVAyM",
  authDomain: "wyr-olympics.firebaseapp.com",
  projectId: "wyr-olympics",
  storageBucket: "wyr-olympics.firebasestorage.app",
  messagingSenderId: "5860419843",
  appId: "1:5860419843:web:45f65b48d42c36850ae136"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs, onSnapshot };