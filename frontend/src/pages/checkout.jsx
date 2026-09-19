import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Checkout.css";

function Checkout() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const userId = localStorage.getItem("userId");

  const isBuyNow =
    new URLSearchParams(location.search).get("buyNow") === "true";

  const [addressConfirmed, setAddressConfirmed] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    const fetchCheckoutData = async () => {
      if (isBuyNow) {
        const buyNowProduct = localStorage.getItem("buyNowProduct");

        if (buyNowProduct) {
          const product = JSON.parse(buyNowProduct);

          setCart({
            items: [
              {
                productId: product,
                quantity: 1,
              },
            ],
          });
        }

        setLoading(false);

        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/cart/${userId}`,
        );

        const data = await response.json();

        setCart(data);
      } catch (error) {
        console.log("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchCheckoutData();
    } else {
      setLoading(false);
    }
  }, [userId, isBuyNow]);

  if (loading) {
    return (
      <div className="checkout-page">
        <h1>Loading Checkout...</h1>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <h1>Your Cart is Empty</h1>

          <p>Add some products before proceeding to checkout.</p>

          <Link to="/products">
            <button className="shop-btn">Continue Shopping</button>
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.items.reduce((total, item) => {
    return total + item.productId.price * item.quantity;
  }, 0);

  const handleConfirmAddress = () => {
    if (!name || !phone || !address || !city || !state || !pincode) {
      alert("Please fill all delivery address fields");

      return;
    }

    const phonePattern = /^[0-9]{10}$/;
    const pincodePattern = /^[0-9]{6}$/;

    if (!phonePattern.test(phone)) {
      alert("Phone number must contain exactly 10 digits");

      return;
    }

    if (!pincodePattern.test(pincode)) {
      alert("Pincode must contain exactly 6 digits");

      return;
    }

    setAddressConfirmed(true);
  };

  const handleEditAddress = () => {
    setAddressConfirmed(false);
  };

  const handlePlaceOrder = async () => {
    if (!addressConfirmed) {
      alert("Please confirm your delivery address first");

      return;
    }

    const orderData = {
      userId: userId,

      deliveryAddress: {
        name: name,
        phone: phone,
        address: address,
        city: city,
        state: state,
        pincode: pincode,
      },

      items: cart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
      })),

      totalAmount: subtotal,

      paymentMethod: paymentMethod,

      isBuyNow: isBuyNow,
    };

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Order saved:", data);

        window.dispatchEvent(new Event("cartUpdated"));

        if (isBuyNow) {
          localStorage.removeItem("buyNowProduct");
        }

        navigate("/order-success");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log("Order Error:", error);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <p>ZYORA CHECKOUT</p>

          <h1>Checkout</h1>

          <span>Complete your order details</span>
        </div>

        <div className="checkout-layout">
          <div className="checkout-left">
            <div className="checkout-section">
              <div className="checkout-section-header">
                <h2>Delivery Address</h2>

                {addressConfirmed && (
                  <span className="address-status">✓ Confirmed</span>
                )}
              </div>

              <div className="address-form">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  disabled={addressConfirmed}
                  onChange={(e) => setName(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phone}
                  maxLength="10"
                  disabled={addressConfirmed}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");

                    setPhone(value);
                  }}
                />

                <input
                  type="text"
                  placeholder="Address"
                  value={address}
                  disabled={addressConfirmed}
                  onChange={(e) => setAddress(e.target.value)}
                />

                <div className="form-row">
                  <input
                    type="text"
                    placeholder="City"
                    value={city}
                    disabled={addressConfirmed}
                    onChange={(e) => setCity(e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="State"
                    value={state}
                    disabled={addressConfirmed}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>

                <input
                  type="text"
                  placeholder="Pincode"
                  value={pincode}
                  maxLength="6"
                  disabled={addressConfirmed}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");

                    setPincode(value);
                  }}
                />

                {!addressConfirmed ? (
                  <button
                    className="confirm-address-btn"
                    onClick={handleConfirmAddress}
                  >
                    Confirm Address
                  </button>
                ) : (
                  <div className="address-confirmed">
                    <span>✓ Address Confirmed</span>

                    <button
                      className="edit-address-btn"
                      onClick={handleEditAddress}
                    >
                      Edit Address
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="checkout-section">
              <h2>Payment Method</h2>

              <div className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />

                <div>
                  <strong>Cash on Delivery</strong>

                  <p>Pay when your order arrives.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="checkout-summary">
            <h2>Order Summary</h2>

            <div className="checkout-products">
              {cart.items.map((item) => (
                <div className="checkout-product" key={item.productId._id}>
                  <img
                    src={`/productimage/${item.productId.image}`}
                    alt={item.productId.productName}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `http://localhost:5000/productimage/${item.productId.image}`;
                    }}
                  />

                  <div>
                    <h3>{item.productId.productName}</h3>

                    <p>Qty: {item.quantity}</p>
                  </div>

                  <strong>
                    ₹
                    {(item.productId.price * item.quantity).toLocaleString(
                      "en-IN",
                    )}
                  </strong>
                </div>
              ))}
            </div>

            <div className="summary-row">
              <span>Subtotal</span>

              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>

            <div className="summary-row">
              <span>Delivery</span>

              <span>Free</span>
            </div>

            <hr />

            <div className="summary-total">
              <span>Total</span>

              <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
            </div>

            <button className="place-order-btn" onClick={handlePlaceOrder}>
              Place Order
            </button>

            <Link to="/cart" className="back-cart">
              ← Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
