import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Transactions from "./components/Transactions";
import Deposit from "./components/Deposit";
import Navbar from "./components/Navbar";
import Goals from "./components/Goals";
import AuthPage from "./components/AuthPage"; // Import the AuthPage component

function App() {
  return (
    <Router>
      {/* Navbar will now be displayed on every page */}
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/goals" element={<Goals />} />
          {/* Adding the AuthPage route */}
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
