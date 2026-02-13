// Firebase configuration
// You'll need to replace these with your own Firebase config values
// Get them from: https://console.firebase.google.com/

import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'

// TODO: Replace with your Firebase config
// Get this from Firebase Console > Project Settings > Your apps > Config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize services
export const storage = getStorage(app)
export const db = getFirestore(app)

export default app
