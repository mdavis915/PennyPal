import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase"; // Import Firebase auth instance
import ScrollToTop from './components/ScrollToTop';
import Navbar from "./components/Navbar";  
import Home from "./components/Home";  
import DepositWithdraw from "./components/Transactions";  
import History from "./components/History";  
import Goals from "./components/Goals";  
import Login from "./components/Login";  
import "./App.css";  

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <div>
      {user ? (
        <>
        <ScrollToTop />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/deposit-withdraw" element={<DepositWithdraw />} />
            <Route path="/history" element={<History />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/help" element={<div>Help</div>} />
            <Route path="*" element={<Navigate to="/" />} /> {/* Redirect unknown paths to home */}
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} /> {/* Redirect all routes to login */}
        </Routes>
      )}
    </div>
  );
};

export default App;
