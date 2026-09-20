import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./CategoryProducts.css";

function CategoryProducts() {
  const { category } = useParams();

  const [products, setProducts] = useState([]);

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

  return (
    <div className="category-products-page">
      <div className="category-products-header">
        <p>ZYORA COLLECTION</p>

        <h1>{category}</h1>

        <span>Explore our {category.toLowerCase()} collection.</span>
      </div>

      <div className="category-product-grid">
        {filteredProducts.map((product) => (
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
