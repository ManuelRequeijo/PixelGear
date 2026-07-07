import { Link } from "react-router-dom"
import styled, { keyframes } from "styled-components"
import { FiEye, FiShoppingCart } from "react-icons/fi"
import { useCart } from "../../context/CartContext"

const fadeUp = keyframes`from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); }`

const Card = styled.div`
  background: var(--color-fondo-card);
  border: 1px solid var(--color-borde);
  border-radius: 16px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s, box-shadow 0.25s;
  animation: ${fadeUp} 0.35s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 32px rgba(108, 99, 255, 0.2);
  }
`

const ImgWrapper = styled.div`
  position: relative;
  overflow: hidden;
  height: 200px;
  background: #111;
`

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s;
  ${Card}:hover & { transform: scale(1.06); }
`

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.3s;
  ${Card}:hover & { opacity: 1; }
`

const OverlayBtn = styled(Link)`
  background: var(--color-primario);
  color: #fff !important;
  border: none;
  border-radius: 10px;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s;
  &:hover { background: var(--color-primario-hover); }
`

const QuickAdd = styled.button`
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(8px);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 10px;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background 0.2s;
  &:hover { background: rgba(255,255,255,0.2); }
`

const Body = styled.div`
  padding: 1.1rem;
  display: flex;
  flex-direction: column;
  flex: 1;
`

const Categoria = styled.span`
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-primario);
  font-weight: 700;
`

const Nombre = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  margin: 0.3rem 0 0.6rem;
  color: var(--color-texto);
  flex: 1;
`

const Precio = styled.p`
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--color-primario);
  margin-bottom: 1rem;
`

const BtnDetalle = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0.65rem;
  background: var(--color-primario);
  color: #fff !important;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.9rem;
  transition: background 0.2s, transform 0.15s;
  &:hover { background: var(--color-primario-hover); transform: translateY(-1px); }
`

function Item({ id, nombre, precio, imagen, categoria }) {
  const { addToCart } = useCart()

  const handleQuickAdd = (e) => {
    e.preventDefault()
    addToCart({ id, nombre, precio, imagen, categoria })
  }

  return (
    <Card>
      <ImgWrapper>
        <Img src={imagen} alt={nombre} loading="lazy" />
        <Overlay>
          <OverlayBtn to={`/producto/${id}`}>
            <FiEye /> Ver
          </OverlayBtn>
          <QuickAdd onClick={handleQuickAdd} aria-label="Agregar al carrito">
            <FiShoppingCart size={16} />
          </QuickAdd>
        </Overlay>
      </ImgWrapper>
      <Body>
        <Categoria>{categoria}</Categoria>
        <Nombre>{nombre}</Nombre>
        <Precio>${Number(precio).toLocaleString()}</Precio>
        <BtnDetalle to={`/producto/${id}`} id={`btn-detalle-${id}`}>
          <FiEye /> Ver detalle
        </BtnDetalle>
      </Body>
    </Card>
  )
}

export default Item
