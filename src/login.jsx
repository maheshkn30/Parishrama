import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Handle form submission (example)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "admin@gmail.com" && password === "test1234") {
      // If credentials are correct, navigate to home page
      navigate("/home"); // Redirect to the homepage route
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoContainer}>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHXpjA5zpG8dYJ_XLb79HvcX2LjNIYyMB7Og&s" // Logo
            alt="Logo"
            style={styles.logo}
          />
        </div>
        <h2 style={styles.title}>Welcome Admin!</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(to right,rgb(228, 94, 64) ,rgb(208, 250, 115) )",
    backgroundSize: "cover", // This makes the image cover the entire container
    backgroundPosition: "center", // Ensures the image is centered
    animation: "fadeIn 1.5s ease-out",
  },

  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    width: "300px",
    animation: "zoomIn 0.5s ease-out",
  },
  logoContainer: {
    marginBottom: "20px",
  },
  logo: {
    width: "190px",
    height: "40px",
    objectFit: "cover",
    border: "2px",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "14px",
    transition: "0.3s",
  },
  button: {
    padding: "12px",
    backgroundColor: "#fa5252",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s ease",
  },
};

export default LoginPage;
