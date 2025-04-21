import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate for redirection
import { Link } from "react-router-dom"; // for navigation to Login page
import "./Inscription.css"; // Import du CSS

const Inscription = () => {
  const navigate = useNavigate(); // useNavigate hook for redirection
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    const signupData = {
      nom: username,
      email,
      motDePasse: password
    };

    try {
      const response = await fetch("http://localhost:9090/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(signupData)
      });

      const data = await response.json();
      if (response.ok) {
        navigate("/vision"); // Redirect to /vision after successful signup
      } else {
        alert("Erreur: " + data.message);
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
    }
  };

  return (
    <div className="container">
      <div className="signup-box">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div className="input-group">
            <span className="icon">&#128100;</span>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <span className="icon">&#128231;</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <span className="icon">&#128274;</span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="signup-btn">
            SIGN UP
          </button>
          <p>Or Sign Up Using</p>
          <div className="social-icons">
            <button className="facebook">F</button>
            <button className="twitter">T</button>
            <button className="google">G</button>
          </div>
          <p>Already have an account?</p>
          <Link to="/login" className="login-link">
            LOGIN
          </Link>
        </form>
      </div>
      <div className="image-right">
        <img src="./images/leftedu.png" alt="Education" />
      </div>
    </div>
  );
};

export default Inscription;
