
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminProducts.css";

function AdminProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Products");

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
      const response = await fetch(
        "https://zyora-backend-rhv6.onrender.com/api/products"
      );

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
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `https://zyora-backend-rhv6.onrender.com/api/products/${id}`,
        {
          method: "DELETE",
        }
      );

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

  const categories = [
    ...new Set(
      products
        .map((product) => product.category)
        .filter((category) => category && category.trim() !== "")
    ),
  ].sort((a, b) => a.localeCompare(b));

  const filteredProducts =
    selectedCategory === "All Products"
      ? products
      : products.filter(
          (product) => product.category === selectedCategory
        );

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
          <button onClick={() => navigate("/admin")}>
            Dashboard
          </button>

          <button onClick={() => navigate("/admin/products/add")}>
            + Add Product
          </button>
        </div>
      </div>

      <div className="admin-products-container">
        {error && <div className="admin-product-error">{error}</div>}

       
<div className="admin-products-top">
  <h2>{selectedCategory}</h2>

  <span>{filteredProducts.length} Products</span>
</div>


        <div className="admin-category-filter">
          <label htmlFor="admin-category-select">
            Filter by Category
          </label>

          <select
            id="admin-category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All Products">All Products</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

         
        </div>

        {filteredProducts.length === 0 ? (
          <div className="admin-no-products">
            <h3>No Products Found</h3>

            <p>
              {selectedCategory === "All Products"
                ? "There are no products available."
                : "No products available in this category."}
            </p>
          </div>
        ) : (
          <div className="admin-products-list">
            {filteredProducts.map((product) => (
              <div className="admin-product-card" key={product._id}>
                <div className="admin-product-image">
                  <img
                    src={`/productimage/${product.image}`}
                    alt={product.productName}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://zyora-backend-rhv6.onrender.com/productimage/${product.image}`;
                    }}
                  />
                </div>

                <div className="admin-product-info">
                  <p className="admin-product-category">
                    {product.category}
                  </p>

                  <h3>{product.productName}</h3>

                  <div className="admin-product-rating">
                    ★★★★★
                    <span>{product.rating}</span>
                  </div>

                  <div className="admin-product-price">
                    <strong>
                      ₹{product.price.toLocaleString("en-IN")}
                    </strong>

                    <del>
                      ₹{product.oldPrice.toLocaleString("en-IN")}
                    </del>
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
