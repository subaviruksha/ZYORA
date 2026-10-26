
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CancelledOrders.css";

function CancelledOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("role") !== "admin") {
      navigate("/login");
      return;
    }

    const fetchCancelledOrders = async () => {
      try {
        const response = await fetch(
          "https://zyora-backend-rhv6.onrender.com/api/orders/admin/cancelled"
        );

        if (!response.ok) {
          throw new Error("Unable to fetch cancelled orders");
        }

        const data = await response.json();

        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log("Cancelled Orders Error:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCancelledOrders();
  }, [navigate]);

  const totalAmount = orders.reduce(
    (total, order) => total + Number(order.totalAmount || 0),
    0
  );

  return (
    <div className="cancelled-orders-page">
      <header className="cancelled-orders-header">
        <div>
          <p className="cancelled-orders-brand">ZYORA</p>
          <h1>Cancelled Orders</h1>
          <p>View all orders cancelled by customers.</p>
        </div>

        <button
          className="cancelled-back-button"
          onClick={() => navigate("/admin")}
        >
          ← Admin Dashboard
        </button>
      </header>

      <div className="cancelled-orders-container">
        <div className="cancelled-summary-grid">
          <div className="cancelled-summary-card">
            <span>Total Cancelled Orders</span>
            <strong>{loading ? "..." : error ? "—" : orders.length}</strong>
          </div>

          <div className="cancelled-summary-card">
            <span>Total Cancelled Order Value</span>
            <strong>
              {loading || error
                ? "—"
                : `₹${totalAmount.toLocaleString("en-IN")}`}
            </strong>
          </div>
        </div>

        <section className="cancelled-orders-section">
          <h2>Cancelled Orders List</h2>

          {loading ? (
            <p>Loading cancelled orders...</p>
          ) : error ? (
            <p>Unable to load cancelled orders. Please try again later.</p>
          ) : orders.length === 0 ? (
            <div className="cancelled-empty">
              <h3>No Cancelled Orders</h3>
              <p>Cancelled orders will appear here.</p>
            </div>
          ) : (
            <div className="cancelled-table-wrapper">
              <table className="cancelled-orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        #{String(order._id).slice(-6).toUpperCase()}
                      </td>

                      <td>
                        {order.userId?.name ||
                          order.deliveryAddress?.name ||
                          "N/A"}
                      </td>

                      <td>
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString(
                              "en-IN"
                            )
                          : "—"}
                      </td>

                      <td>
                        ₹
                        {Number(order.totalAmount || 0).toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      <td>
                        <span className="cancelled-status-badge">
                          Cancelled
                        </span>
                      </td>

                      <td>
                        <button
                          className="cancelled-view-button"
                          onClick={() =>
                            navigate(`/admin/cancelled-orders/${order._id}`)
                          }
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default CancelledOrders;
