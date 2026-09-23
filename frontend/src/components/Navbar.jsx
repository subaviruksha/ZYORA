import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);

  const userId = localStorage.getItem("userId");
  const location = useLocation();

  const fetchCartCount = async () => {
    try {
      if (!userId) {
        setCartCount(0);
        return;
      }

      const response = await fetch(
        `https://zyora-backend-rhv6.onrender.com/api/cart/${userId}`
      );

      const data = await response.json();

      if (data.items) {
        const totalQuantity = data.items.reduce(
          (total, item) => total + item.quantity,
          0
        );

        setCartCount(totalQuantity);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      console.log("Error fetching cart count:", error);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, [location.pathname]);

  useEffect(() => {
    const updateCart = () => {
      fetchCartCount();
    };

    window.addEventListener("cartUpdated", updateCart);

    return () => {
      window.removeEventListener("cartUpdated", updateCart);
    };
  }, [userId]);

  const handleLogout = () => {
    setLoggingOut(true);

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("role");

    sessionStorage.setItem("logoutMessage", "✓ Logout successful");

    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        ZYORA
      </Link>

      <div className="nav-right">
        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <div className={`nav-links ${menuOpen ? "show" : ""}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          <Link to="/products" onClick={() => setMenuOpen(false)}>
            Products
          </Link>

          <Link to="/categories" onClick={() => setMenuOpen(false)}>
            Categories
          </Link>

          <Link to="/about" onClick={() => setMenuOpen(false)}>
            About
          </Link>

          <Link
            to="/cart"
            className="cart"
            onClick={() => setMenuOpen(false)}
          >
            🛒 Cart ({cartCount})
          </Link>

          <Link to="/orders" onClick={() => setMenuOpen(false)}>
            📦 My Orders
          </Link>

          <Link to="/account" onClick={() => setMenuOpen(false)}>
            My Account
          </Link>
        </div>

        <button className="login-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {loggingOut && (
        <div className="logout-message">
          Logging out...
        </div>
      )}
    </nav>
  );
}

export default Navbar;