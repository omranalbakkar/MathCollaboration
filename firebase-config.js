// firebase-config.js
// Version 3 - Fixed onSnapshot Export

// 1. Import ALL necessary Firebase modules (v10.8.0)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

// Auth
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut, 
  createUserWithEmailAndPassword, 
  updatePassword, 
  reauthenticateWithCredential, 
  EmailAuthProvider 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Firestore 
import { 
  getFirestore, 
  doc, setDoc, getDoc, updateDoc, deleteDoc, 
  collection, query, where, getDocs, 
  serverTimestamp, orderBy, limit,
  addDoc, 
  getCountFromServer,
  onSnapshot,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Realtime Database
import { 
  getDatabase, 
  ref, set, push, onValue, update, remove, child, get 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// 2. Your Web App Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCay_CY1kTHJR51UekskDwgZ_FGUaWml9A",
  authDomain: "eduboard-870d3.firebaseapp.com",
  databaseURL: "https://eduboard-870d3-default-rtdb.firebaseio.com",
  projectId: "eduboard-870d3",
  storageBucket: "eduboard-870d3.firebasestorage.app",
  messagingSenderId: "658705588696",
  appId: "1:658705588696:web:9e55ce87364f26a9fb52ad",
  measurementId: "G-LMDZHSMSB7"
};

// 3. Initialize Firebase
const app = initializeApp(firebaseConfig);

// 4. Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtDB = getDatabase(app);

// 5. Export ALL functions for use in HTML pages
export { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut, 
  createUserWithEmailAndPassword, 
  updatePassword, 
  reauthenticateWithCredential, 
  EmailAuthProvider,
  doc, setDoc, getDoc, updateDoc, deleteDoc, addDoc, 
  collection, query, where, getDocs, getCountFromServer, 
  serverTimestamp, orderBy, limit,
  onSnapshot, // <--- 2. ADDED HERE (Export)
  ref, set, push, onValue, update, remove, child, get
};

console.log("✅ EduBoard Connected to: eduboard-870d3");
