import "./App.css";
import React from "react";
import { useNavigate } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <MenuBar />
      <Body />
      <Card />
      <Footer />
    </div>
  );
}

function MenuBar() {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div className="logo">
        <img
          src="https://parishramaneetacademy.com/wp-content/uploads/2023/05/Parishrama-NEET-ENGLISH-copy-300x111.webp"
          alt="mn"
          style={{ width: "100%", height: "10vh" }}
        />
      </div>
      <div className="menu-toggle">&#9776;</div>
      <ul className="menu">
        <li>Home</li>
        <li>Tutorials</li>
        <li onClick={() => navigate("/addquestion")}>Question</li>
        <li>Contact</li>
      </ul>
    </div>
  );
}

function Body() {
  return (
    <div
      style={{
        width: "100vw",
        height: "90vh",
        backgroundColor: "#EDF2FC",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        position: "relative",
        animation: "fadeIn 1s ease-out", // Applying the fade-in effect to the entire page
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "46px",
          opacity: 0,
          fontWeight: "500",
          color: "#403F52",
          transform: "translateY(30px)",
          animation: "fadeInUp 1s forwards 0.5s", // Heading animation with fade-in and slide up
        }}
      >
        Create a Question Bank <span style={{ color: "#16A085" }}>Online</span>
      </h1>
      <p
        style={{
          textAlign: "center",
          marginTop: "40px",
          opacity: 0,
          fontSize: "20px",
          transform: "translateY(20px)",
          animation: "fadeInUp 1s forwards 1s",
        }}
      >
        <span style={{ color: "red", fontSize: "22px" }}>Parishrama</span> helps
        Colleges, coaching institutes, teachers and
        <br />
        tutors create question papers and online tests in minutes.
      </p>
      <button
        style={{
          width: "170px",
          height: "45px",
          border: "none",
          backgroundColor: "#339af0",
          borderRadius: "10px",
          color: "white",
          fontSize: "20px",
          marginTop: "100px",
          boxShadow: " rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          cursor: "pointer",
          transition: "transform 0.3s ease", // Smooth transition for scaling effect
          animation: "fadeInUp 1s forwards 1.5s", // Button animation with fade-in and slide up
        }}
        onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
      >
        Start Now
      </button>

      <style>
        {`
          /* Fade In Animation */
          @keyframes fadeIn {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }

          /* Fade In and Move Up Animation */
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(30px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}

const Card = () => {
  const cardStyle = {
    background: "linear-gradient(to right, #d6ff7f , #00b3cc)",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "950px",
    textAlign: "center",
    marginLeft: "220px",
    padding: "80px",
    height: "380px",
    marginBottom: "50px",
    overFlowY: "hidden",
  };

  const titleStyle = {
    fontSize: "18px",
    marginBottom: "10px",
    fontWeight: "600",
    color: "white",
  };

  const textStyle = {
    fontSize: "45px",
    fontWeight: "400",
    color: "white",
  };

  return (
    <>
      <div style={cardStyle}>
        <h2 style={titleStyle}>UNLIMITED FREE</h2>
        <p style={textStyle}>
          Create unlimited free papers <br />
          using NCERT questions.
        </p>
        <button
          style={{
            width: "170px",
            height: "45px",
            border: "none",
            background: "linear-gradient(to right,#cb5eee , #4be1ec)",
            borderRadius: "10px",
            color: "white",
            fontSize: "20px",
            marginTop: "20px",
            boxShadow: " rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
            cursor: "pointer",
            transition: "transform 0.3s ease",
            animation: "fadeInUp 1s forwards 1.5s",
          }}
        >
          <a
            href="https://parishramaneetacademy.com/"
            style={{ textDecoration: "none", color: "white" }}
          >
            {" "}
            Book Now!{" "}
          </a>
        </button>
      </div>
    </>
  );
};

export const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.content}>
        <p style={styles.text}>
          © 2025 Your Company Name. All rights reserved.
        </p>
        <div style={styles.links}>
          <a href="/privacy-policy" style={styles.link}>
            Privacy Policy
          </a>{" "}
          |
          <a href="/terms" style={styles.link}>
            {" "}
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#91a7ff",
    color: "#fff",
    textAlign: "center",
    padding: "20px 0",
    position: "relative",
    bottom: 0,
    width: "100%",
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
  },
  text: {
    marginBottom: "10px",
    fontSize: "14px",
  },
  links: {
    fontSize: "14px",
  },
  link: {
    color: "#f1faee",
    textDecoration: "none",
    margin: "0 8px",
  },
};

export default App;
