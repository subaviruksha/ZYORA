import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    pendingOrders: 0,
  });

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "admin") {
      navigate("/login");
      return;
    }

    const fetchDashboard = async () => {
      try {
        const response = await fetch(
          "https://zyora-backend-rhv6.onrender.com/api/admin/dashboard",
        );

        const data = await response.json();

        if (response.ok) {
          setStats(data);
        }
      } catch (error) {
        console.log("Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchOrders = async () => {
      try {
     const response = await fetch(
    "https://zyora-backend-rhv6.onrender.com/api/orders/admin/all"
);

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();

        const orderList = Array.isArray(data)
          ? data
          : Array.isArray(data.orders)
            ? data.orders
            : [];

        setOrders(orderList);
      } catch (error) {
        console.log("Orders Error:", error);
        setOrdersError(true);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchDashboard();
    fetchOrders();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    sessionStorage.setItem("logoutMessage", "✓ Logout successful");

    window.location.href = "/login";
  };

  const handleAccount = () => {
    navigate("/admin/account");
  };

  const recentOrders = [...orders]
    .sort((a, b) => {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    })
    .slice(0, 5);

  const getStatusCount = (status) => {
    return orders.filter((order) => {
      return (
String(order.orderStatus || "")
          .trim()
          .toLowerCase() === status.toLowerCase()
      );
    }).length;
  };

  if (loading) {
    return <div className="admin-loading">Loading Admin Dashboard...</div>;
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <p className="admin-brand">ZYORA</p>

          <h1>Admin Dashboard</h1>

          <p>Manage your store from one place.</p>
        </div>

        <div className="admin-header-actions">
          <button className="admin-account-button" onClick={handleAccount}>
            <span className="account-icon">👤</span>

            <span>Account</span>
          </button>

          <button className="admin-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="admin-container">
        <div className="admin-stats">
          <div className="admin-stat-card">
            <span>Products</span>

            <strong>{stats.totalProducts}</strong>
          </div>

          <div className="admin-stat-card">
            <span>Orders</span>

            <strong>{stats.totalOrders}</strong>
          </div>

          <div className="admin-stat-card">
            <span>Users</span>

            <strong>{stats.totalUsers}</strong>
          </div>

          <div className="admin-stat-card">
            <span>Pending Orders</span>

            <strong>{stats.pendingOrders}</strong>
          </div>
        </div>

        <div className="admin-section">
          <h2>Quick Management</h2>

          <div className="admin-actions">
            <button onClick={() => navigate("/admin/products")}>
              <div className="admin-action-top">
                <strong>Manage Products</strong>

                <span className="admin-action-arrow">→</span>
              </div>

              <span>Add, edit and delete products</span>
            </button>

            <button onClick={() => navigate("/admin/orders")}>
              <div className="admin-action-top">
                <strong>Manage Orders</strong>

                <span className="admin-action-arrow">→</span>
              </div>

              <span>View and update customer orders</span>
            </button>

            <button onClick={() => navigate("/admin/users")}>
              <div className="admin-action-top">
                <strong>Manage Users</strong>

                <span className="admin-action-arrow">→</span>
              </div>

              <span>View registered customers</span>
            </button>
          </div>
        </div>

        <div className="admin-section">
          <div className="admin-recent-header">
            <h2>Recent Orders</h2>

            <button
              className="admin-view-all"
              onClick={() => navigate("/admin/orders")}
            >
              View All →
            </button>
          </div>

          {ordersLoading ? (
            <p>Loading recent orders...</p>
          ) : ordersError ? (
            <p>Unable to load recent orders.</p>
          ) : recentOrders.length === 0 ? (
            <p>No orders available yet.</p>
          ) : (
            <div className="admin-recent-table-wrapper">
              <table className="admin-recent-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td>#{String(order._id).slice(-6).toUpperCase()}</td>

                      <td>
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString(
                              "en-IN",
                            )
                          : "—"}
                      </td>

                      <td>
                        ₹
                        {Number(order.totalAmount || 0).toLocaleString("en-IN")}
                      </td>

                      <td>
                        <span className={`admin-order-status ${String(order.orderStatus || "Pending").toLowerCase()}`}>
    {order.orderStatus || "Pending"}
</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="admin-section">
          <h2>Order Status Overview</h2>

          {ordersLoading ? (
            <p>Loading order statuses...</p>
          ) : ordersError ? (
            <p>Unable to load order statuses.</p>
          ) : (
            <div className="admin-status-grid">
              <div className="admin-status-card">
                <span>Pending</span>

                <strong>{getStatusCount("pending")}</strong>
              </div>

              <div className="admin-status-card">
                <span>Shipped</span>

                <strong>{getStatusCount("shipped")}</strong>
              </div>

              <div className="admin-status-card">
                <span>Delivered</span>

                <strong>{getStatusCount("delivered")}</strong>
              </div>

              <div className="admin-status-card">
                <span>Cancelled</span>

                <strong>{getStatusCount("cancelled")}</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
