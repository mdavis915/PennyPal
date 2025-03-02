import React from "react";
import { Link } from "react-router-dom";
import '../App.css';  // Ensure the path to App.css is correct

function Navbar() {
  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/deposit" className="nav-link">Manage Funds</Link>
        <Link to="/transactions" className="nav-link">Transaction History</Link>
        <Link to="/goals" className="nav-link">Goals</Link>
        <Link to="/help" className="nav-link">Help</Link>
      </nav>
    </header>
  );
}

export default Navbar;
