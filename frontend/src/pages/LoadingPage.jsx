
import "./LoadingPage.css";

function LoadingPage() {
  return (
    <div className="zyora-loader">
      <div className="loader-glow glow-one"></div>
      <div className="loader-glow glow-two"></div>

      <div className="loader-content">
        <div className="loader-icon">
          <div className="loader-ring"></div>
          <span>🛍️</span>
        </div>

        <h1>ZYORA</h1>

        <p className="loader-tagline">
          More Shopping. More Savings.
        </p>

        <div className="loader-spinner"></div>

        <p className="loader-message">
          Preparing your shopping experience...
        </p>

        <div className="loader-progress">
          <div className="loader-progress-bar"></div>
        </div>

        <span className="loader-footer">
          Thank you for shopping with us 💜
        </span>
      </div>
    </div>
  );
}

export default LoadingPage;
