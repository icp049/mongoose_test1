import React, { useState } from "react";
import axios from "axios"; // Make sure to install axios: npm install axios
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });

      if (response.status === 200) {
        // Authentication successful, navigate to the landing page
        navigate("/landingpage");
      } else {
        setErr(true);
      }
    } catch (err) {
      console.log(err);
      setErr(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Prototype</span>
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="email" required />
          <input type="password" placeholder="password" required />
          <button disabled={loading}>Sign in</button>
          {loading && "Logging in, please wait..."}
          {err && <span>Authentication failed. Please check your credentials.</span>}
        </form>
        <p>
          You don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
