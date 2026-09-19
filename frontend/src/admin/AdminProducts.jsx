import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminProducts.css";

function AdminProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "admin") {
      navigate("/login");
      return;
    }

    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products");

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Error fetching products");

        return;
      }

      setProducts(data);
    } catch (error) {
      console.log("Products Error:", error);

      setError("Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        alert("Product deleted successfully");

        fetchProducts();
      } else {
        alert(data.message || "Error deleting product");
      }
    } catch (error) {
      console.log("Delete Error:", error);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading Products...</div>;
  }

  return (
    <div className="admin-products-page">
      <div className="admin-products-header">
        <div>
          <p className="admin-brand">ZYORA</p>

          <h1>Manage Products</h1>

          <p>Add, edit and manage your store products.</p>
        </div>

        <div className="admin-products-buttons">
          <button onClick={() => navigate("/admin")}>Dashboard</button>

          <button onClick={() => navigate("/admin/products/add")}>
            + Add Product
          </button>
        </div>
      </div>

      <div className="admin-products-container">
        {error && <div className="admin-product-error">{error}</div>}

        <div className="admin-products-top">
          <h2>All Products</h2>

          <span>{products.length} Products</span>
        </div>

        {products.length === 0 ? (
          <div className="admin-no-products">
            <h3>No Products Found</h3>

            <p>There are no products available.</p>
          </div>
        ) : (
          <div className="admin-products-list">
            {products.map((product) => (
              <div className="admin-product-card" key={product._id}>
                <div className="admin-product-image">
                  <img
                    src={`/productimage/${product.image}`}
                    alt={product.productName}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `http://localhost:5000/productimage/${product.image}`;
                    }}
                  />
                </div>

                <div className="admin-product-info">
                  <p className="admin-product-category">{product.category}</p>

                  <h3>{product.productName}</h3>

                  <div className="admin-product-rating">
                    ★★★★★
                    <span>{product.rating}</span>
                  </div>

                  <div className="admin-product-price">
                    <strong>₹{product.price.toLocaleString("en-IN")}</strong>

                    <del>₹{product.oldPrice.toLocaleString("en-IN")}</del>
                  </div>

                  <p>Discount: {product.discount}%</p>
                </div>

                <div className="admin-product-stock">
                  <span>Stock</span>

                  <strong>{product.stock}</strong>
                </div>

                <div className="admin-product-actions">
                  <button
                    onClick={() =>
                      navigate(`/admin/products/edit/${product._id}`)
                    }
                  >
                    Edit
                  </button>

                  <button onClick={() => handleDelete(product._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProducts;
