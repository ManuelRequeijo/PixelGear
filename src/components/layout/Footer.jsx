// Footer.jsx — El pie de página.
//
// El requerimiento pide:
//   ✅ Información de la empresa
//   ✅ Tarjetas de al menos 3 personas
//
// Usamos un array "equipo" con los datos de cada persona.
// Después lo recorremos con .map() para generar las tarjetas automáticamente.
// Así si queremos agregar una persona, solo agregamos un objeto al array.

import "./Footer.css"

// Datos del equipo — un array de objetos
// Cada objeto tiene los datos de una persona
const equipo = [
  {
    id: 1,
    imagen: "https://i.pravatar.cc/80?img=11",
    nombre: "Carlos García",
    rol: "Frontend Developer"
  },
  {
    id: 2,
    imagen: "https://i.pravatar.cc/80?img=47",
    nombre: "Lucía Martínez",
    rol: "UI/UX Designer"
  },
  {
    id: 3,
    imagen: "https://i.pravatar.cc/80?img=33",
    nombre: "Martín López",
    rol: "Product Manager"
  }
]

function Footer() {
  return (
    <footer>
      <div className="footer-contenido">

        {/* Sección: info de la empresa */}
        <div className="footer-empresa">
          <h3>⚡ PixelGear</h3>
          <p>Tu tienda de hardware, periféricos y accesorios gaming. Equipate para ganar.</p>
        </div>

        {/* Sección: el equipo */}
        <p className="footer-equipo-titulo">Nuestro equipo</p>
        <div className="footer-equipo">
          {/* .map() recorre el array y devuelve un componente por cada elemento */}
          {equipo.map((persona) => (
            // "key" es obligatorio cuando usamos .map() en React
            // Le dice a React cuál es cuál para actualizarlos eficientemente
            <div key={persona.id} className="footer-card">
              <img className="avatar" src={persona.imagen} alt={persona.nombre} />
              <h4>{persona.nombre}</h4>
              <p>{persona.rol}</p>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <p className="footer-copy">© 2025 PixelGear — Todos los derechos reservados</p>
      </div>
    </footer>
  )
}

export default Footer
