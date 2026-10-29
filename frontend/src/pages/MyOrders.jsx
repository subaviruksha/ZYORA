
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `https://zyora-backend-rhv6.onrender.com/api/orders/${userId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const formatPrice = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <h1>Loading Orders...</h1>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="empty-orders">
          <div className="empty-orders-icon">📦</div>

          <p className="orders-label">YOUR ORDERS</p>

          <h1>No Orders Yet</h1>

          <p>
            You haven't placed any orders yet. Start shopping and your orders
            will appear here.
          </p>

          <Link to="/products">
            <button className="shop-orders-btn">Start Shopping</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <div className="orders-header">
          <p className="orders-label">ZYORA</p>

          <h1>My Orders</h1>

          <p>View and manage your recent orders.</p>
        </div>

        <div className="orders-list">
          {orders.map((order) => {
            const discount = Number(order.discount || 0);

            const totalAmount = Number(order.totalAmount || 0);

            const originalAmount =
              order.originalAmount != null
                ? Number(order.originalAmount)
                : totalAmount + discount;

            return (
              <div className="order-card" key={order._id}>
                <div className="order-top">
                  <div>
                    <span>ORDER ID</span>

                    <strong>#{order._id.slice(-8)}</strong>
                  </div>

                  <div
                    className={`order-status ${
                      order.orderStatus === "Cancelled"
                        ? "cancelled-status"
                        : ""
                    }`}
                  >
                    {order.orderStatus}
                  </div>
                </div>

                <div className="order-date">
                  Ordered on{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-IN")}
                </div>

                {discount > 0 && (
                  <div className="first-order-offer">
                    <div>🎉 First Order Discount Applied!</div>

                    <p>
                      You received a 10% discount on your first order.
                      You saved ₹{formatPrice(discount)}!
                    </p>
                  </div>
                )}

                <div className="order-products">
                  {order.items.map((item) => (
                    <div className="order-product" key={item._id}>
                      <img
                        src={
                          item.productId?.image?.startsWith("http")
                            ? item.productId.image
                            : `https://zyora-backend-rhv6.onrender.com/productimage/${item.productId?.image || ""}`
                        }
                        alt={
                          item.productId?.productName || "Product"
                        }
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://zyora-backend-rhv6.onrender.com/productimage/${item.productId?.image || ""}`;
                        }}
                      />

                      <div className="order-product-info">
                        <h3>
                          {item.productId?.productName ||
                            "Product unavailable"}
                        </h3>

                        <p>Qty: {item.quantity}</p>

                        <p>₹{formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-bottom">
                  <div>
                    <span>Payment</span>

                    <strong>
                      {order.paymentMethod === "cod"
                        ? "Cash on Delivery"
                        : "UPI / Card"}
                    </strong>
                  </div>

                  <div className="view-order-details">
                    <Link to={`/orders/${order._id}`}>
                      View Order Details →
                    </Link>
                  </div>

                  <div className="order-total">
                    {discount > 0 && (
                      <>
                        <div className="order-price-row">
                          <span>Original Amount</span>

                          <strong>₹{formatPrice(originalAmount)}</strong>
                        </div>

                        <div className="order-price-row first-order-discount">
                          <span>First-order discount (10%)</span>

                          <strong>−₹{formatPrice(discount)}</strong>
                        </div>
                      </>
                    )}

                    <span>Total</span>

                    <strong>₹{formatPrice(totalAmount)}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
