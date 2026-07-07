import { Link } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import styled, { keyframes } from "styled-components"
import { FiArrowRight, FiShoppingBag, FiStar } from "react-icons/fi"

const float = keyframes`0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); }`
const fadeIn = keyframes`from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); }`

const Hero = styled.section`
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 1.5rem;
  position: relative;
  overflow: hidden;
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 0%, rgba(108, 99, 255, 0.18), transparent 65%);
    pointer-events: none;
  }
`

const HeroContent = styled.div`
  animation: ${fadeIn} 0.6s ease;
  position: relative; z-index: 1;
`

const Badge = styled.div`
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(108, 99, 255, 0.15);
  border: 1px solid rgba(108, 99, 255, 0.3);
  color: var(--color-primario); padding: 0.4rem 1rem;
  border-radius: 50px; font-size: 0.82rem; font-weight: 700;
  margin-bottom: 1.5rem;
`

const H1 = styled.h1`
  font-size: clamp(2.2rem, 6vw, 4rem);
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 1.2rem;
  span { color: var(--color-primario); }
`

const Sub = styled.p`
  font-size: 1.1rem;
  color: var(--color-texto-suave);
  max-width: 500px;
  margin: 0 auto 2.5rem;
  line-height: 1.7;
`

const BtnGroup = styled.div`
  display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;
`

const BtnPrimary = styled(Link)`
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--color-primario); color: #fff !important;
  padding: 0.9rem 1.8rem; border-radius: 12px; font-weight: 700;
  font-size: 1rem; transition: all 0.2s;
  &:hover { background: var(--color-primario-hover); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(108,99,255,0.4); }
`

const BtnSecondary = styled(Link)`
  display: inline-flex; align-items: center; gap: 8px;
  border: 1px solid var(--color-borde); color: var(--color-texto) !important;
  padding: 0.9rem 1.8rem; border-radius: 12px; font-weight: 600;
  font-size: 1rem; transition: all 0.2s;
  &:hover { border-color: var(--color-primario); color: var(--color-primario) !important; }
`

const Features = styled.div`
  display: flex; gap: 1.2rem; justify-content: center; flex-wrap: wrap;
  padding: 3rem 1.5rem; max-width: 900px; margin: 0 auto;
`

const FeatureCard = styled.div`
  background: var(--color-fondo-card);
  border: 1px solid var(--color-borde);
  border-radius: 16px; padding: 1.8rem 2rem; flex: 1; min-width: 200px;
  text-align: center; transition: transform 0.25s;
  &:hover { transform: translateY(-4px); }
`

const FeatureIcon = styled.div`
  font-size: 2.2rem;
  margin-bottom: 0.8rem;
  animation: ${float} 3s ease-in-out infinite;
`

const FeatureTitle = styled.h3`font-weight: 700; margin-bottom: 0.4rem;`
const FeatureDesc = styled.p`font-size: 0.88rem; color: var(--color-texto-suave);`

const features = [
  { icon: "⚡", title: "Envíos rápidos", desc: "Recibí tu pedido en 24-48hs" },
  { icon: "🛡️", title: "Garantía oficial", desc: "Todos nuestros productos tienen garantía" },
  { icon: "💳", title: "Hasta 12 cuotas", desc: "Sin interés con tarjetas seleccionadas" },
]

function Home() {
  return (
    <>
      <Helmet>
        <title>PixelGear — Tu tienda gaming de confianza</title>
        <meta
          name="description"
          content="PixelGear: hardware, periféricos y accesorios gaming. Teclados mecánicos, monitores, headsets y más al mejor precio."
        />
      </Helmet>

      <Hero>
        <HeroContent>
          <Badge><FiStar size={12} /> Tienda gaming #1</Badge>
          <H1>
            Equipate para<br /><span>ganar en serio</span>
          </H1>
          <Sub>
            Hardware, periféricos y accesorios gaming de alta gama.
            Encontrá todo lo que necesitás para tu setup perfecto.
          </Sub>
          <BtnGroup>
            <BtnPrimary to="/productos" id="hero-btn-productos">
              <FiShoppingBag /> Ver productos <FiArrowRight />
            </BtnPrimary>
            <BtnSecondary to="/login" id="hero-btn-login">
              <FiStar /> Panel admin
            </BtnSecondary>
          </BtnGroup>
        </HeroContent>
      </Hero>

      <Features>
        {features.map((f) => (
          <FeatureCard key={f.title}>
            <FeatureIcon>{f.icon}</FeatureIcon>
            <FeatureTitle>{f.title}</FeatureTitle>
            <FeatureDesc>{f.desc}</FeatureDesc>
          </FeatureCard>
        ))}
      </Features>
    </>
  )
}

export default Home
