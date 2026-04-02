// ============================================================
//  EDUBOARD — FIREBASE CONFIGURATION
//  Enhanced for multi-role platform with Auth + Firestore + RTDB
//
//  HOW TO SET UP:
//  1. Go to https://console.firebase.google.com/
//  2. Open your project (or create one)
//  3. Enable Authentication → Sign-in method → Email/Password
//  4. Enable Firestore Database → Create database (production mode)
//  5. Enable Realtime Database → Create database
//  6. Replace the values below with your project config
//
//  FIRESTORE SECURITY RULES (paste in Firebase Console):
//  See firestore.rules file or the README for full rules.
//
//  INITIAL SUPER ADMIN SETUP:
//  1. Create a user in Firebase Auth Console (Authentication → Users → Add)
//  2. Note the UID
//  3. In Firestore → users collection → create document with that UID
//     Fields: { role: "superadmin", name: "Super Admin",
//               email: "your@email.com", active: true,
//               createdAt: <timestamp> }
// ============================================================

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyBR2PLuRdA88cSXOz44WxNQxubb8i6CcsU",
    authDomain: "edu-interact.firebaseapp.com",
    databaseURL: "https://edu-interact-default-rtdb.firebaseio.com",
    projectId: "edu-interact",
    storageBucket: "edu-interact.firebasestorage.app",
    messagingSenderId: "651012797078",
    appId: "1:651012797078:web:16647c0adb49b27d3ac8b7",
    measurementId: "G-LBCLK24BX9"
};
