import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">ResumeAnalyzer</div>
      <div className="nav-links">
        <Link to="/">Upload Resume</Link>
        <Link to="/history">History</Link>
      </div>
    </nav>
  );
}
