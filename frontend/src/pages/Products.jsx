import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
fetch("https://zyora-backend-rhv6.onrender.com/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.log("Error fetching products:", error);
      });
  }, []);

  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((item) => item !== category),
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const filteredProducts = products.filter((product) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      product.productName.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search) ||
      product.brand.toLowerCase().includes(search);

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);

    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "low-high") {
      return a.price - b.price;
    }

    if (sortOption === "high-low") {
      return b.price - a.price;
    }

    if (sortOption === "rating") {
      return b.rating - a.rating;
    }

    if (sortOption === "discount") {
      return b.discount - a.discount;
    }

    return 0;
  });

  return (
    <div className="products-page">
      <div className="products-header">
        <p>ZYORA COLLECTION</p>

        <h1>Explore Our Products</h1>

        <span>Discover products selected for your everyday needs.</span>

        <div className="product-search">
          <input
            type="text"
            placeholder="Search categories...."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <span>🔍</span>
        </div>
      </div>

      <div className="products-layout">
        <aside className="filter-box">
          <h3>Categories</h3>

          <label>
            <input
              type="checkbox"
              checked={selectedCategories.includes("Mobiles")}
              onChange={() => handleCategoryChange("Mobiles")}
            />
            Mobiles
          </label>

          <label>
            <input
              type="checkbox"
              checked={selectedCategories.includes("Laptops")}
              onChange={() => handleCategoryChange("Laptops")}
            />
            Laptops
          </label>

          <label>
            <input
              type="checkbox"
              checked={selectedCategories.includes("Electronics")}
              onChange={() => handleCategoryChange("Electronics")}
            />
            Electronics
          </label>

          <label>
            <input
              type="checkbox"
              checked={selectedCategories.includes("Men's Fashion")}
              onChange={() => handleCategoryChange("Men's Fashion")}
            />
            Men's Fashion
          </label>

          <label>
            <input
              type="checkbox"
              checked={selectedCategories.includes("Women's Fashion")}
              onChange={() => handleCategoryChange("Women's Fashion")}
            />
            Women's Fashion
          </label>

          <label>
            <input
              type="checkbox"
              checked={selectedCategories.includes("Toys")}
              onChange={() => handleCategoryChange("Toys")}
            />
            Toys
          </label>

          <label>
            <input
              type="checkbox"
              checked={selectedCategories.includes("Home & Kitchen")}
              onChange={() => handleCategoryChange("Home & Kitchen")}
            />
            Home & Kitchen
          </label>

          <label>
            <input
              type="checkbox"
              checked={selectedCategories.includes("Stationery")}
              onChange={() => handleCategoryChange("Stationery")}
            />
            Stationery
          </label>

          <label>
            <input
              type="checkbox"
              checked={selectedCategories.includes("Sports & Fitness")}
              onChange={() => handleCategoryChange("Sports & Fitness")}
            />
            Gym & Fitness
          </label>

          <label>
            <input
              type="checkbox"
              checked={selectedCategories.includes("Beauty")}
              onChange={() => handleCategoryChange("Beauty")}
            />
            Beauty
          </label>
        </aside>

        <main className="product-section">
          <div className="product-top">
            <p>Showing {sortedProducts.length} products</p>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">Sort by</option>

              <option value="low-high">Price: Low to High</option>

              <option value="high-low">Price: High to Low</option>

              <option value="rating">Rating: High to Low</option>

              <option value="discount">Discount: High to Low</option>
            </select>
          </div>

          <div className="product-grid">
            {sortedProducts.map((product) => (
              <div className="product-card" key={product._id}>
                <div className="product-image">
                  <img
                    src={`/productimage/${product.image}`}
                    alt={product.productName}
                    onError={(e) => {
                      e.target.onerror = null;
e.target.src = `https://zyora-backend-rhv6.onrender.com/productimage/${product.image}`;
                    }}
                  />

                  <span className="discount">{product.discount}%</span>
                </div>

                <div className="product-info">
                  <p className="product-category">{product.category}</p>

                  <h3>{product.productName}</h3>

                  <div className="rating">
                    ★★★★★
                    <span>{product.rating}</span>
                  </div>

                  <div className="price">
                    <strong>₹{product.price.toLocaleString("en-IN")}</strong>

                    <del>₹{product.oldPrice.toLocaleString("en-IN")}</del>
                  </div>

                  <button
                    className="view-product"
                    onClick={() => navigate(`/products/${product._id}`)}
                  >
                    View Product
                  </button>
                </div>
              </div>
            ))}
          </div>

          {sortedProducts.length === 0 && (
            <p className="no-products">No products found.</p>
          )}
        </main>
      </div>
    </div>
  );
}

export default Products;
