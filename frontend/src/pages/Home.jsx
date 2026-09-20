import "./Home.css";
import Footer from "../components/Footer";
import heroImage from "../assets/heropic.png.png";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <p className="small-title">WELCOME TO ZYORA</p>

          <h1>
            Shop Smart.
            <br />
            Shop Better.
          </h1>

          <p className="hero-text">
            Discover phones, laptops, electronics, fashion and more — all in one
            place.
          </p>

<Link to="/product">Shop Now
            <button className="shop-btn">Shop Now</button>
         </Link>
        </div>

        <div className="hero-image">
          <img className="heropicinsert" src={heroImage} alt="ZYORA Shopping" />
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <p className="section-title">EXPLORE</p>

        <h2>Shop by Category</h2>

        <div className="category-container">
          <Link to="/category/Mobiles" className="category-link">
            <div className="category-card">
              <div className="category-image">
                <img src="/productimage/Galaxy S24.jpg" alt="Mobiles" />
              </div>

              <h3>Mobiles</h3>

              <p>Smartphones & accessories</p>
            </div>
          </Link>

          <Link to="/category/Laptops" className="category-link">
            <div className="category-card">
              <div className="category-image">
                <img
                  src="/productimage/Samsung-galaxy-book4.jpg"
                  alt="Laptops"
                />
              </div>

              <h3>Laptops</h3>

              <p>Laptops & computers</p>
            </div>
          </Link>

          <Link to="/category/Electronics" className="category-link">
            <div className="category-card">
              <div className="category-image">
                <img src="/productimage/galaxy-buds-3.jpg" alt="Electronics" />
              </div>

              <h3>Electronics</h3>

              <p>Gadgets & accessories</p>
            </div>
          </Link>

          <Link to="/category/Women's Fashion" className="category-link">
            <div className="category-card">
              <div className="category-image">
                <img src="/productimage/floral-kurti.jpg" alt="Fashion" />
              </div>

              <h3>Fashion</h3>

              <p>Clothing & accessories</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <p className="section-title">OUR PICKS</p>

        <h2>Featured Products</h2>

        <div className="product-container">
            <Link to="/products/6aa3fcd083a9f01edd74da62" className="product-link">
    
          <div className="product-card">
            <div className="product-image">
              <img src="/productimage/iphone15.jpg" alt="iPhone 15" />
            </div>

            <h3>iPhone 15</h3>

            <p>Latest Apple smartphone</p>

            <strong>₹69,999</strong>
          </div>
</Link>

<Link to="/products/6aa3fcd083a9f01edd74da6b" className="product-link">
          <div className="product-card">
            <div className="product-image">
              <img src="/productimage/HP-pavilion-14.jpg" alt="HP Laptop" />
            </div>

            <h3>HP Laptop</h3>

            <p>Powerful everyday laptop</p>

            <strong>₹55,999</strong>
          </div>
</Link>

<Link to="/products/6aa3fcd083a9f01edd74da6e" className="product-link">
          <div className="product-card">
            <div className="product-image">
              <img src="/productimage/jbl-flip-6.jpg" alt="JBL Speaker" />
            </div>

            <h3>JBL Speaker</h3>

            <p>Premium sound quality</p>

            <strong>₹2,999</strong>
          </div>
</Link>
<Link to="/products/6aa3fcd083a9f01edd74da6c" className="product-link">
          <div className="product-card">
            <div className="product-image">
              <img src="/productimage/galaxy-watch-7.jpg" alt="Smart Watch" />
            </div>

            <h3>Smart Watch</h3>

            <p>Smart and stylish</p>

            <strong>₹4,999</strong>
          </div>
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-section">
        <p className="section-title">WHY ZYORA</p>

        <h2>Why Choose Us?</h2>

        <div className="why-container">
          <div className="why-card">
            <span>🚚</span>

            <h3>Fast Delivery</h3>

            <p>Quick and reliable delivery.</p>
          </div>

          <div className="why-card">
            <span>🔒</span>

            <h3>Secure Shopping</h3>

            <p>Your information stays protected.</p>
          </div>

          <div className="why-card">
            <span>↩️</span>

            <h3>Easy Returns</h3>

            <p>Simple and hassle-free returns.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
