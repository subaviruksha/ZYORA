
import React from "react";
import "./DiscountBanner.css";

function DiscountBanner() {
  return (
    <section className="discount-banner">
      <div className="discount-content">
        <span className="discount-tag">
          ✨ EXCLUSIVE MEMBER OFFERS
        </span>

        <h2>
          More Shopping, <span>More Savings!</span>
        </h2>

        <p className="discount-description">
          Enjoy special discounts on your shopping journey
          with ZYORA.
        </p>

        <div className="discount-offers">
          <div className="discount-offer-card">
            <span className="discount-percentage">10%</span>
            <div>
              <h3>OFF</h3>
              <p>Your First Order</p>
            </div>
          </div>

          <div className="discount-divider"></div>

          <div className="discount-offer-card">
            <span className="discount-percentage">5%</span>
            <div>
              <h3>OFF</h3>
              <p>3rd, 5th, 7th Order & More</p>
            </div>
          </div>
        </div>

        <p className="discount-note">
          *Discounts are applied automatically at checkout
          on eligible orders.
        </p>
      </div>

      <div className="discount-decoration">
        <div className="discount-circle">
          <span className="discount-gift">🎁</span>
          <span className="discount-sparkle">✦</span>
          <span className="discount-sparkle sparkle-two">✧</span>
        </div>
        <div className="discount-floating-tag">
          SHOP & SAVE
        </div>
      </div>
    </section>
  );
}

export default DiscountBanner;
