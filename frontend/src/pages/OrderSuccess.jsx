import { Link } from "react-router-dom";
import "./OrderSuccess.css";

function OrderSuccess() {

    return (

        <div className="order-success-page">

            <div className="success-card">

                <div className="success-icon">
                    ✓
                </div>

                <p className="success-label">
                    ZYORA
                </p>

                <h1>
                    Order Placed Successfully!
                </h1>

                <p className="success-text">
                    Thank you for shopping with ZYORA.
                    Your order has been placed successfully.
                </p>

                <div className="success-actions">

                    <Link to="/products">
                        <button className="continue-btn">
                            Continue Shopping
                        </button>
                    </Link>

                    <Link to="/">
                        <button className="home-btn">
                            Back to Home
                        </button>
                    </Link>

                </div>

            </div>

        </div>

    );

}

export default OrderSuccess;