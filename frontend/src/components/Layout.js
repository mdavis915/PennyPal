import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./Home";
import Transactions from "./Transactions";
import Deposit from "./Deposit";
import Goals from "./Goals";
import Navbar from "./Navbar";

function Layout() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/auth"; // Hide navbar on login page

  return (
    <div>
      {!hideNavbar && <Navbar />}
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/goals" element={<Goals />} />
        </Routes>
      </div>
    </div>
  );
}

export default Layout;
