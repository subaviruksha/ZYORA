import "./Footer.css";

function Footer() {
    return (
        <footer className="footer">

            <div className="footer-container">

                {/* Brand */}
                <div className="footer-brand">
                    <h2>ZYORA</h2>
                    <p>
                        Everything You Want,<br />
                        All in One Place.
                    </p>
                </div>

                {/* Shop */}
                <div className="footer-column">
                    <h3>Shop</h3>
                    <a href="/products">Mobiles</a>
                    <a href="/products">Laptops</a>
                    <a href="/products">Electronics</a>
                    <a href="/products">Fashion</a>
                </div>

                {/* Customer Care */}
                <div className="footer-column">
                    <h3>Customer Care</h3>
                    <a href="/contact">Contact Us</a>
                    <a href="/orders">My Orders</a>
                    <a href="/returns">Returns</a>
                    <a href="/help">Help Center</a>
                </div>

                {/* Company */}
                <div className="footer-column">
                    <h3>Company</h3>
                    <a href="/about">About ZYORA</a>
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/terms">Terms & Conditions</a>
                </div>

            </div>

            <div className="footer-bottom">
                <p>© 2026 ZYORA. All rights reserved.</p>
            </div>

        </footer>
    );
}

export default Footer;