import { createContext, useContext, useEffect, useState } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth"
import { auth } from "../firebase/config"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargandoAuth, setCargandoAuth] = useState(true)
  const [error, setError] = useState(null)

  // Escucha cambios de sesión en tiempo real
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUsuario(user)
      setCargandoAuth(false)
    })
    return () => unsub()
  }, [])

  const registrar = async (email, password) => {
    setError(null)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (err) {
      setError(traducirError(err.code))
      throw err
    }
  }

  const login = async (email, password) => {
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      setError(traducirError(err.code))
      throw err
    }
  }

  const logout = () => signOut(auth)

  return (
    <AuthContext.Provider
      value={{ usuario, cargandoAuth, error, setError, login, logout, registrar }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

// Traduce códigos de error de Firebase a español
function traducirError(code) {
  const errores = {
    "auth/user-not-found": "No existe una cuenta con ese email.",
    "auth/wrong-password": "Contraseña incorrecta.",
    "auth/email-already-in-use": "Ese email ya está registrado.",
    "auth/invalid-email": "El formato del email no es válido.",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    "auth/too-many-requests": "Demasiados intentos. Esperá unos minutos.",
    "auth/invalid-credential": "Email o contraseña incorrectos.",
  }
  return errores[code] || "Ocurrió un error. Intentá de nuevo."
}
