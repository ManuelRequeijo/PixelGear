import { Link, useNavigate } from "react-router-dom"
import styled from "styled-components"
import { FiShoppingCart, FiUser, FiLogOut, FiSettings } from "react-icons/fi"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"

const Nav = styled.nav`display: flex; align-items: center; gap: 0.5rem;`

const NavLink = styled(Link)`
  color: var(--color-texto-suave); font-weight: 500; font-size: 0.92rem;
  padding: 0.4rem 0.75rem; border-radius: 8px; transition: all 0.2s;
  &:hover { color: var(--color-texto); background: rgba(255,255,255,0.06); }
`

const CartBtn = styled(Link)`
  position: relative; display: flex; align-items: center; gap: 6px;
  background: rgba(108, 99, 255, 0.15); border: 1px solid rgba(108, 99, 255, 0.3);
  color: var(--color-primario) !important; padding: 0.45rem 0.85rem;
  border-radius: 10px; font-weight: 700; font-size: 0.9rem; transition: all 0.2s;
  &:hover { background: rgba(108, 99, 255, 0.28); }
`

const Badge = styled.span`
  background: var(--color-primario); color: #fff; border-radius: 50%;
  width: 18px; height: 18px; font-size: 0.7rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
`

const IconBtn = styled.button`
  background: none; border: none; color: var(--color-texto-suave);
  cursor: pointer; padding: 0.45rem; border-radius: 8px;
  display: flex; align-items: center; transition: all 0.2s;
  &:hover { color: var(--color-texto); background: rgba(255,255,255,0.06); }
`

function NavBar() {
  const { totalItems } = useCart()
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  return (
    <Nav>
      <NavLink to="/" id="nav-inicio">Inicio</NavLink>
      <NavLink to="/productos" id="nav-productos">Productos</NavLink>

      {usuario && (
        <NavLink to="/admin" id="nav-admin">
          <FiSettings size={14} style={{ marginRight: 4 }} />Admin
        </NavLink>
      )}

      {!usuario ? (
        <NavLink to="/login" id="nav-login">
          <FiUser size={14} style={{ marginRight: 4 }} />Ingresar
        </NavLink>
      ) : (
        <IconBtn onClick={handleLogout} aria-label="Cerrar sesión" title="Cerrar sesión">
          <FiLogOut size={16} />
        </IconBtn>
      )}

      <CartBtn to="/carrito" id="nav-carrito">
        <FiShoppingCart size={16} />
        {totalItems > 0 && <Badge>{totalItems}</Badge>}
      </CartBtn>
    </Nav>
  )
}

export default NavBar
