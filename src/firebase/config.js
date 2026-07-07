// Configuración de Firebase

import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDeNmcVshnOC4gKRIFUSsj2flUZdDh19-A",
  authDomain: "pixelgear-91c9a.firebaseapp.com",
  projectId: "pixelgear-91c9a",
  storageBucket: "pixelgear-91c9a.firebasestorage.app",
  messagingSenderId: "195226515781",
  appId: "1:195226515781:web:5bb0798b95e5d7cdc9662c",
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
