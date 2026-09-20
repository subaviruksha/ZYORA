import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminUsers.css";

function AdminUsers() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const role = localStorage.getItem("role");

        if (role !== "admin") {
            navigate("/login");
            return;
        }

        fetchUsers();
    }, [navigate]);

    const fetchUsers = async () => {
        try {
            const response = await fetch(
"https://zyora-backend-rhv6.onrender.com/api/admin/users"
            );

            const data = await response.json();

            if (response.ok) {
                setUsers(data);
            } else {
                alert(data.message || "Error fetching users");
            }

        } catch (error) {
            console.log("Admin Users Error:", error);
            alert("Unable to load users");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-loading">
                Loading Users...
            </div>
        );
    }

    return (
        <div className="admin-users-page">

            <header className="admin-users-header">

                <div>

                    <button
                        className="admin-users-back"
                        onClick={() => navigate("/admin")}
                    >
                        ← Back to Dashboard
                    </button>

                    <p className="admin-brand">
                        ZYORA
                    </p>

                    <h1>
                        Manage Users
                    </h1>

                    <p>
                        View registered customers and their information.
                    </p>

                </div>

            </header>


            <div className="admin-users-container">

                <div className="users-count-card">

                    <div>
                        <span>
                            Registered Users
                        </span>

                        <strong>
                            {users.length}
                        </strong>
                    </div>

                </div>


                {users.length === 0 ? (

                    <div className="no-users">

                        <h2>
                            No Users Found
                        </h2>

                        <p>
                            There are no registered customers yet.
                        </p>

                    </div>

                ) : (

                    <div className="admin-users-list">

                        {users.map((user, index) => (

                            <div
                                className="admin-user-card"
                                key={user._id}
                            >

                                <div className="user-number">
                                    {String(index + 1).padStart(2, "0")}
                                </div>


                                <div className="user-main-info">

                                    <div className="user-avatar">
                                        {user.name
                                            ? user.name.charAt(0).toUpperCase()
                                            : "U"}
                                    </div>


                                    <div className="user-name-info">

                                        <h2>
                                            {user.name}
                                        </h2>

                                        <span>
                                            {user.email}
                                        </span>

                                    </div>

                                </div>


                                <div className="user-details">

                                    <div className="user-detail-item">

                                        <span>
                                            PHONE
                                        </span>

                                        <strong>
                                            {user.phone || "Not provided"}
                                        </strong>

                                    </div>


                                    <div className="user-detail-item">

                                        <span>
                                            ADDRESS
                                        </span>

                                        <strong>
                                            {user.address?.address ||
                                                "Not provided"}
                                        </strong>

                                    </div>


                                    <div className="user-detail-item">

                                        <span>
                                            LOCATION
                                        </span>

                                        <strong>
                                            {user.address?.city
                                                ? `${user.address.city}, ${user.address.state || ""}`
                                                : "Not provided"}
                                        </strong>

                                    </div>


                                    <div className="user-detail-item">

                                        <span>
                                            PINCODE
                                        </span>

                                        <strong>
                                            {user.address?.pincode ||
                                                "Not provided"}
                                        </strong>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default AdminUsers;