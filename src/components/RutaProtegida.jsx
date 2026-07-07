// RutaProtegida.jsx — Redirige al login si el usuario no está autenticado
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function RutaProtegida({ children }) {
  const { usuario, cargandoAuth } = useAuth()

  if (cargandoAuth) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
        <div className="spinner" />
      </div>
    )
  }

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default RutaProtegida
