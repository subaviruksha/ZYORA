import Footer from "../components/Footer";
import "./About.css";
import { Link } from "react-router-dom";
function About() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <p>ABOUT ZYORA</p>
        <h1>
          Everything You Want,
          <br />
          All in One Place.
        </h1>
        <span>
          ZYORA brings products from different categories together to make your
          everyday shopping simple and enjoyable.
        </span>
      </section>

      <section className="about-content">
        <div className="about-box">
          <div className="about-icon">🛍️</div>
          <h2>Our Story</h2>
          <p>
            ZYORA is a modern multi-category shopping platform created to make
            online shopping easy, convenient, and accessible. From mobiles and
            electronics to fashion, beauty, gaming, and home essentials,
            everything is available in one place.
          </p>
        </div>

        <div className="about-box">
          <div className="about-icon">✨</div>
          <h2>Our Mission</h2>
          <p>
            Our mission is to provide a smooth shopping experience with a wide
            range of products, simple navigation, reliable service, and a
            customer-friendly experience.
          </p>
        </div>
      </section>

      <section className="about-features">
        <div className="feature">
          <div className="feature-icon">🔍</div>
          <h3>Easy Shopping</h3>
          <p>Find what you need quickly and easily.</p>
        </div>

        <div className="feature">
          <div className="feature-icon">📦</div>
          <h3>Wide Selection</h3>
          <p>Explore products across multiple categories.</p>
        </div>

        <div className="feature">
          <div className="feature-icon">🔒</div>
          <h3>Secure Experience</h3>
          <p>Shop with confidence and peace of mind.</p>
        </div>

        <div className="feature">
          <div className="feature-icon">❤️</div>
          <h3>Customer First</h3>
          <p>Your shopping experience matters to us.</p>
        </div>
      </section>

      <section className="why-zyora">
        <div className="section-title">
          <p>WHY ZYORA</p>
          <h2>Why Choose ZYORA?</h2>
          <span>
            Everything you need for a simple and enjoyable shopping experience.
          </span>
        </div>

        <div className="why-grid">
          <div className="why-card">
            <div className="why-icon">🛍️</div>
            <h3>Multiple Categories</h3>
            <p>
              Explore a wide range of products across different categories in
              one place.
            </p>
          </div>

          <div className="why-card">
            <div className="why-icon">✨</div>
            <h3>Easy Shopping</h3>
            <p>Enjoy simple navigation and a smooth shopping experience.</p>
          </div>

          <div className="why-card">
            <div className="why-icon">🔒</div>
            <h3>Secure Experience</h3>
            <p>Shop with confidence through a safe and reliable platform.</p>
          </div>

          <div className="why-card">
            <div className="why-icon">❤️</div>
            <h3>Customer Focused</h3>
            <p>
              We focus on making every shopping experience simple and
              convenient.
            </p>
          </div>
        </div>
      </section>

      <section className="find-section">
        <div className="section-title">
          <p>EXPLORE ZYORA</p>
          <h2>What Can You Find?</h2>
          <span>Discover products for your everyday needs.</span>
        </div>

        <div className="find-grid">
          <Link to="/category/Mobiles" className="find-card">
            <div className="find-card">
              <img src="/productimage/Galaxy S24.jpg" alt="Mobiles" />
              <h3>Mobiles</h3>
            </div>
          </Link>

          <Link to="/category/Laptops" className="find-card">
            <div className="find-card">
              <img src="/productimage/Samsung-galaxy-book4.jpg" alt="Laptops" />
              <h3>Laptops</h3>
            </div>
          </Link>

          <Link to="/category/Electronics" className="find-card">
            <div className="find-card">
              <img src="/productimage/galaxy-buds-3.jpg" alt="Electronics" />
              <h3>Electronics</h3>
            </div>
          </Link>

          <Link to="/category/Stationery" className="find-card">
            <div className="find-card">
              <img src="/productimage/art-sketchbook.jpg" alt="Stationery" />
              <h3>Stationery</h3>
            </div>
          </Link>

          <Link to="/category/Beauty" className="find-card">
            <div className="find-card">
              <img src="/productimage/herbal-shampoo.jpg" alt="Beauty" />{" "}
              <h3>Beauty</h3>
            </div>
          </Link>
          <Link to="/category/Home & Kitchen" className="find-card">
            <div className="find-card">
              <img
                src="/productimage/electric-kettle.jpg"
                alt="Home & Kitchen"
              />
              <h3>Home & Kitchen</h3>
            </div>
          </Link>

          <Link to="/category/Sports & Fitness" className="find-card">
            <div className="find-card">
              <img src="/productimage/dumbbell-set.jpg" alt="Gym & Fitness" />{" "}
              <h3>Gym & Fitness</h3>
            </div>
          </Link>

          <Link to="/category/Toys" className="find-card">
            <div className="find-card">
              <img src="/productimage/kids-drawing-kit.jpg" alt="Toys" />{" "}
              <h3>Toys</h3>
            </div>
          </Link>
        </div>
      </section>

      <section className="vision-section">
        <div className="vision-icon">🌟</div>

        <p>OUR VISION</p>

        <h2>
          Making Online Shopping
          <br />
          Simple for Everyone.
        </h2>

        <span>
          Our vision is to create a convenient digital shopping platform where
          customers can discover a wide variety of products through a simple,
          modern, and enjoyable experience.
        </span>
      </section>
      <Footer />
    </div>
  );
}

export default About;
