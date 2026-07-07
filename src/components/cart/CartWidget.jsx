import { useCart } from "../../context/CartContext"
import "./CartWidget.css"

function CartWidget() {
  const { totalItems } = useCart()

  return (
    <div className="cart-widget">
      <span className="cart-icon">🛒</span>
      {totalItems > 0 && (
        <span className="cart-badge">{totalItems}</span>
      )}
    </div>
  )
}

export default CartWidget
