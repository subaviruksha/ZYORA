import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`https://zyora-backend-rhv6.onrender.com/api/products/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data);
      })
      .catch((error) => {
        console.log("Error fetching product:", error);
      });
  }, [id]);

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("userId");

    try {
      const response = await fetch(
        "https://zyora-backend-rhv6.onrender.com/api/cart",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            userId: userId,
            productId: product._id,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        window.dispatchEvent(new Event("cartUpdated"));

        setMessage("✓ Product added to cart");

        setTimeout(() => {
          setMessage("");
        }, 2500);
      } else {
        setMessage(data.message);

        setTimeout(() => {
          setMessage("");
        }, 2500);
      }
    } catch (error) {
      console.log("Error adding to cart:", error);
    }
  };

  const handleBuyNow = () => {
    localStorage.setItem("buyNowProduct", JSON.stringify(product));

    navigate("/checkout?buyNow=true");
  };

  if (!product) {
    return <p>Loading product...</p>;
  }

  return (
    <div className="product-page">
      {message && <div className="cart-message">{message}</div>}

      <div className="product-details">
        <div className="details-image">
          <img
            src={`/productimage/${product.image}`}
            alt={product.productName}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://zyora-backend-rhv6.onrender.com/productimage/${product.image}`;
            }}
          />
        </div>

        <div className="details-info">
          <p className="details-category">{product.category}</p>

          <h1>{product.productName}</h1>

          <p className="details-brand">Brand: {product.brand}</p>

          <div className="details-rating">
            ★★★★★
            <span> {product.rating}/5</span>
          </div>

          <div className="details-price">
            <strong>₹{product.price.toLocaleString("en-IN")}</strong>

            <del>₹{product.oldPrice.toLocaleString("en-IN")}</del>

            <span>{product.discount}%</span>
          </div>

          <p className="details-short">{product.shortDescription}</p>

          <p className="details-full">{product.fullDescription}</p>

          <div className="details-basic">
            <p>
              Color:
              <strong> {product.color}</strong>
            </p>

            {product.storage && (
              <p>
                Storage:
                <strong> {product.storage}</strong>
              </p>
            )}

            {product.ram && (
              <p>
                RAM:
                <strong> {product.ram}</strong>
              </p>
            )}

            <p>
              Stock:
              <strong> {product.stock}</strong>
            </p>
          </div>

          {product.stock > 0 ? (
            <div className="details-buttons">
              <button className="details-cart" onClick={handleAddToCart}>
                Add to Cart
              </button>

              <button className="details-buy-now" onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>
          ) : (
            <button className="details-cart out-of-stock-btn" disabled>
              Out of Stock
            </button>
          )}
        </div>
      </div>

      <div className="product-extra">
        {product.productHighlights && (
          <div className="extra-section">
            <h2>Product Highlights</h2>

            <ul>
              {product.productHighlights.split(";").map((highlight, index) => (
                <li key={index}>{highlight.trim()}</li>
              ))}
            </ul>
          </div>
        )}

        {product.specifications && (
          <div className="extra-section">
            <h2>Product Specifications</h2>

            <ul>
              {product.specifications.split(";").map((specification, index) => (
                <li key={index}>{specification.trim()}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="extra-section">
          <h2>Availability</h2>

          <p className="availability">
            {product.stock > 0
              ? `${product.stock} units Available`
              : "Out of Stock"}
          </p>
        </div>

        <div className="extra-section">
          <h2>About This Product</h2>

          <p className="about-product">{product.fullDescription}</p>
        </div>

        <div className="extra-section">
          <h2>Customer Reviews</h2>

          <div className="review-summary">
            <div className="review-rating">★★★★★</div>

            <strong>{product.rating} out of 5</strong>

            <p>Based on customer ratings</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
