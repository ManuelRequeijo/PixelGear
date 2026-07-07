import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore"
import { db } from "../firebase/config"
import { useAuth } from "../context/AuthContext"
import styled, { keyframes } from "styled-components"
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCheck,
  FiAlertTriangle,
  FiLogOut,
  FiPackage,
} from "react-icons/fi"

// ── Animaciones ───────────────────────────────────────────────────────────────
const fadeIn = keyframes`from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); }`
const spin = keyframes`to { transform: rotate(360deg); }`

// ── Styled Components ─────────────────────────────────────────────────────────
const Page = styled.div`padding: 2rem; max-width: 1100px; margin: 0 auto; animation: ${fadeIn} 0.3s ease;`

const TopBar = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;
`

const Title = styled.h1`font-size: 1.6rem; font-weight: 800; span { color: var(--color-primario); }`

const BtnPrimary = styled.button`
  display: flex; align-items: center; gap: 8px;
  padding: 0.65rem 1.2rem; background: var(--color-primario);
  color: #fff; border: none; border-radius: 10px; font-weight: 700;
  cursor: pointer; transition: background 0.2s, transform 0.15s;
  &:hover { background: var(--color-primario-hover); transform: translateY(-1px); }
`

const BtnDanger = styled(BtnPrimary)`background: #e74c3c; &:hover { background: #c0392b; }`
const BtnGhost = styled(BtnPrimary)`background: transparent; border: 1px solid var(--color-borde); color: var(--color-texto-suave); &:hover { border-color: var(--color-primario); color: var(--color-texto); }`

const Spinner = styled.div`
  width: 48px; height: 48px; border: 4px solid var(--color-borde);
  border-top-color: var(--color-primario); border-radius: 50%;
  animation: ${spin} 0.8s linear infinite; margin: 4rem auto;
`

const ErrorBanner = styled.div`
  background: rgba(231,76,60,0.1); border: 1px solid rgba(231,76,60,0.3);
  border-radius: 10px; padding: 1rem; color: #e74c3c;
  display: flex; align-items: center; gap: 10px; margin-bottom: 1.5rem;
`

const ProductoGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.2rem;
`

const ProductoCard = styled.div`
  background: var(--color-fondo-card); border: 1px solid var(--color-borde);
  border-radius: 14px; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s;
  &:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
`

const CardImg = styled.img`
  width: 100%; height: 160px; object-fit: cover;
  background: #111;
`

const CardBody = styled.div`padding: 1rem;`
const CardCategoria = styled.span`font-size: 0.75rem; color: var(--color-primario); text-transform: uppercase; font-weight: 600;`
const CardNombre = styled.h3`font-size: 1rem; margin: 0.3rem 0; font-weight: 700;`
const CardPrecio = styled.p`font-size: 1.1rem; font-weight: 800; color: var(--color-primario);`

const CardActions = styled.div`display: flex; gap: 8px; margin-top: 0.8rem;`

// ── Modal ─────────────────────────────────────────────────────────────────────
const Overlay = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,0.75);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
  padding: 1rem;
`

const Modal = styled.div`
  background: var(--color-fondo-card); border: 1px solid var(--color-borde);
  border-radius: 16px; padding: 2rem; width: 100%; max-width: 500px;
  animation: ${fadeIn} 0.25s ease;
`

const ModalTitle = styled.h2`font-size: 1.2rem; font-weight: 800; margin-bottom: 1.5rem;`

const FormGroup = styled.div`margin-bottom: 1rem;`
const Label = styled.label`font-size: 0.85rem; color: var(--color-texto-suave); display: block; margin-bottom: 6px;`
const StyledInput = styled.input`
  width: 100%; padding: 0.7rem 1rem; background: rgba(255,255,255,0.05);
  border: 1px solid var(--color-borde); border-radius: 8px; color: var(--color-texto);
  font-size: 0.95rem;
  &:focus { outline: none; border-color: var(--color-primario); }
`

const StyledTextarea = styled.textarea`
  width: 100%; padding: 0.7rem 1rem; background: rgba(255,255,255,0.05);
  border: 1px solid var(--color-borde); border-radius: 8px; color: var(--color-texto);
  font-size: 0.95rem; resize: vertical; min-height: 90px;
  &:focus { outline: none; border-color: var(--color-primario); }
`

const ModalFooter = styled.div`display: flex; gap: 10px; justify-content: flex-end; margin-top: 1.5rem;`

