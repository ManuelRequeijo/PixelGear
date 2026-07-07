// Header.jsx — La parte de arriba de la página (siempre visible).
// Importamos el CSS específico de este componente con "./Header.css"
// Cada componente puede tener su propio archivo de estilos.

import "./Header.css"
import NavBar from "./NavBar"

function Header() {
  return (
    <header>
      {/* El logo/nombre de la tienda */}
      <div className="header-logo">
        ⚡ Pixel<span>Gear</span>
      </div>

      {/* La barra de navegación con los links */}
      <NavBar />
    </header>
  )
}

export default Header
