import { useEffect, useState } from "react";
import "./Account.css";

function Account() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [editing, setEditing] = useState(false);
    const [editingAddress, setEditingAddress] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [pincode, setPincode] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const userId = localStorage.getItem("userId");

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const response = await fetch(
                    `http://localhost:5000/api/auth/profile/${userId}`
                );

                const data = await response.json();

                if (response.ok) {

                    setUser(data);

                    setName(data.name || "");
                    setEmail(data.email || "");

                    setPhone(data.phone || "");
                    setAddress(data.address?.address || "");
                    setCity(data.address?.city || "");
                    setState(data.address?.state || "");
                    setPincode(data.address?.pincode || "");
                }

            } catch (error) {

                console.log("Profile Error:", error);

            } finally {

                setLoading(false);

            }
        };

        if (userId) {
            fetchProfile();
        } else {
            setLoading(false);
        }

    }, [userId]);


    const handleUpdate = async () => {

        try {

            const response = await fetch(
                `http://localhost:5000/api/auth/profile/${userId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                setUser(data.user);
                setEditing(false);

            }

        } catch (error) {

            console.log("Update Profile Error:", error);

        }

    };


    const handleAddressSave = async () => {

        if (
            !phone ||
            !address ||
            !city ||
            !state ||
            !pincode
        ) {

            alert("Please fill all address details.");
            return;

        }

        if (!/^\d{10}$/.test(phone)) {

            alert("Phone number must be 10 digits.");
            return;

        }

        if (!/^\d{6}$/.test(pincode)) {

            alert("Pincode must be 6 digits.");
            return;

        }

        try {

            const response = await fetch(
                `http://localhost:5000/api/auth/address/${userId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        phone,
                        address,
                        city,
                        state,
                        pincode
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                setUser(data.user);
                setEditingAddress(false);

            }

        } catch (error) {

            console.log("Address Error:", error);

        }

    };


    const handlePasswordChange = async () => {

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {

            alert("Please fill all password fields.");
            return;

        }

        if (newPassword.length < 6) {

            alert("New password must be at least 6 characters.");
            return;

        }

        if (newPassword !== confirmPassword) {

            alert("New password and confirm password do not match.");
            return;

        }

        if (currentPassword === newPassword) {

            alert("New password must be different from current password.");
            return;

        }

        try {

            const response = await fetch(
                `http://localhost:5000/api/auth/change-password/${userId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        currentPassword,
                        newPassword
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                alert("Password changed successfully.");

                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");

                setShowCurrentPassword(false);
                setShowNewPassword(false);
                setShowConfirmPassword(false);

                setChangingPassword(false);

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.log("Change Password Error:", error);

            alert("Something went wrong.");

        }

    };


    if (loading) {

        return (
            <div className="account-page">

                <div className="account-container">

                    <h1>
                        Loading Account...
                    </h1>

                </div>

            </div>
        );

    }


    return (

        <div className="account-page">

            <div className="account-container">


                <div className="account-header">

                    <p className="account-label">
                        ZYORA
                    </p>

                    <h1>
                        My Account
                    </h1>

                    <p>
                        Manage your personal information and account settings.
                    </p>

                </div>


                <div className="account-card">

                    <h2>
                        Personal Details
                    </h2>


                    {editing ? (

                        <div className="edit-details">

                            <div className="edit-field">

                                <label>
                                    Name
                                </label>

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />

                            </div>


                            <div className="edit-field">

                                <label>
                                    Email
                                </label>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                            </div>


                            <div className="edit-actions">

                                <button
                                    className="account-btn"
                                    onClick={handleUpdate}
                                >
                                    Save Changes
                                </button>


                                <button
                                    className="cancel-btn"
                                    onClick={() => setEditing(false)}
                                >
                                    Cancel
                                </button>

                            </div>

                        </div>

                    ) : (

                        <>

                            <div className="account-details">

                                <div className="detail-item">

                                    <span>
                                        Name
                                    </span>

                                    <strong>
                                        {user?.name || "Not added"}
                                    </strong>

                                </div>


                                <div className="detail-item">

                                    <span>
                                        Email
                                    </span>

                                    <strong>
                                        {user?.email || "Not added"}
                                    </strong>

                                </div>

                            </div>


                            <button
                                className="account-btn"
                                onClick={() => setEditing(true)}
                            >
                                Edit Details
                            </button>

                        </>

                    )}

                </div>


                <div className="account-card">

                    <h2>
                        Delivery Address
                    </h2>


                    {editingAddress ? (

                        <div className="edit-details">


                            <div className="edit-field">

                                <label>
                                    Phone Number
                                </label>

                                <input
                                    type="tel"
                                    value={phone}
                                    maxLength="10"
                                    onChange={(e) => setPhone(e.target.value)}
                                />

                            </div>


                            <div className="edit-field">

                                <label>
                                    Address
                                </label>

                                <textarea
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    rows="3"
                                />

                            </div>


                            <div className="edit-field">

                                <label>
                                    City
                                </label>

                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />

                            </div>


                            <div className="edit-field">

                                <label>
                                    State
                                </label>

                                <input
                                    type="text"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                />

                            </div>


                            <div className="edit-field">

                                <label>
                                    Pincode
                                </label>

                                <input
                                    type="text"
                                    value={pincode}
                                    maxLength="6"
                                    onChange={(e) => setPincode(e.target.value)}
                                />

                            </div>


                            <div className="edit-actions">

                                <button
                                    className="account-btn"
                                    onClick={handleAddressSave}
                                >
                                    Save Address
                                </button>


                                <button
                                    className="cancel-btn"
                                    onClick={() => setEditingAddress(false)}
                                >
                                    Cancel
                                </button>

                            </div>

                        </div>

                    ) : (

                        user?.address?.address ? (

                            <>

                                <div className="saved-address">

                                    <strong>
                                        {user.name}
                                    </strong>

                                    <p>
                                        {user.phone}
                                    </p>

                                    <p>
                                        {user.address.address}
                                    </p>

                                    <p>
                                        {user.address.city},{" "}
                                        {user.address.state}
                                    </p>

                                    <p>
                                        Pincode: {user.address.pincode}
                                    </p>

                                </div>


                                <button
                                    className="account-btn"
                                    onClick={() => setEditingAddress(true)}
                                >
                                    Edit Address
                                </button>

                            </>

                        ) : (

                            <>

                                <p className="account-placeholder">
                                    Add your delivery address for faster checkout.
                                </p>


                                <button
                                    className="account-btn"
                                    onClick={() => setEditingAddress(true)}
                                >
                                    Add Address
                                </button>

                            </>

                        )

                    )}

                </div>


                <div className="account-card">

                    <h2>
                        Security
                    </h2>


                    {changingPassword ? (

                        <div className="edit-details">


                            <div className="edit-field">

                                <label>
                                    Current Password
                                </label>

                                <div className="password-input">

                                    <input
                                        type={
                                            showCurrentPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={currentPassword}
                                        onChange={(e) =>
                                            setCurrentPassword(e.target.value)
                                        }
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowCurrentPassword(
                                                !showCurrentPassword
                                            )
                                        }
                                    >
                                        {showCurrentPassword
                                            ? "Hide"
                                            : "Show"}
                                    </button>

                                </div>

                            </div>


                            <div className="edit-field">

                                <label>
                                    New Password
                                </label>

                                <div className="password-input">

                                    <input
                                        type={
                                            showNewPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={newPassword}
                                        onChange={(e) =>
                                            setNewPassword(e.target.value)
                                        }
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowNewPassword(
                                                !showNewPassword
                                            )
                                        }
                                    >
                                        {showNewPassword
                                            ? "Hide"
                                            : "Show"}
                                    </button>

                                </div>

                            </div>


                            <div className="edit-field">

                                <label>
                                    Confirm New Password
                                </label>

                                <div className="password-input">

                                    <input
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                    >
                                        {showConfirmPassword
                                            ? "Hide"
                                            : "Show"}
                                    </button>

                                </div>

                            </div>


                            <div className="edit-actions">

                                <button
                                    className="account-btn"
                                    onClick={handlePasswordChange}
                                >
                                    Change Password
                                </button>


                                <button
                                    className="cancel-btn"
                                    onClick={() => {
                                        setChangingPassword(false);
                                        setCurrentPassword("");
                                        setNewPassword("");
                                        setConfirmPassword("");
                                        setShowCurrentPassword(false);
                                        setShowNewPassword(false);
                                        setShowConfirmPassword(false);
                                    }}
                                >
                                    Cancel
                                </button>

                            </div>

                        </div>

                    ) : (

                        <>

                            <p className="account-placeholder">
                                Keep your ZYORA account secure by updating your password regularly.
                            </p>


                            <button
                                className="account-btn"
                                onClick={() => setChangingPassword(true)}
                            >
                                Change Password
                            </button>

                        </>

                    )}

                </div>

            </div>

        </div>

    );

}

export default Account;