const ConfirmText = styled.p`color: var(--color-texto-suave); margin-bottom: 1.5rem;`

// ── Valores por defecto del formulario ────────────────────────────────────────
const FORM_INICIAL = { nombre: "", precio: "", categoria: "", imagen: "", descripcion: "" }

// ── Componente Principal ──────────────────────────────────────────────────────
function AdminPanel() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [errorMsg, setErrorMsg] = useState(null)
  const [guardando, setGuardando] = useState(false)

  // Modales
  const [modalForm, setModalForm] = useState(false)
  const [modalEliminar, setModalEliminar] = useState(false)
  const [productoActual, setProductoActual] = useState(null) // null = nuevo

  const [form, setForm] = useState(FORM_INICIAL)
  const [erroresForm, setErroresForm] = useState({})

  const { logout } = useAuth()
  const navigate = useNavigate()

  // ── Cargar productos de Firestore ─────────────────────────────────────────
  const cargarProductos = async () => {
    setCargando(true)
    setErrorMsg(null)
    try {
      const snap = await getDocs(collection(db, "productos"))
      const datos = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      setProductos(datos)
    } catch {
      setErrorMsg("Error al cargar productos. Revisá tu conexión.")
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { cargarProductos() }, [])

  // ── Validaciones del formulario ───────────────────────────────────────────
  const validar = () => {
    const e = {}
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio."
    if (!form.precio || Number(form.precio) <= 0) e.precio = "El precio debe ser mayor a 0."
    if (!form.categoria.trim()) e.categoria = "La categoría es obligatoria."
    if (!form.imagen.trim()) e.imagen = "La URL de imagen es obligatoria."
    setErroresForm(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErroresForm({ ...erroresForm, [e.target.name]: undefined })
  }

  // ── Abrir modal para nuevo producto ──────────────────────────────────────
  const abrirNuevo = () => {
    setProductoActual(null)
    setForm(FORM_INICIAL)
    setErroresForm({})
    setModalForm(true)
  }

  // ── Abrir modal para editar ───────────────────────────────────────────────
  const abrirEditar = (p) => {
    setProductoActual(p)
    setForm({
      nombre: p.nombre,
      precio: String(p.precio),
      categoria: p.categoria,
      imagen: p.imagen,
      descripcion: p.descripcion || "",
    })
    setErroresForm({})
    setModalForm(true)
  }

  // ── Guardar (crear o editar) ──────────────────────────────────────────────
  const handleGuardar = async (e) => {
    e.preventDefault()
    if (!validar()) return
    setGuardando(true)
    setErrorMsg(null)
    try {
      const datos = {
        nombre: form.nombre.trim(),
        precio: Number(form.precio),
        categoria: form.categoria.trim(),
        imagen: form.imagen.trim(),
        descripcion: form.descripcion.trim(),
      }
      if (productoActual) {
        await updateDoc(doc(db, "productos", productoActual.id), datos)
      } else {
        await addDoc(collection(db, "productos"), datos)
      }
      setModalForm(false)
      await cargarProductos()
    } catch {
      setErrorMsg("Error al guardar el producto. Intentá de nuevo.")
    } finally {
      setGuardando(false)
    }
  }

  // ── Confirmar eliminación ─────────────────────────────────────────────────
  const abrirEliminar = (p) => {
    setProductoActual(p)
    setModalEliminar(true)
  }

  const handleEliminar = async () => {
    setGuardando(true)
    try {
      await deleteDoc(doc(db, "productos", productoActual.id))
      setModalEliminar(false)
      await cargarProductos()
    } catch {
      setErrorMsg("Error al eliminar el producto.")
    } finally {
      setGuardando(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <Helmet>
        <title>Panel Admin — PixelGear</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <Page>
        <TopBar>
          <Title>⚡ Panel <span>Admin</span></Title>
          <div style={{ display: "flex", gap: "10px" }}>
            <BtnPrimary onClick={abrirNuevo} id="btn-nuevo-producto">
              <FiPlus /> Nuevo producto
            </BtnPrimary>
            <BtnGhost onClick={handleLogout} id="btn-logout">
              <FiLogOut /> Cerrar sesión
            </BtnGhost>
          </div>
        </TopBar>

        {errorMsg && (
          <ErrorBanner>
            <FiAlertTriangle /> {errorMsg}
          </ErrorBanner>
        )}

        {cargando ? (
          <Spinner />
        ) : productos.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--color-texto-suave)" }}>
            <FiPackage size={48} style={{ marginBottom: "1rem", opacity: 0.4 }} />
            <p>No hay productos todavía. ¡Agregá el primero!</p>
          </div>
        ) : (
          <ProductoGrid>
            {productos.map((p) => (
              <ProductoCard key={p.id}>
                <CardImg src={p.imagen} alt={p.nombre} />
                <CardBody>
                  <CardCategoria>{p.categoria}</CardCategoria>
                  <CardNombre>{p.nombre}</CardNombre>
                  <CardPrecio>${Number(p.precio).toLocaleString()}</CardPrecio>
                  <CardActions>
                    <BtnGhost onClick={() => abrirEditar(p)} style={{ flex: 1 }} id={`btn-editar-${p.id}`}>
                      <FiEdit2 /> Editar
                    </BtnGhost>
                    <BtnDanger onClick={() => abrirEliminar(p)} style={{ flex: 1 }} id={`btn-eliminar-${p.id}`}>
                      <FiTrash2 /> Eliminar
                    </BtnDanger>
                  </CardActions>
                </CardBody>
              </ProductoCard>
            ))}
          </ProductoGrid>
        )}

        {/* ── Modal Formulario ─────────────────────────────────────────────── */}
        {modalForm && (
          <Overlay onClick={() => setModalForm(false)}>
            <Modal onClick={(e) => e.stopPropagation()}>
              <ModalTitle>{productoActual ? "Editar producto" : "Nuevo producto"}</ModalTitle>
              <form onSubmit={handleGuardar}>
                <FormGroup>
                  <Label>Nombre *</Label>
                  <StyledInput name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej: Teclado Mecánico RGB" />
                  {erroresForm.nombre && <span style={{ color: "#e74c3c", fontSize: "0.8rem" }}>{erroresForm.nombre}</span>}
                </FormGroup>
                <FormGroup>
                  <Label>Precio *</Label>
                  <StyledInput name="precio" type="number" min="0" value={form.precio} onChange={handleChange} placeholder="Ej: 45000" />
                  {erroresForm.precio && <span style={{ color: "#e74c3c", fontSize: "0.8rem" }}>{erroresForm.precio}</span>}
                </FormGroup>
                <FormGroup>
                  <Label>Categoría *</Label>
                  <StyledInput name="categoria" value={form.categoria} onChange={handleChange} placeholder="Ej: periféricos" />
                  {erroresForm.categoria && <span style={{ color: "#e74c3c", fontSize: "0.8rem" }}>{erroresForm.categoria}</span>}
                </FormGroup>
                <FormGroup>
                  <Label>URL de imagen *</Label>
                  <StyledInput name="imagen" value={form.imagen} onChange={handleChange} placeholder="https://..." />
                  {erroresForm.imagen && <span style={{ color: "#e74c3c", fontSize: "0.8rem" }}>{erroresForm.imagen}</span>}
                </FormGroup>
                <FormGroup>
                  <Label>Descripción</Label>
                  <StyledTextarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción del producto..." />
                </FormGroup>
                <ModalFooter>
                  <BtnGhost type="button" onClick={() => setModalForm(false)}>
                    <FiX /> Cancelar
                  </BtnGhost>
                  <BtnPrimary type="submit" disabled={guardando}>
                    <FiCheck /> {guardando ? "Guardando..." : "Guardar"}
                  </BtnPrimary>
                </ModalFooter>
              </form>
            </Modal>
          </Overlay>
        )}

        {/* ── Modal Confirmar Eliminación ──────────────────────────────────── */}
        {modalEliminar && (
          <Overlay onClick={() => setModalEliminar(false)}>
            <Modal onClick={(e) => e.stopPropagation()}>
              <ModalTitle>⚠️ Confirmar eliminación</ModalTitle>
              <ConfirmText>
                ¿Estás seguro que querés eliminar <strong>{productoActual?.nombre}</strong>?
                Esta acción no se puede deshacer.
              </ConfirmText>
              <ModalFooter>
                <BtnGhost onClick={() => setModalEliminar(false)}>
                  <FiX /> Cancelar
                </BtnGhost>
                <BtnDanger onClick={handleEliminar} disabled={guardando} id="btn-confirmar-eliminar">
                  <FiTrash2 /> {guardando ? "Eliminando..." : "Sí, eliminar"}
                </BtnDanger>
              </ModalFooter>
            </Modal>
          </Overlay>
        )}
      </Page>
    </>
  )
}

export default AdminPanel
