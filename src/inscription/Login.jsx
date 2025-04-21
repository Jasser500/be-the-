import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Add Link import
import "./Login.css"; // Import du CSS

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      email,
      motDePasse: password,
    };

    try {
      const response = await fetch("http://localhost:9090/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      if (response.ok) {
        // Sauvegarder le token ou d'autres infos si nécessaire
        localStorage.setItem("token", data.token);
        navigate("/vision"); // Redirige vers la page 'vision'
      } else {
        alert("Erreur: " + data.message);
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
    }
  };

  return (
    <div className="container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
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
          <button type="submit" className="login-btn">
            LOGIN
          </button>
          <p>Or Sign In Using</p>
          <div className="social-icons">
            <button className="facebook">F</button>
            <button className="twitter">T</button>
            <button className="google">G</button>
          </div>
          <p>Don't have an account?</p>
          <Link to="/inscription" className="signup-link">
            SIGN UP
          </Link>
        </form>
      </div>
      <div className="image-right">
        <img src="./images/leftedu.png" alt="Education" />
      </div>
    </div>
  );
};

export default Login;
