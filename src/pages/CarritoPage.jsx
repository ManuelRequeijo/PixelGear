import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { Helmet } from "react-helmet-async"
import styled, { keyframes } from "styled-components"
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowLeft } from "react-icons/fi"

const fadeIn = keyframes`from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); }`

const Page = styled.div`max-width: 860px; margin: 0 auto; padding: 2rem 1rem; animation: ${fadeIn} 0.35s ease;`
const Titulo = styled.h1`font-size: 1.8rem; font-weight: 800; margin-bottom: 1.5rem; span { color: var(--color-primario); }`

const CarritoItem = styled.div`
  display: flex; align-items: center; gap: 1rem;
  background: var(--color-fondo-card); border: 1px solid var(--color-borde);
  border-radius: 14px; padding: 1rem; margin-bottom: 1rem;
  transition: box-shadow 0.2s;
  &:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.3); }
  @media (max-width: 480px) { flex-wrap: wrap; }
`

const ItemImg = styled.img`
  width: 80px; height: 80px; object-fit: cover; border-radius: 10px; flex-shrink: 0;
`

const ItemInfo = styled.div`flex: 1;`
const ItemNombre = styled.p`font-weight: 700; margin-bottom: 2px;`
const ItemCategoria = styled.p`font-size: 0.8rem; color: var(--color-texto-suave); margin-bottom: 4px;`
const ItemPrecioUnit = styled.p`font-size: 0.85rem; color: var(--color-texto-suave);`

const CantidadControl = styled.div`
  display: flex; align-items: center; gap: 8px;
`

const CantBtn = styled.button`
  width: 30px; height: 30px; border-radius: 8px; border: 1px solid var(--color-borde);
  background: transparent; color: var(--color-texto); cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: all 0.2s;
  &:hover { background: var(--color-primario); border-color: var(--color-primario); }
`

const Cantidad = styled.span`font-weight: 700; min-width: 20px; text-align: center;`

const ItemSubtotal = styled.p`
  font-weight: 800; font-size: 1rem; color: var(--color-primario);
  min-width: 90px; text-align: right;
`

const BtnEliminar = styled.button`
  background: none; border: none; color: var(--color-texto-suave);
  cursor: pointer; padding: 6px; border-radius: 8px; display: flex;
  transition: all 0.2s;
  &:hover { color: #e74c3c; background: rgba(231,76,60,0.1); }
`

const Resumen = styled.div`
  background: var(--color-fondo-card); border: 1px solid var(--color-borde);
  border-radius: 14px; padding: 1.5rem; margin-top: 1.5rem;
`

const ResumenFila = styled.div`
  display: flex; justify-content: space-between; margin-bottom: 0.75rem;
  color: var(--color-texto-suave); font-size: 0.9rem;
`

const ResumenTotal = styled.div`
  display: flex; justify-content: space-between; font-weight: 800;
  font-size: 1.2rem; border-top: 1px solid var(--color-borde); padding-top: 0.75rem;
  margin-top: 0.5rem; color: var(--color-texto);
  span:last-child { color: var(--color-primario); }
`

const BtnRow = styled.div`display: flex; gap: 10px; margin-top: 1.2rem; flex-wrap: wrap;`

const BtnPrimary = styled.button`
  flex: 1; padding: 0.85rem; background: var(--color-primario); color: #fff;
  border: none; border-radius: 12px; font-weight: 700; font-size: 1rem;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  gap: 8px; transition: background 0.2s, transform 0.15s;
  &:hover { background: var(--color-primario-hover); transform: translateY(-1px); }
`

const BtnGhost = styled(BtnPrimary)`
  background: transparent; border: 1px solid var(--color-borde);
  color: var(--color-texto-suave); flex: initial;
  &:hover { border-color: var(--color-primario); color: var(--color-texto); transform: none; }
`

const Vacio = styled.div`
  text-align: center; padding: 5rem 2rem;
  p { color: var(--color-texto-suave); margin: 1rem 0 2rem; font-size: 1.05rem; }
`

function CarritoPage() {
  const { carrito, addToCart, removeFromCart, deleteFromCart, clearCart, totalItems, totalPrecio } = useCart()

  if (carrito.length === 0) {
    return (
      <>
        <Helmet>
          <title>Carrito vacío — PixelGear</title>
        </Helmet>
        <Page>
          <Vacio>
            <FiShoppingBag size={64} style={{ color: "var(--color-texto-suave)", opacity: 0.4 }} />
            <p>Tu carrito está vacío</p>
            <BtnPrimary as={Link} to="/productos" style={{ display: "inline-flex", maxWidth: 220 }}>
              <FiArrowLeft /> Ver productos
            </BtnPrimary>
          </Vacio>
        </Page>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Mi Carrito ({totalItems}) — PixelGear</title>
      </Helmet>
      <Page>
        <Titulo>Mi <span>Carrito</span></Titulo>

        {carrito.map((producto) => (
          <CarritoItem key={producto.id}>
            <ItemImg src={producto.imagen} alt={producto.nombre} />
            <ItemInfo>
              <ItemNombre>{producto.nombre}</ItemNombre>
              <ItemCategoria>{producto.categoria}</ItemCategoria>
              <ItemPrecioUnit>${Number(producto.precio).toLocaleString()} c/u</ItemPrecioUnit>
            </ItemInfo>
            <CantidadControl>
              <CantBtn onClick={() => removeFromCart(producto.id)} aria-label="Restar">
                <FiMinus size={14} />
              </CantBtn>
              <Cantidad>{producto.cantidad}</Cantidad>
              <CantBtn onClick={() => addToCart(producto)} aria-label="Sumar">
                <FiPlus size={14} />
              </CantBtn>
            </CantidadControl>
            <ItemSubtotal>${(producto.precio * producto.cantidad).toLocaleString()}</ItemSubtotal>
            <BtnEliminar onClick={() => deleteFromCart(producto.id)} aria-label="Eliminar producto">
              <FiTrash2 />
            </BtnEliminar>
          </CarritoItem>
        ))}

        <Resumen>
          <ResumenFila>
            <span>Subtotal ({totalItems} {totalItems === 1 ? "ítem" : "ítems"})</span>
            <span>${totalPrecio.toLocaleString()}</span>
          </ResumenFila>
          <ResumenFila>
            <span>Envío</span>
            <span>A calcular</span>
          </ResumenFila>
          <ResumenTotal>
            <span>Total</span>
            <span>${totalPrecio.toLocaleString()}</span>
          </ResumenTotal>
          <BtnRow>
            <BtnGhost as={Link} to="/productos">
              <FiArrowLeft /> Seguir comprando
            </BtnGhost>
            <BtnPrimary id="btn-finalizar-compra">
              <FiShoppingBag /> Finalizar compra
            </BtnPrimary>
            <BtnGhost onClick={clearCart} style={{ color: "#e74c3c", borderColor: "rgba(231,76,60,0.3)" }}>
              <FiTrash2 /> Vaciar
            </BtnGhost>
          </BtnRow>
        </Resumen>
      </Page>
    </>
  )
}

export default CarritoPage
