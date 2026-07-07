import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Helmet } from "react-helmet-async"
import styled, { keyframes } from "styled-components"
import { FiLogIn, FiUserPlus, FiMail, FiLock, FiAlertCircle } from "react-icons/fi"

// ── Animaciones ───────────────────────────────────────────────────────────────
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`

// ── Styled Components ─────────────────────────────────────────────────────────
const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: radial-gradient(ellipse at 60% 20%, rgba(108, 99, 255, 0.12), transparent 60%);
`

const Card = styled.div`
  background: var(--color-fondo-card);
  border: 1px solid var(--color-borde);
  border-radius: 20px;
  padding: 2.5rem;
  width: 100%;
  max-width: 420px;
  animation: ${fadeIn} 0.4s ease;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
`

const Logo = styled.div`
  font-size: 1.8rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 0.5rem;
  span { color: var(--color-primario); }
`

const SubTitle = styled.p`
  text-align: center;
  color: var(--color-texto-suave);
  font-size: 0.9rem;
  margin-bottom: 2rem;
`

const Tabs = styled.div`
  display: flex;
  background: rgba(255,255,255,0.05);
  border-radius: 10px;
  padding: 4px;
  margin-bottom: 1.8rem;
`

const Tab = styled.button`
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.25s;
  background: ${(p) => (p.$active ? "var(--color-primario)" : "transparent")};
  color: ${(p) => (p.$active ? "#fff" : "var(--color-texto-suave)")};
`

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 1rem;
`

const InputIcon = styled.span`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-texto-suave);
  display: flex;
`

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.8rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-borde);
  border-radius: 10px;
  color: var(--color-texto);
  font-size: 0.95rem;
  transition: border 0.2s;
  &:focus {
    outline: none;
    border-color: var(--color-primario);
  }
  &::placeholder { color: var(--color-texto-suave); }
`

const Btn = styled.button`
  width: 100%;
  padding: 0.85rem;
  margin-top: 0.5rem;
  background: var(--color-primario);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s, transform 0.15s;
  &:hover { background: var(--color-primario-hover); transform: translateY(-1px); }
  &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`

const ErrorBox = styled.div`
  background: rgba(255, 80, 80, 0.1);
  border: 1px solid rgba(255, 80, 80, 0.3);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  color: #ff6b6b;
  font-size: 0.88rem;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 1rem;
`

// ── Componente ────────────────────────────────────────────────────────────────
function Login() {
  const [modo, setModo] = useState("login") // "login" | "registro"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [cargando, setCargando] = useState(false)

  const { login, registrar, error, setError } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError(null)
    try {
      if (modo === "login") {
        await login(email, password)
      } else {
        await registrar(email, password)
      }
      navigate("/admin")
    } catch {
      // error ya seteado en AuthContext
    } finally {
      setCargando(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Iniciar sesión — PixelGear</title>
        <meta name="description" content="Accedé al panel de administración de PixelGear." />
      </Helmet>
      <PageWrapper>
        <Card>
          <Logo>⚡ Pixel<span>Gear</span></Logo>
          <SubTitle>Panel de administración</SubTitle>

          <Tabs>
            <Tab $active={modo === "login"} onClick={() => { setModo("login"); setError(null) }}>
              Iniciar sesión
            </Tab>
            <Tab $active={modo === "registro"} onClick={() => { setModo("registro"); setError(null) }}>
              Registrarme
            </Tab>
          </Tabs>

          {error && (
            <ErrorBox>
              <FiAlertCircle /> {error}
            </ErrorBox>
          )}

          <form onSubmit={handleSubmit}>
            <InputGroup>
              <InputIcon><FiMail /></InputIcon>
              <Input
                id="login-email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputGroup>
            <InputGroup>
              <InputIcon><FiLock /></InputIcon>
              <Input
                id="login-password"
                type="password"
                placeholder="Contraseña (mín. 6 caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </InputGroup>
            <Btn type="submit" disabled={cargando}>
              {modo === "login" ? <FiLogIn /> : <FiUserPlus />}
              {cargando ? "Procesando..." : modo === "login" ? "Ingresar" : "Crear cuenta"}
            </Btn>
          </form>
        </Card>
      </PageWrapper>
    </>
  )
}

export default Login
