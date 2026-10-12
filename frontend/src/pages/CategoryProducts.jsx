import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./CategoryProducts.css";

function CategoryProducts() {
  const { category } = useParams();

  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState("");

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

  const filteredProducts = products.filter(
    (product) => product.category === category,
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "low-high") return a.price - b.price;
    if (sortOption === "high-low") return b.price - a.price;
    if (sortOption === "rating") return b.rating - a.rating;
    if (sortOption === "discount") return b.discount - a.discount;
    return 0;
  });

  return (
    <div className="category-products-page">
      <div className="category-products-header">
        <p>ZYORA COLLECTION</p>

        <h1>{category}</h1>

        <span>Explore our {category.toLowerCase()} collection.</span>
      </div>

      <div className="category-sort">
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

      <div className="category-product-grid">
        {sortedProducts.map((product) => (
          <div className="category-product-card" key={product._id}>
            <div className="category-product-image">
              <img
                src={`/productimage/${product.image}`}
                alt={product.productName}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://zyora-backend-rhv6.onrender.com/productimage/${product.image}`;
                }}
              />
            </div>

            <div className="category-product-info">
              <p className="category-product-brand">{product.brand}</p>

              <h3>{product.productName}</h3>

              <div className="category-product-rating">
                ★★★★★
                <span>{product.rating}</span>
              </div>

              <div className="category-product-price">
                <strong>₹{product.price.toLocaleString("en-IN")}</strong>

                <del>₹{product.oldPrice.toLocaleString("en-IN")}</del>

                <span>{product.discount}%</span>
              </div>

              <Link
                to={`/products/${product._id}`}
                className="category-view-button"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryProducts;
