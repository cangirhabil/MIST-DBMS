import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCdbnY5opBDDT6gasUZuqmrFqOJvS_5bXc',
  authDomain: 'ucuza-kargola-test.firebaseapp.com',
  projectId: 'ucuza-kargola-test',
  storageBucket: 'ucuza-kargola-test.appspot.com',
  messagingSenderId: '765618233973',
  appId: '1:765618233973:web:2db057b9739886900a4e3c',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

export { app, auth, db }
