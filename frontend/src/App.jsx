import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Checkout from "./pages/checkout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import ProductDetails from "./pages/ProductDetails";
import CategoryProducts from "./pages/CategoryProducts";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import Account from "./pages/Account";
import AdminUsers from "./admin/AdminUsers";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProducts from "./admin/AdminProducts";
import AdminEditProducts from "./admin/AdminEditProducts";
import AdminOrders from "./admin/AdminOrders";
import AdminAccount from "./admin/AdminAccount";
import AdminAddProduct from "./admin/AdminAddProduct";

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

function App() {

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const role = localStorage.getItem("role");

  return (
    <BrowserRouter>
    <ScrollToTop />
      {isLoggedIn && role === "user" && <Navbar />}

      <Routes>
        {/* Login */}

        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to={role === "admin" ? "/admin" : "/"} replace />
            ) : (
              <Login />
            )
          }
        />

        {/* USER ROUTES */}

        {isLoggedIn && role === "user" && (
          <>
            <Route path="/" element={<Home />} />

            <Route path="/products" element={<Products />} />

            <Route path="/categories" element={<Categories />} />

            <Route path="/about" element={<About />} />

            <Route path="/cart" element={<Cart />} />

            <Route path="/checkout" element={<Checkout />} />

            <Route path="/products/:id" element={<ProductDetails />} />

            <Route path="/order-success" element={<OrderSuccess />} />

            <Route path="/category/:category" element={<CategoryProducts />} />

            <Route path="/orders" element={<MyOrders />} />

            <Route path="/orders/:id" element={<OrderDetails />} />

            <Route path="/account" element={<Account />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}

        {/* ADMIN ROUTES */}

        {isLoggedIn && role === "admin" && (
          <>
            <Route path="/admin" element={<AdminDashboard />} />

            <Route path="/admin/products" element={<AdminProducts />} />

            <Route
              path="/admin/products/edit/:id"
              element={<AdminEditProducts />}
            />

            <Route path="/admin/orders" element={<AdminOrders />} />

            <Route path="/admin/users" element={<AdminUsers />} />

            <Route path="/admin/account" element={<AdminAccount />} />

            <Route path="/admin/products/add" element={<AdminAddProduct />} />
            
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </>
        )}

        {/* NOT LOGGED IN */}

        {!isLoggedIn && (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
