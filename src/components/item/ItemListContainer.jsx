import { useState, useEffect, useMemo } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../firebase/config"
import { Helmet } from "react-helmet-async"
import { Container, Row, Col } from "react-bootstrap"
import styled, { keyframes } from "styled-components"
import { FiSearch, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi"
import Item from "./Item"

const PRODUCTOS_POR_PAGINA = 6

// ── Animaciones ───────────────────────────────────────────────────────────────
const spin = keyframes`to { transform: rotate(360deg); }`
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`

// ── Styled Components ─────────────────────────────────────────────────────────
const Spinner = styled.div`
  width: 52px; height: 52px; border: 4px solid var(--color-borde);
  border-top-color: var(--color-primario); border-radius: 50%;
  animation: ${spin} 0.8s linear infinite; margin: 5rem auto;
`

const SearchWrapper = styled.div`
  position: relative; max-width: 480px; margin: 0 auto 2rem;
`

const SearchIcon = styled.span`
  position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
  color: var(--color-texto-suave); display: flex;
`

const ClearBtn = styled.button`
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  background: none; border: none; color: var(--color-texto-suave);
  cursor: pointer; display: flex; padding: 4px;
  &:hover { color: var(--color-texto); }
`

const SearchInput = styled.input`
  width: 100%; padding: 0.75rem 2.8rem; background: var(--color-fondo-card);
  border: 1px solid var(--color-borde); border-radius: 12px; color: var(--color-texto);
  font-size: 0.95rem; transition: border 0.2s;
  &:focus { outline: none; border-color: var(--color-primario); }
  &::placeholder { color: var(--color-texto-suave); }
`

const Titulo = styled.h2`
  font-size: 1.8rem; font-weight: 800; text-align: center;
  margin-bottom: 0.5rem;
  span { color: var(--color-primario); }
`

const SubTitulo = styled.p`
  text-align: center; color: var(--color-texto-suave);
  font-size: 0.9rem; margin-bottom: 2rem;
`

const GridWrapper = styled.div`animation: ${fadeIn} 0.3s ease;`

const SinResultados = styled.div`
  text-align: center; padding: 4rem 2rem; color: var(--color-texto-suave);
  p { font-size: 1.1rem; margin-top: 1rem; }
`

const PaginadorWrapper = styled.div`
  display: flex; align-items: center; justify-content: center;
  gap: 8px; margin-top: 2.5rem; flex-wrap: wrap;
`

const PageBtn = styled.button`
  width: 38px; height: 38px; border-radius: 8px; border: 1px solid;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s;
  border-color: ${(p) => (p.$active ? "var(--color-primario)" : "var(--color-borde)")};
  background: ${(p) => (p.$active ? "var(--color-primario)" : "transparent")};
  color: ${(p) => (p.$active ? "#fff" : "var(--color-texto-suave)")};
  &:hover:not(:disabled) { border-color: var(--color-primario); color: var(--color-primario); }
  &:disabled { opacity: 0.35; cursor: not-allowed; }
`

const ErrorBanner = styled.div`
  background: rgba(231,76,60,0.1); border: 1px solid rgba(231,76,60,0.3);
  border-radius: 10px; padding: 1rem 1.5rem; color: #e74c3c;
  text-align: center; margin: 2rem auto; max-width: 480px;
`

// ── Componente ────────────────────────────────────────────────────────────────
function ItemListContainer() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [busqueda, setBusqueda] = useState("")
  const [pagina, setPagina] = useState(1)

  useEffect(() => {
    const cargar = async () => {
      setCargando(true)
      setError(null)
      try {
        const snap = await getDocs(collection(db, "productos"))
        setProductos(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      } catch (err) {
        setError("No se pudieron cargar los productos. Revisá tu conexión.")
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  // Filtro en tiempo real
  const productosFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase()
    return productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q)
    )
  }, [productos, busqueda])

  // Resetear paginación cuando cambia la búsqueda
  useEffect(() => { setPagina(1) }, [busqueda])

  // Paginación
  const totalPaginas = Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA)
  const inicio = (pagina - 1) * PRODUCTOS_POR_PAGINA
  const productosPagina = productosFiltrados.slice(inicio, inicio + PRODUCTOS_POR_PAGINA)

  return (
    <>
      <Helmet>
        <title>Productos — PixelGear</title>
        <meta
          name="description"
          content="Explorá nuestro catálogo de hardware y accesorios gaming. Teclados, monitores, headsets y más."
        />
      </Helmet>
      <Container fluid="xl" style={{ padding: "2rem 1rem" }}>
        <Titulo>Nuestros <span>Productos</span></Titulo>
        <SubTitulo>
          {cargando ? "Cargando..." : `${productosFiltrados.length} productos disponibles`}
        </SubTitulo>

        {/* Barra de búsqueda */}
        <SearchWrapper>
          <SearchIcon><FiSearch /></SearchIcon>
          <SearchInput
            id="buscador-productos"
            placeholder="Buscar por nombre o categoría..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          {busqueda && (
            <ClearBtn onClick={() => setBusqueda("")} aria-label="Limpiar búsqueda">
              <FiX />
            </ClearBtn>
          )}
        </SearchWrapper>

        {/* Estados */}
        {cargando && <Spinner />}

        {error && <ErrorBanner>{error}</ErrorBanner>}

        {!cargando && !error && productosFiltrados.length === 0 && (
          <SinResultados>
            <FiSearch size={40} />
            <p>No se encontraron productos para <strong>"{busqueda}"</strong></p>
          </SinResultados>
        )}

        {/* Grid de productos */}
        {!cargando && !error && productosFiltrados.length > 0 && (
          <GridWrapper>
            <Row xs={1} sm={2} lg={3} className="g-4">
              {productosPagina.map((producto) => (
                <Col key={producto.id}>
                  <Item {...producto} />
                </Col>
              ))}
            </Row>

            {/* Paginador */}
            {totalPaginas > 1 && (
              <PaginadorWrapper>
                <PageBtn
                  onClick={() => setPagina((p) => p - 1)}
                  disabled={pagina === 1}
                  aria-label="Página anterior"
                >
                  <FiChevronLeft />
                </PageBtn>

                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
                  <PageBtn
                    key={n}
                    $active={n === pagina}
                    onClick={() => setPagina(n)}
                  >
                    {n}
                  </PageBtn>
                ))}

                <PageBtn
                  onClick={() => setPagina((p) => p + 1)}
                  disabled={pagina === totalPaginas}
                  aria-label="Página siguiente"
                >
                  <FiChevronRight />
                </PageBtn>
              </PaginadorWrapper>
            )}
          </GridWrapper>
        )}
      </Container>
    </>
  )
}

export default ItemListContainer
