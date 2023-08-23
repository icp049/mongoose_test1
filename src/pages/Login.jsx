import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [err, setErr] = useState("");
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

      // If the response is successful, the server has handled the authentication.
      // You can directly navigate to the landing page on the server's response.
    } catch (err) {
      console.log(err);
      if (err.response && err.response.data.message) {
        setErr(err.response.data.message); // Display the error message from the server
      } else {
        setErr("Authentication failed. Please check your credentials.");
      }
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
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button disabled={loading}>Sign in</button>
          {loading && "Logging in, please wait..."}
          {err && <span>{err}</span>} {/* Display the error message */}
        </form>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
