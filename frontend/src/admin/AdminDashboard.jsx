
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {

    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        pendingOrders: 0
    });

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
                    "https://zyora-backend-rhv6.onrender.com/api/admin/dashboard"
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

        fetchDashboard();

    }, [navigate]);


    const handleLogout = () => {

        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");

        sessionStorage.setItem(
            "logoutMessage",
            "✓ Logout successful"
        );

        window.location.href = "/login";

    };


    const handleAccount = () => {

        navigate("/admin/account");

    };


    if (loading) {

        return (
            <div className="admin-loading">
                Loading Admin Dashboard...
            </div>
        );

    }


    return (

        <div className="admin-page">

            <header className="admin-header">

                <div>

                    <p className="admin-brand">
                        ZYORA
                    </p>

                    <h1>
                        Admin Dashboard
                    </h1>

                    <p>
                        Manage your store from one place.
                    </p>

                </div>


                <div className="admin-header-actions">

                    <button
                        className="admin-account-button"
                        onClick={handleAccount}
                    >
                        <span className="account-icon">
                            👤
                        </span>

                        <span>
                            Account
                        </span>
                    </button>


                    <button
                        className="admin-logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            <div className="admin-container">


                <div className="admin-stats">


                    <div className="admin-stat-card">

                        <span>
                            Products
                        </span>

                        <strong>
                            {stats.totalProducts}
                        </strong>

                    </div>


                    <div className="admin-stat-card">

                        <span>
                            Orders
                        </span>

                        <strong>
                            {stats.totalOrders}
                        </strong>

                    </div>


                    <div className="admin-stat-card">

                        <span>
                            Users
                        </span>

                        <strong>
                            {stats.totalUsers}
                        </strong>

                    </div>


                    <div className="admin-stat-card">

                        <span>
                            Pending Orders
                        </span>

                        <strong>
                            {stats.pendingOrders}
                        </strong>

                    </div>


                </div>


                <div className="admin-section">

                    <h2>
                        Quick Management
                    </h2>


                    <div className="admin-actions">


                        <button
                            onClick={() => navigate("/admin/products")}
                        >

                            <div className="admin-action-top">

                                <strong>
                                    Manage Products
                                </strong>

                                <span className="admin-action-arrow">
                                    →
                                </span>

                            </div>

                            <span>
                                Add, edit and delete products
                            </span>

                        </button>


                        <button
                            onClick={() => navigate("/admin/orders")}
                        >

                            <div className="admin-action-top">

                                <strong>
                                    Manage Orders
                                </strong>

                                <span className="admin-action-arrow">
                                    →
                                </span>

                            </div>

                            <span>
                                View and update customer orders
                            </span>

                        </button>


                        <button
                            onClick={() => navigate("/admin/users")}
                        >

                            <div className="admin-action-top">

                                <strong>
                                    Manage Users
                                </strong>

                                <span className="admin-action-arrow">
                                    →
                                </span>

                            </div>

                            <span>
                                View registered customers
                            </span>

                        </button>


                    </div>

                </div>


                <div className="admin-section">

                    <h2>
                        Store Overview
                    </h2>


                    <div className="admin-overview">

                        <p>
                            Total Products

                            <strong>
                                {stats.totalProducts}
                            </strong>
                        </p>


                        <p>
                            Total Orders

                            <strong>
                                {stats.totalOrders}
                            </strong>
                        </p>


                        <p>
                            Registered Users

                            <strong>
                                {stats.totalUsers}
                            </strong>
                        </p>


                        <p>
                            Orders Awaiting Processing

                            <strong>
                                {stats.pendingOrders}
                            </strong>
                        </p>

                    </div>

                </div>


            </div>

        </div>

    );

}

export default AdminDashboard;

