import React, { useEffect, useState } from "react";

const LandingPage = () => {
  const [user, setUser] = useState({
    displayName: "",
    photoURL: "",
  });

  useEffect(() => {
    // Fetch user's information from your server here
    // Replace "http://localhost:3000" with your server URL
    fetch("http://localhost:3000/userInfo", {
      method: "GET",
      credentials: "include", // Include credentials if you're using cookies or sessions
    })
      .then((response) => response.json())
      .then((data) => {
        setUser({
          displayName: data.displayName,
          photoURL: data.photoURL,
        });
      })
      .catch((error) => {
        console.error("Error fetching user information:", error);
      });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {user.photoURL && (
        <img
          src={user.photoURL}
          alt={`${user.displayName}'s Avatar`}
          style={{ width: "100px", height: "100px", borderRadius: "50%" }}
        />
      )}
      <h1 style={{ marginTop: "20px" }}>Welcome, {user.displayName}</h1>
    </div>
  );
};

export default LandingPage;
