import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(
`https://zyora-backend-rhv6.onrender.com/api/cart/${userId}`,
        );

        const data = await response.json();

        console.log("Cart Data:", data);

        setCart(data);
      } catch (error) {
        console.log("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const increaseQuantity = async (productId) => {
    try {
      const response = await fetch(
`https://zyora-backend-rhv6.onrender.com/api/cart/${userId}/increase`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: productId,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setCart(data);
        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log("Error increasing quantity:", error);
    }
  };

  const decreaseQuantity = async (productId) => {
    try {
      const response = await fetch(
`https://zyora-backend-rhv6.onrender.com/api/cart/${userId}/decrease`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: productId,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setCart(data);
        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log("Error decreasing quantity:", error);
    }
  };

  const removeProduct = async (productId) => {
    try {
      const response = await fetch(
`https://zyora-backend-rhv6.onrender.com/api/cart/${userId}/remove`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: productId,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setCart(data);
        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log("Error removing product:", error);
    }
  };

  if (loading) {
    return (
      <div className="cart-page">
        <div className="cart-content">
          <h1>Loading Cart...</h1>
        </div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-content">
          <div className="empty-cart-icon">🛒</div>

          <p className="cart-label">YOUR SHOPPING BAG</p>

          <h1>Your Cart is Empty</h1>

          <p className="empty-text">
            Looks like you haven't added anything to your cart yet.
            <br />
            Explore our products and find something you love.
          </p>

          <a href="/products">
            <button className="shop-btn">Start Shopping</button>
          </a>
        </div>
      </div>
    );
  }

  const subtotal = cart.items.reduce((total, item) => {
    return total + item.productId.price * item.quantity;
  }, 0);

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <p className="cart-label">YOUR SHOPPING BAG</p>

          <h1>Your Cart</h1>

          <p>Review your selected products before checkout.</p>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {cart.items.map((item) => (
              <div className="cart-item" key={item.productId._id}>
                <Link
                  to={`/products/${item.productId._id}`}
                  className="cart-product-link"
                >
                  <img 
    src={`/productimage/${item.productId.image}`}
    alt={item.productId.productName}
    className="cart-item-image"
    onError={(e) => {
        e.target.onerror = null;
e.target.src = `https://zyora-backend-rhv6.onrender.com/productimage/${item.productId.image}`;
    }}
/>

                  <div className="cart-item-details">
                    <div className="cart-item-brand">
                      {item.productId.brand}
                    </div>

                    <div className="cart-item-name">
                      {item.productId.productName}
                    </div>

                    <div className="cart-item-price">
                      ₹{item.productId.price}
                    </div>
                  </div>
                </Link>

                <div className="quantity-control">
                  <button
                    className="quantity-btn"
                    onClick={() => decreaseQuantity(item.productId._id)}
                  >
                    −
                  </button>

                  <span className="quantity">{item.quantity}</span>

                  <button
                    className="quantity-btn"
                    onClick={() => increaseQuantity(item.productId._id)}
                  >
                    +
                  </button>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeProduct(item.productId._id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="order-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>

              <span>₹{subtotal}</span>
            </div>

            <div className="summary-row">
              <span>Delivery</span>

              <span>Free</span>
            </div>

            <hr className="summary-divider" />

            <div className="summary-total">
              <span>Total</span>

              <span>₹{subtotal}</span>
            </div>

            <Link to="/checkout">
              <button className="checkout-btn">Proceed to Checkout</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
