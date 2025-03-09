import React from "react";
import { Link } from "react-router-dom";
import "./Login.css"; // Import du CSS
// Import correct de l'image

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-content">
        {/* Boîte de connexion */}
        <div className="login-box">
          <h2>Login</h2>
          <form>
            <div className="input-group">
              <span className="icon">&#128100;</span>
              <input type="text" placeholder="Type your username" />
            </div>
            <div className="input-group">
              <span className="icon">&#128274;</span>
              <input type="password" placeholder="Type your password" />
            </div>
            <a href="#" className="forgot-password">Forgot password?</a>
            <button type="submit" className="login-btn">LOGIN</button>

            <p className="social-text">Or Sign Up Using</p>

            <div className="social-icons">
              <a href="#" className="social-btn facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="social-btn twitter">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="#" className="social-btn google">
                <i className="bi bi-google"></i>
              </a>
            </div>

            <Link to="/inscription" className="signup-btn">SIGN UP</Link>
          </form>
        </div>

        {/* Image à droite */}
        <div className="image-right">
          <img src="./public/images/leftedu.png" alt="Education" />
        </div>
      </div>
    </div>
  );
};

export default Login;
