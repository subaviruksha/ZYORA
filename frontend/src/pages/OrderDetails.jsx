import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./OrderDetails.css";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/orders/single/${id}`,
        );

        const data = await response.json();

        if (response.ok) {
          setOrder(data);
        }
      } catch (error) {
        console.log("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="order-details-page">
        <div className="order-details-container">
          <h1>Loading Order...</h1>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-details-page">
        <div className="order-not-found">
          <h1>Order Not Found</h1>

          <p>We couldn't find this order.</p>

          <Link to="/orders">
            <button>Back to My Orders</button>
          </Link>
        </div>
      </div>
    );
  }

  const trackingSteps = ["Pending", "Processing", "Shipped", "Delivered"];

  const currentStep = trackingSteps.indexOf(order.orderStatus);

  return (
    <div className="order-details-page">
      <div className="order-details-container">
        <div className="order-details-header">
          <Link to="/orders" className="back-orders">
            ← Back to My Orders
          </Link>

          <p className="order-details-label">ZYORA</p>

          <h1>Order Details</h1>

          <p>View complete information about your order.</p>
        </div>

        <div className="order-info-card">
          <div className="order-info-top">
            <div>
              <span>ORDER ID</span>

              <strong>#{order._id.slice(-8)}</strong>
            </div>

            <div className="details-status">{order.orderStatus}</div>
          </div>

          <div className="details-date">
            Ordered on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>

        <div className="details-section order-tracking-section">
          <h2>Order Tracking</h2>

          <div className="order-tracking">
            {trackingSteps.map((step, index) => (
              <div className="tracking-item" key={step}>
                <div className="tracking-step">
                  <span className={index <= currentStep ? "active" : ""}>
                    {index <= currentStep ? "✓" : ""}
                  </span>

                  <p className={index <= currentStep ? "active-text" : ""}>
                    {step}
                  </p>
                </div>

                {index < trackingSteps.length - 1 && (
                  <div
                    className={
                      index < currentStep
                        ? "tracking-line active"
                        : "tracking-line"
                    }
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="details-section">
          <h2>Products</h2>

          <div className="details-products">
            {order.items.map((item) => (
              <div className="details-product" key={item._id}>
                <img
                  src={`/productimage/${item.productId.image}`}
                  alt={item.productId.productName}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `http://localhost:5000/productimage/${item.productId.image}`;
                  }}
                />

                <div className="details-product-info">
                  <h3>{item.productId.productName}</h3>

                  <p>Brand: {item.productId.brand}</p>

                  <p>Quantity: {item.quantity}</p>
                </div>

                <div className="details-product-price">
                  ₹{item.price.toLocaleString("en-IN")}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="details-two-column">
          <div className="details-section">
            <h2>Delivery Address</h2>

            <div className="address-box">
              <strong>{order.deliveryAddress.name}</strong>

              <p>{order.deliveryAddress.phone}</p>

              <p>{order.deliveryAddress.address}</p>

              <p>
                {order.deliveryAddress.city}, {order.deliveryAddress.state}
              </p>

              <p>Pincode: {order.deliveryAddress.pincode}</p>
            </div>
          </div>

          <div className="details-section">
            <h2>Payment Information</h2>

            <div className="payment-box">
              <div className="payment-row">
                <span>Method</span>

                <strong>
                  {order.paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : "UPI / Card"}
                </strong>
              </div>

              <div className="payment-row">
                <span>Payment Status</span>

                <strong>{order.paymentStatus}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="details-summary">
          <div className="summary-line">
            <span>Subtotal</span>

            <span>₹{order.totalAmount.toLocaleString("en-IN")}</span>
          </div>

          <div className="summary-line">
            <span>Delivery</span>

            <span>Free</span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-total-line">
            <strong>Total Amount</strong>

            <strong>₹{order.totalAmount.toLocaleString("en-IN")}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
