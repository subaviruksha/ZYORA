import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminAccount.css";

function AdminAccount() {
    const navigate = useNavigate();

    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const role = localStorage.getItem("role");

        if (role !== "admin") {
            navigate("/login");
            return;
        }

        const adminName = localStorage.getItem("userName");
        const adminEmail = localStorage.getItem("userEmail");

        setAdmin({
            name: adminName || "ZYORA Admin",
            email: adminEmail || "admin@gmail.com"
        });

        setLoading(false);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");

        window.location.href = "/login";
    };

    if (loading) {
        return (
            <div className="admin-loading">
                Loading Account...
            </div>
        );
    }

    return (
        <div className="admin-account-page">

            <div className="admin-account-container">

                <button
                    className="admin-account-back"
                    onClick={() => navigate("/admin")}
                >
                    ← Back to Dashboard
                </button>


                <div className="admin-account-header">

                    <p className="admin-account-brand">
                        ZYORA
                    </p>

                    <h1>
                        Admin Account
                    </h1>

                    <p>
                        Manage your administrator account.
                    </p>

                </div>


                <div className="admin-account-card">

                    <div className="admin-profile">

                        <div className="admin-avatar">
                            {admin.name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <h2>
                                {admin.name}
                            </h2>

                            <span>
                                Administrator
                            </span>
                        </div>

                    </div>


                    <div className="admin-account-details">

                        <div className="admin-account-item">

                            <span>
                                NAME
                            </span>

                            <strong>
                                {admin.name}
                            </strong>

                        </div>


                        <div className="admin-account-item">

                            <span>
                                EMAIL
                            </span>

                            <strong>
                                {admin.email}
                            </strong>

                        </div>


                        <div className="admin-account-item">

                            <span>
                                ROLE
                            </span>

                            <strong>
                                Administrator
                            </strong>

                        </div>

                    </div>


                    <div className="admin-account-actions">

                   

                        <button
                            className="admin-logout-account"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AdminAccount;