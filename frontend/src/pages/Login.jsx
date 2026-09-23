
import React, { useEffect, useState } from "react";
import "./Login.css";

function Login() {
    const [isSignup, setIsSignup] = useState(false);

    const [loginRole, setLoginRole] = useState("user");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const logoutMessage = sessionStorage.getItem("logoutMessage");

        if (logoutMessage) {
            setMessage(logoutMessage);
            sessionStorage.removeItem("logoutMessage");
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!email || !password) {
            setMessage("Please fill all required fields.");
            return;
        }

        const gmailPattern = /^[a-zA-Z0-9]+@gmail\.com$/;

        if (!gmailPattern.test(email)) {
            setMessage("Please enter a valid Gmail address.");
            return;
        }

        /* SIGN UP */

        if (isSignup) {
            if (!name || !confirmPassword) {
                setMessage("Please fill all fields.");
                return;
            }

            const namePattern = /^[A-Za-z ]+$/;

            if (!namePattern.test(name)) {
                setMessage("Name should contain only letters.");
                return;
            }

            if (password !== confirmPassword) {
                setMessage("Passwords do not match.");
                return;
            }

            try {
                const response = await fetch(
"https://zyora-backend-rhv6.onrender.com/api/auth/register",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            name,
                            email,
                            password,
                            role: "user",
                        }),
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    setMessage(data.message || "Signup failed.");
                    return;
                }

                setMessage("Account created successfully!");

                setTimeout(() => {
                    setIsSignup(false);
                    setName("");
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                    setMessage("");
                }, 1200);

            } catch (error) {
                setMessage("Unable to connect to server.");
            }

            return;
        }

        /* LOGIN */

        try {
            const response = await fetch(
"https://zyora-backend-rhv6.onrender.com/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                        role: loginRole,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Invalid email or password.");
                return;
            }

            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("role", data.role);

            if (data.name) {
                localStorage.setItem("userName", data.name);
            }

            if (data.email) {
                localStorage.setItem("userEmail", data.email);
            }

            setMessage("✓ Login successful");

            setTimeout(() => {

                if (data.role === "admin") {
                    window.location.href = "/admin";
                } else {
                    window.location.href = "/";
                }

            },);

        } catch (error) {
            setMessage("Unable to connect to server.");
        }
    };

    return (
        <div className="login-page">

            {/* LEFT SIDE */}

            <div className="login-left">

                <div className="floating-shape shape-one"></div>
                <div className="floating-shape shape-two"></div>
                <div className="floating-shape shape-three"></div>
                <div className="floating-shape shape-four"></div>

                <div className="left-content">

                    <div className="zyora-animation-circle">
                        <span>Z</span>
                    </div>

                    <h1>ZYORA</h1>

                    <p className="left-tagline">
                        Everything You Want,
                        <br />
                        All in One Place.
                    </p>

                    <div className="left-line"></div>

                    <p className="left-description">
                        Discover products, explore categories
                        <br />
                        and enjoy a simple shopping experience.
                    </p>

                    <div className="animated-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                </div>

            </div>


            {/* RIGHT SIDE */}

            <div className="login-right">

                <div className="login-card">

                    <form
                        className="login-form"
                        onSubmit={handleSubmit}
                    >

                        {/* HEADING */}

                        <div className="form-heading">

                            <span>
                                {isSignup
                                    ? "JOIN ZYORA"
                                    : "WELCOME BACK"}
                            </span>

                            <h2>
                                {isSignup
                                    ? "Create Account"
                                    : "Welcome Back"}
                            </h2>

                            <p>
                                {isSignup
                                    ? "Create your ZYORA account"
                                    : "Login to continue shopping"}
                            </p>

                        </div>


                        {/* LOGIN ROLE */}

                        {!isSignup && (

                            <div className="login-role">

                                <p>Login As</p>

                                <div className="role-buttons">

                                    <button
                                        type="button"
                                        className={
                                            loginRole === "user"
                                                ? "role-button active"
                                                : "role-button"
                                        }
                                        onClick={() =>
                                            setLoginRole("user")
                                        }
                                    >
                                        User
                                    </button>

                                    <button
                                        type="button"
                                        className={
                                            loginRole === "admin"
                                                ? "role-button active"
                                                : "role-button"
                                        }
                                        onClick={() =>
                                            setLoginRole("admin")
                                        }
                                    >
                                        Admin
                                    </button>

                                </div>

                            </div>

                        )}


                        {/* NAME */}

                        {isSignup && (

                            <div className="input-box">

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    placeholder=" "
                                    required
                                />

                                <label>Full Name</label>

                            </div>

                        )}


                        {/* EMAIL */}

                        <div className="input-box">

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder=" "
                                required
                            />

                            <label>Email Address</label>

                        </div>


                        {/* PASSWORD */}

                        <div className="input-box">

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder=" "
                                required
                            />

                            <label>Password</label>

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            >
                                {showPassword
                                    ? "Hide"
                                    : "Show"}
                            </button>

                        </div>


                        {/* CONFIRM PASSWORD */}

                        {isSignup && (

                            <div className="input-box">

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(
                                            e.target.value
                                        )
                                    }
                                    placeholder=" "
                                    required
                                />

                                <label>Confirm Password</label>

                            </div>

                        )}


                        {/* FORGOT PASSWORD */}

                        {!isSignup && (

                            <div className="forgot-password">

                                <a
                                    href="#"
                                    onClick={(e) =>
                                        e.preventDefault()
                                    }
                                >
                                    Forgot Password?
                                </a>

                            </div>

                        )}


                        {/* MESSAGE */}

                        {message && (

                            <div className="auth-message">
                                {message}
                            </div>

                        )}


                        {/* LOGIN BUTTON */}

                        <button
                            type="submit"
                            className="login-button"
                        >

                            <span>
                                {isSignup
                                    ? "Create Account"
                                    : "Login"}
                            </span>

                            <b>→</b>

                        </button>


                        {/* SWITCH ACCOUNT */}

                        <div className="switch-account">

                            <p>
                                {isSignup
                                    ? "Already have an account?"
                                    : "Don't have an account?"}
                            </p>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsSignup(!isSignup);
                                    setMessage("");
                                }}
                            >
                                {isSignup
                                    ? "Login"
                                    : "Sign Up"}
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default Login;
