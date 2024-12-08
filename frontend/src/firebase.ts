import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAsh6LyCnS935QSx1N25gqKtF5flVU0YCs",
  authDomain: "mist-b91c0.firebaseapp.com",
  projectId: "mist-b91c0",
  storageBucket: "mist-b91c0.firebasestorage.app",
  messagingSenderId: "262859421675",
  appId: "1:262859421675:web:dc56c64a83e6f7c52a4bae",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

export { app, auth, db }
