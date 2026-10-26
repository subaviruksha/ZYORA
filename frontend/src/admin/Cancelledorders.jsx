
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminOrders.css";
import "./CancelledOrders.css";

const BACKEND_URL = "https://zyora-backend-rhv6.onrender.com";

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
                    `${BACKEND_URL}/api/orders/admin/cancelled`
                );

                if (!response.ok) {
                    throw new Error("Unable to fetch cancelled orders");
                }

                const data = await response.json();
                setOrders(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Cancelled Orders Error:", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchCancelledOrders();
    }, [navigate]);

    const getProductName = (item) => {
        return item.productId?.productName || "Product";
    };

    const getProductImage = (item) => {
        const image = item.productId?.image;

        if (!image || typeof image !== "string" || !image.trim()) {
            return "";
        }

        const trimmedImage = image.trim();

        if (/^https?:\/\//i.test(trimmedImage)) {
            return trimmedImage;
        }

        const imagePath = trimmedImage.replace(/^\/+/, "");
        const encodedPath = imagePath
            .split("/")
            .map(encodeURIComponent)
            .join("/");

        if (imagePath.startsWith("productimage/")) {
            return `${BACKEND_URL}/${encodedPath}`;
        }

        return `${BACKEND_URL}/productimage/${encodedPath}`;
    };

    const handleImageError = (event) => {
        event.currentTarget.style.display = "none";

        const fallback = event.currentTarget.nextElementSibling;

        if (fallback) {
            fallback.style.display = "flex";
        }
    };

    const totalAmount = orders.reduce(
        (total, order) => total + Number(order.totalAmount || 0),
        0
    );

    if (loading) {
        return <div className="admin-loading">Loading Cancelled Orders...</div>;
    }

    return (
        <div className="admin-orders-page cancelled-orders-page">
            <header className="admin-orders-header">
                <div>
                    <button
                        className="admin-back-button"
                        onClick={() => navigate("/admin")}
                    >
                        ← Back to Dashboard
                    </button>

                    <p className="admin-brand">ZYORA</p>
                    <h1>Cancelled Orders</h1>
                    <p>View complete details of orders cancelled by customers.</p>
                </div>
            </header>

            <div className="admin-orders-container">
                {error ? (
                    <div className="no-orders">
                        <h2>Unable to load cancelled orders</h2>
                        <p>Please try again later.</p>
                    </div>
                ) : (
                    <>
                        <div className="cancelled-summary-grid">
                            <div className="orders-count-card">
                                <div>
                                    <span>Total Cancelled Orders</span>
                                    <strong>{orders.length}</strong>
                                </div>
                            </div>

                            <div className="orders-count-card">
                                <div>
                                    <span>Total Cancelled Order Value</span>
                                    <strong>
                                        ₹{totalAmount.toLocaleString("en-IN")}
                                    </strong>
                                </div>
                            </div>
                        </div>

                        {orders.length === 0 ? (
                            <div className="no-orders">
                                <h2>No Cancelled Orders</h2>
                                <p>Cancelled orders will appear here.</p>
                            </div>
                        ) : (
                            <div className="admin-orders-list">
                                {orders.map((order) => (
                                    <div
                                        className="admin-order-card"
                                        key={order._id}
                                    >
                                        <div className="admin-order-top">
                                            <div>
                                                <span className="order-label">
                                                    ORDER ID
                                                </span>
                                                <h2>
                                                    #{String(order._id).slice(-8)}
                                                </h2>
                                            </div>

                                            <div className="order-status-area">
                                                <label>Order Status</label>
                                                <span className="cancelled-order-status">
                                                    Cancelled
                                                </span>
                                            </div>
                                        </div>

                                        <div className="admin-order-date">
                                            Ordered on{" "}
                                            {order.createdAt
                                                ? new Date(
                                                      order.createdAt
                                                  ).toLocaleDateString("en-IN", {
                                                      day: "numeric",
                                                      month: "long",
                                                      year: "numeric",
                                                  })
                                                : "—"}
                                        </div>

                                        <div className="admin-order-details">
                                            <div className="admin-customer">
                                                <h3>Customer</h3>
                                                <p>
                                                    <strong>Name:</strong>{" "}
                                                    {order.userId?.name ||
                                                        order.deliveryAddress?.name ||
                                                        "N/A"}
                                                </p>
                                                <p>
                                                    <strong>Email:</strong>{" "}
                                                    {order.userId?.email || "N/A"}
                                                </p>
                                                <p>
                                                    <strong>Phone:</strong>{" "}
                                                    {order.userId?.phone ||
                                                        order.deliveryAddress?.phone ||
                                                        "N/A"}
                                                </p>
                                            </div>

                                            <div className="admin-delivery">
                                                <h3>Delivery Address</h3>
                                                <p>
                                                    {order.deliveryAddress?.address ||
                                                        "N/A"}
                                                </p>
                                                <p>
                                                    {order.deliveryAddress?.city || ""}
                                                    {order.deliveryAddress?.city &&
                                                    order.deliveryAddress?.state
                                                        ? ", "
                                                        : ""}
                                                    {order.deliveryAddress?.state || ""}
                                                </p>
                                                <p>
                                                    Pincode:{" "}
                                                    {order.deliveryAddress?.pincode ||
                                                        "N/A"}
                                                </p>
                                            </div>

                                            <div className="admin-payment">
                                                <h3>Payment</h3>
                                                <p>
                                                    <strong>Method:</strong>{" "}
                                                    {order.paymentMethod === "cod"
                                                        ? "Cash on Delivery"
                                                        : order.paymentMethod || "N/A"}
                                                </p>
                                                <p>
                                                    <strong>Status:</strong>{" "}
                                                    {order.paymentStatus || "N/A"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="admin-products-section">
                                            <h3>Products</h3>

                                            <div className="admin-order-products">
                                                {(order.items || []).map(
                                                    (item, index) => {
                                                        const imageUrl =
                                                            getProductImage(item);

                                                        return (
                                                            <div
                                                                className="admin-order-product"
                                                                key={item._id || index}
                                                            >
                                                                {imageUrl ? (
                                                                    <>
                                                                        <img
                                                                            src={imageUrl}
                                                                            alt={getProductName(item)}
                                                                            onError={handleImageError}
                                                                        />
                                                                        <div
                                                                            className="admin-product-image-placeholder"
                                                                            style={{
                                                                                display: "none",
                                                                            }}
                                                                        >
                                                                            Image unavailable
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <div className="admin-product-image-placeholder">
                                                                        No image available
                                                                    </div>
                                                                )}

                                                                <div className="admin-product-info">
                                                                    <strong>
                                                                        {getProductName(item)}
                                                                    </strong>
                                                                    <span>
                                                                        Quantity:{" "}
                                                                        {item.quantity}
                                                                    </span>
                                                                </div>

                                                                <div className="admin-product-price">
                                                                    ₹
                                                                    {(
                                                                        Number(item.price || 0) *
                                                                        Number(item.quantity || 0)
                                                                    ).toLocaleString("en-IN")}
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </div>

                                        <div className="admin-order-total">
                                            <span>Total Amount</span>
                                            <strong>
                                                ₹
                                                {Number(
                                                    order.totalAmount || 0
                                                ).toLocaleString("en-IN")}
                                            </strong>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default CancelledOrders;
