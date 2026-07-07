# PixelGear

Tienda online de hardware y accesorios gaming hecha con React y Firebase.

Demo: [pixelgear5.netlify.app](https://pixelgear5.netlify.app)

---

## Credenciales de prueba

Para probar el panel de administración:

| Campo      | Valor                  |
| ---------- | ---------------------- |
| Email      | `pixeladmin@gmail.com` |
| Contraseña | `MainProyect`          |

Entrando con esas credenciales en `/login` se puede acceder al panel admin donde se pueden agregar, editar y eliminar productos.

---

## Tecnologías

- React + Vite
- React Router DOM
- Firebase Authentication
- Firestore (base de datos)
- Context API (carrito y autenticación)
- styled-components
- React Bootstrap
- React Icons
- React Helmet Async

---

## Estructura del proyecto

```
src/
├── components/
│   ├── item/
│   │   ├── Item.jsx
│   │   └── ItemListContainer.jsx
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── NavBar.jsx
│   │   ├── Footer.jsx
│   │   └── Layout.jsx
│   └── RutaProtegida.jsx
├── context/
│   ├── CartContext.jsx
│   └── AuthContext.jsx
├── firebase/
│   └── config.js
├── pages/
│   ├── Home.jsx
│   ├── ProductoDetalle.jsx
│   ├── CarritoPage.jsx
│   ├── Login.jsx
│   └── AdminPanel.jsx
├── App.jsx
├── main.jsx
└── index.css
```

---

## Instalación

```bash
git clone https://github.com/ManuelRequeijo/PixelGear.git
cd PixelGear
npm install
npm run dev
```

### Configurar Firebase

1. Crear un proyecto en [console.firebase.google.com](https://console.firebase.google.com)
2. Habilitar Authentication con email/contraseña
3. Crear una base de datos Firestore en modo producción
4. Copiar el `firebaseConfig` y pegarlo en `src/firebase/config.js`:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
};
```

### Reglas de Firestore

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /productos/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## Rutas

| Ruta            | Descripción                         | Acceso              |
| --------------- | ----------------------------------- | ------------------- |
| `/`             | Página principal                    | Público             |
| `/productos`    | Catálogo con búsqueda y paginación  | Público             |
| `/producto/:id` | Detalle de un producto              | Público             |
| `/carrito`      | Carrito de compras                  | Público             |
| `/login`        | Login y registro                    | Público             |
| `/admin`        | Panel de administración             | Solo autenticados   |

---

## Funcionalidades implementadas

- Carrito con manejo de cantidades (agregar, quitar, vaciar)
- Login y registro con Firebase Auth
- Rutas protegidas con redirección al login
- CRUD de productos conectado a Firestore con modal de confirmación para eliminar
- Búsqueda en tiempo real por nombre y categoría
- Paginación de productos
- Diseño responsivo con React Bootstrap y styled-components
- SEO básico con React Helmet (title y meta description por página)

---

## Deploy

Está deployado en Netlify. El archivo `public/_redirects` tiene:

```
/*    /index.html   200
```

Eso es para que las rutas funcionen correctamente al recargar la página.
