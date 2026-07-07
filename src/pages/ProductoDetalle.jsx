import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase/config"
import { useCart } from "../context/CartContext"
import { Helmet } from "react-helmet-async"
import styled, { keyframes } from "styled-components"
import { FiShoppingCart, FiArrowLeft, FiCheck, FiPlus, FiMinus } from "react-icons/fi"

const fadeIn = keyframes`from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); }`
const spin = keyframes`to { transform: rotate(360deg); }`

const Contenedor = styled.div`
  max-width: 900px; margin: 0 auto; padding: 2rem 1rem;
  display: flex; gap: 2.5rem; flex-wrap: wrap; animation: ${fadeIn} 0.4s ease;
  @media (max-width: 640px) { flex-direction: column; }
`

const Imagen = styled.img`
  width: 340px; max-width: 100%; border-radius: 16px;
  object-fit: cover; border: 1px solid var(--color-borde);
  flex-shrink: 0;
  @media (max-width: 640px) { width: 100%; }
`

const Info = styled.div`flex: 1; min-width: 250px;`
const Categoria = styled.span`font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-primario); font-weight: 700;`
const Nombre = styled.h1`font-size: 1.7rem; font-weight: 800; margin: 0.5rem 0 0.8rem;`
const Precio = styled.p`font-size: 2rem; font-weight: 900; color: var(--color-primario); margin-bottom: 1rem;`
const Separador = styled.hr`border: none; border-top: 1px solid var(--color-borde); margin: 1rem 0;`
const Descripcion = styled.p`color: var(--color-texto-suave); line-height: 1.7; margin-bottom: 1.5rem;`

const CantidadControl = styled.div`
  display: flex; align-items: center; gap: 10px; margin-bottom: 1.2rem;
`
const CantBtn = styled.button`
  width: 34px; height: 34px; border-radius: 8px; border: 1px solid var(--color-borde);
  background: transparent; color: var(--color-texto); cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: all 0.2s;
  &:hover { background: var(--color-primario); border-color: var(--color-primario); }
`
const CantTexto = styled.span`font-weight: 700; font-size: 1.1rem; min-width: 24px; text-align: center;`
const CantLabel = styled.span`color: var(--color-texto-suave); font-size: 0.85rem;`

const BtnCarrito = styled.button`
  width: 100%; padding: 0.9rem; border: none; border-radius: 12px;
  font-size: 1rem; font-weight: 700; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  background: ${(p) => (p.$agregado ? "#27ae60" : "var(--color-primario)")};
  color: #fff; transition: all 0.25s;
  &:hover { background: ${(p) => (p.$agregado ? "#219a52" : "var(--color-primario-hover)")}; transform: translateY(-1px); }
`

const LinkVolver = styled(Link)`
  display: inline-flex; align-items: center; gap: 6px; margin-top: 1.2rem;
  color: var(--color-texto-suave); font-size: 0.9rem;
  &:hover { color: var(--color-primario); }
`

const SpinnerWrapper = styled.div`display: flex; justify-content: center; padding: 5rem;`
const Spinner = styled.div`
  width: 48px; height: 48px; border: 4px solid var(--color-borde);
  border-top-color: var(--color-primario); border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`

const Error = styled.div`
  text-align: center; padding: 4rem;
  p { color: var(--color-texto-suave); margin-bottom: 1.5rem; }
`

function ProductoDetalle() {
  const { id } = useParams()
  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [agregado, setAgregado] = useState(false)
  const [cantidad, setCantidad] = useState(1)
  const { addToCart } = useCart()

  useEffect(() => {
    const cargar = async () => {
      setCargando(true)
      try {
        const snap = await getDoc(doc(db, "productos", id))
        if (snap.exists()) {
          setProducto({ id: snap.id, ...snap.data() })
        }
      } catch {
        setProducto(null)
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [id])

  const handleAgregar = () => {
    for (let i = 0; i < cantidad; i++) addToCart(producto)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 2500)
  }

  if (cargando) return (
    <SpinnerWrapper><Spinner /></SpinnerWrapper>
  )

  if (!producto) return (
    <Error>
      <Helmet><title>Producto no encontrado — PixelGear</title></Helmet>
      <p>❌ Producto no encontrado.</p>
      <Link to="/productos" style={{ color: "var(--color-primario)" }}>← Volver a productos</Link>
    </Error>
  )

  return (
    <>
      <Helmet>
        <title>{producto.nombre} — PixelGear</title>
        <meta name="description" content={producto.descripcion} />
      </Helmet>
      <Contenedor>
        <Imagen src={producto.imagen} alt={producto.nombre} />
        <Info>
          <Categoria>{producto.categoria}</Categoria>
          <Nombre>{producto.nombre}</Nombre>
          <Precio>${Number(producto.precio).toLocaleString()}</Precio>
          <Separador />
          <Descripcion>{producto.descripcion}</Descripcion>

          <CantidadControl>
            <CantLabel>Cantidad:</CantLabel>
            <CantBtn onClick={() => setCantidad((q) => Math.max(1, q - 1))} aria-label="Restar">
              <FiMinus size={14} />
            </CantBtn>
            <CantTexto>{cantidad}</CantTexto>
            <CantBtn onClick={() => setCantidad((q) => q + 1)} aria-label="Sumar">
              <FiPlus size={14} />
            </CantBtn>
          </CantidadControl>

          <BtnCarrito $agregado={agregado} onClick={handleAgregar} id="btn-agregar-carrito">
            {agregado ? <FiCheck /> : <FiShoppingCart />}
            {agregado ? "¡Agregado!" : `Agregar${cantidad > 1 ? ` (${cantidad})` : ""} al carrito`}
          </BtnCarrito>

          <LinkVolver to="/productos">
            <FiArrowLeft /> Volver a productos
          </LinkVolver>
        </Info>
      </Contenedor>
    </>
  )
}

export default ProductoDetalle
