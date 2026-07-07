import { createContext, useState, useContext } from "react"

export const CartContext = createContext()

function CartProvider({ children }) {
  const [carrito, setCarrito] = useState([])

  // Agrega producto o incrementa cantidad si ya existe
  const addToCart = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id)
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      }
      return [...prev, { ...producto, cantidad: 1 }]
    })
  }

  // Decrementa cantidad, elimina si llega a 0
  const removeFromCart = (id) => {
    setCarrito((prev) => {
      const item = prev.find((i) => i.id === id)
      if (item && item.cantidad > 1) {
        return prev.map((i) =>
          i.id === id ? { ...i, cantidad: i.cantidad - 1 } : i
        )
      }
      return prev.filter((i) => i.id !== id)
    })
  }

  // Elimina el producto sin importar la cantidad
  const deleteFromCart = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id))
  }

  // Vacía el carrito completo
  const clearCart = () => setCarrito([])

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0)

  const totalPrecio = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  )

  return (
    <CartContext.Provider
      value={{
        carrito,
        addToCart,
        removeFromCart,
        deleteFromCart,
        clearCart,
        totalItems,
        totalPrecio,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}

export default CartProvider
