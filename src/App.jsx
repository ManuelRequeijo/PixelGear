import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/layout/Layout"
import Home from "./pages/Home"
import Productos from "./pages/Productos"
import ProductoDetalle from "./pages/ProductoDetalle"
import CarritoPage from "./pages/CarritoPage"
import Login from "./pages/Login"
import AdminPanel from "./pages/AdminPanel"
import RutaProtegida from "./components/RutaProtegida"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta de login sin Layout (pantalla completa) */}
        <Route path="/login" element={<Login />} />

        {/* Rutas con Layout (header + footer) */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/productos" element={<Layout><Productos /></Layout>} />
        <Route path="/producto/:id" element={<Layout><ProductoDetalle /></Layout>} />
        <Route path="/carrito" element={<Layout><CarritoPage /></Layout>} />

        {/* Ruta protegida — solo usuarios autenticados */}
        <Route
          path="/admin"
          element={
            <RutaProtegida>
              <Layout><AdminPanel /></Layout>
            </RutaProtegida>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App