import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./login"; // Import the Login component
import PdfReader from "./pdf";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/home" element={<App />} />
        <Route path="/" element={<Login />} /> {/* Add the login route */}
        <Route path="/addquestion" element={<PdfReader />} />{" "}
        {/* Add the login route */}
      </Routes>
    </Router>
  </React.StrictMode>
);
