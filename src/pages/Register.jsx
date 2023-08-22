import React, { useState } from "react";
import Add from "../img/addAvatar.png";
import axios from "axios"; // Make sure to install axios: npm install axios
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      const formData = new FormData();
      formData.append("displayName", displayName);
      formData.append("email", email);
      formData.append("password",password)
      formData.append("avatar", file);

      // Make a POST request to your server's registration endpoint
      await axios.post("http://localhost:3000/register", formData);

      // Registration successful, navigate to another page
      navigate("/");
    } catch (err) {
      console.log(err);
      setErr(true);
      setLoading(false);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Prototype Register</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input required type="text" placeholder="display name" />
          <input required type="email" placeholder="email" />
          <input required type="password" placeholder="password" />
          <input required style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span>Add an avatar</span>
          </label>
          <button disabled={loading}>Sign up</button>
          {loading && "Uploading and processing the image, please wait..."}
          {err && <span>Something went wrong</span>}
        </form>
        <p>
          You have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
