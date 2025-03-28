
import React from "react";
import "./Inscription.css"; // Import du CSS
import { Link } from "react-router-dom";
const Inscription = () => {
  return (
    
    <div className="container">
      <div className="signup-box">
        <h2>Sign Up</h2>
        <form>
          <div className="input-group">
            <span className="icon">&#128100;</span>
            <input type="text" placeholder="Type your username" />
          </div>
          <div className="input-group">
            <span className="icon">&#128231;</span>
            <input type="email" placeholder="Type your email" />
          </div>
          <div className="input-group">
            <span className="icon">&#128274;</span>
            <input type="password" placeholder="Type your password" />
          </div>
          <button type="submit" className="signup-btn">SIGN UP</button>
          <p>Or Sign Up Using</p>
          <div className="social-icons">
            <button className="facebook">F</button>
            <button className="twitter">T</button>
            <button className="google">G</button>
          </div>
          <p>Already have an account?</p>
          <Link to="/login" className="login-link">LOGIN</Link>
           
        </form>
        
      </div>
      <div className="image-right">
          <img src="./images/leftedu.png" alt="Education" />
        </div>
    </div>
  );
};

export default Inscription;
