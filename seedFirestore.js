// seedFirestore.js — Script para cargar los productos iniciales en Firestore
// Ejecutar UNA SOLA VEZ con: node seedFirestore.js
//
// Requiere que tengas configurado Firebase Admin SDK o usar el SDK del cliente.
// Esta versión usa el SDK del cliente directamente.

import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDeNmcVshnOC4gKRIFUSsj2flUZdDh19-A",
  authDomain: "pixelgear-91c9a.firebaseapp.com",
  projectId: "pixelgear-91c9a",
  storageBucket: "pixelgear-91c9a.firebasestorage.app",
  messagingSenderId: "195226515781",
  appId: "1:195226515781:web:5bb0798b95e5d7cdc9662c",
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const productos = [
  {
    nombre: "Teclado Mecánico RGB",
    precio: 45000,
    categoria: "periféricos",
    imagen: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400",
    descripcion: "Switches Cherry MX Red, retroiluminación RGB personalizable y estructura de aluminio. Respuesta táctil perfecta para gaming y programación.",
  },
  {
    nombre: "Mouse de Oficina",
    precio: 12000,
    categoria: "periféricos",
    imagen: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
    descripcion: "Sensor óptico de 16.000 DPI, 7 botones programables y diseño ergonómico. Precisión milimétrica para cada partida.",
  },
  {
    nombre: "Headset 7.1 Surround",
    precio: 32000,
    categoria: "audio",
    imagen: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
    descripcion: "Sonido envolvente 7.1, micrófono con cancelación de ruido y almohadillas de espuma viscoelástica. Escuchá cada paso del enemigo.",
  },
  {
    nombre: "Monitor 1080p 120Hz",
    precio: 210000,
    categoria: "pantallas",
    imagen: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400",
    descripcion: "Panel IPS 1080p con 120Hz de refresh rate y 2ms de tiempo de respuesta. Colores vibrantes y cero ghosting garantizado.",
  },
  {
    nombre: "Webcam 4K Streamer",
    precio: 55000,
    categoria: "streaming",
    imagen: "https://images.unsplash.com/photo-1626581795188-8efb9a00eeec?w=400",
    descripcion: "Resolución 4K a 60fps, corrección automática de luz y campo visual de 90°. Para streamers que no aceptan menos que lo mejor.",
  },
  {
    nombre: "Silla Gamer Pro",
    precio: 95000,
    categoria: "setup",
    imagen: "https://images.unsplash.com/photo-1770195483917-b3bb444b7a29?w=400",
    descripcion: "Soporte lumbar ajustable, reposabrazos 4D y reclinación de hasta 180°. Horas de gaming sin dolor de espalda.",
  },
]

async function seed() {
  console.log("🚀 Cargando productos en Firestore...")
  try {
    for (const producto of productos) {
      const docRef = await addDoc(collection(db, "productos"), producto)
      console.log(`✅ ${producto.nombre} — ID: ${docRef.id}`)
    }
    console.log("\n🎉 ¡Todos los productos cargados exitosamente!")
    process.exit(0)
  } catch (error) {
    console.error("❌ Error:", error.message)
    process.exit(1)
  }
}

seed()
