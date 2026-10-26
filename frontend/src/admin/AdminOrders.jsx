
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminOrders.css";

const BACKEND_URL = "https://zyora-backend-rhv6.onrender.com";

function AdminOrders() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const role = localStorage.getItem("role");

        if (role !== "admin") {
            navigate("/login");
            return;
        }

        fetchOrders();
    }, [navigate]);

    const fetchOrders = async () => {
        try {
            const response = await fetch(
                `${BACKEND_URL}/api/orders/admin/all`
            );

            const data = await response.json();

            if (response.ok) {
                setOrders(Array.isArray(data) ? data : []);
            } else {
                alert(data.message || "Error fetching orders");
            }
        } catch (error) {
            console.error("Admin Orders Error:", error);
            alert("Unable to load orders");
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, orderStatus) => {
        try {
            const response = await fetch(
                `${BACKEND_URL}/api/orders/admin/${orderId}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ orderStatus }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                setOrders((previousOrders) =>
                    previousOrders.map((order) =>
                        order._id === orderId
                            ? { ...order, orderStatus }
                            : order
                    )
                );
            } else {
                alert(data.message || "Error updating order status");
            }
        } catch (error) {
            console.error("Update Status Error:", error);
            alert("Unable to update order status");
        }
    };

    const getProductName = (item) => {
        return item.productId?.productName || "Product";
    };

    // Supports Cloudinary URLs and existing local product image filenames.
    const getProductImage = (item) => {
        const image = item.productId?.image;

        if (!image || typeof image !== "string") {
            return "";
        }

        const trimmedImage = image.trim();

        if (!trimmedImage) {
            return "";
        }

        // Cloudinary or another complete image URL.
        if (/^https?:\/\//i.test(trimmedImage)) {
            return trimmedImage;
        }

        // Existing local image filenames or paths.
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

    const handleImageError = (event, item) => {
        console.error(
            "Product image failed to load:",
            getProductImage(item)
        );

        event.currentTarget.style.display = "none";

        const fallback = event.currentTarget.nextElementSibling;

        if (fallback) {
            fallback.style.display = "flex";
        }
    };

    if (loading) {
        return (
            <div className="admin-loading">
                Loading Orders...
            </div>
        );
    }

    return (
        <div className="admin-orders-page">
            <header className="admin-orders-header">
                <div>
                    <button
                        className="admin-back-button"
                        onClick={() => navigate("/admin")}
                    >
                        ← Back to Dashboard
                    </button>

                    <p className="admin-brand">ZYORA</p>
                    <h1>Manage Orders</h1>
                    <p>View and manage customer orders.</p>
                </div>
            </header>

            <div className="admin-orders-container">
                <div className="orders-count-card">
                    <div>
                        <span>Total Orders</span>
                        <strong>{orders.length}</strong>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="no-orders">
                        <h2>No Orders Found</h2>
                        <p>There are no customer orders yet.</p>
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
                                            #{order._id.slice(-8)}
                                        </h2>
                                    </div>

                                    <div className="order-status-area">
                                        <label>Order Status</label>

                                        {order.orderStatus === "Cancelled" ? (
                                            <span className="cancelled-order-status">
                                                Cancelled
                                            </span>
                                        ) : (
                                            <select
                                                value={order.orderStatus}
                                                onChange={(e) =>
                                                    updateOrderStatus(
                                                        order._id,
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="Pending">
                                                    Pending
                                                </option>
                                             <option value="Processing">
    Processing
</option>
                                                <option value="Shipped">
                                                    Shipped
                                                </option>
                                                <option value="Delivered">
                                                    Delivered
                                                </option>
                                            </select>
                                        )}
                                    </div>
                                </div>

                                <div className="admin-order-date">
                                    Ordered on{" "}
                                    {new Date(order.createdAt).toLocaleDateString(
                                        "en-IN",
                                        {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        }
                                    )}
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
                                            {order.deliveryAddress?.city},{" "}
                                            {order.deliveryAddress?.state}
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
                                                : "UPI / Card"}
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
                                                                    onError={(event) =>
                                                                        handleImageError(
                                                                            event,
                                                                            item
                                                                        )
                                                                    }
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
            </div>
        </div>
    );
}

export default AdminOrders;
