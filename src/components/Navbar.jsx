import React from 'react';
import { AppBar, Toolbar, Button, Typography, Box, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#74c69d' }}>
      <Toolbar>
        <Container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* 🟢 Clickable PennyPal title */}
          <Typography
            variant="h6"
            component={Link}
            to="/home"
            sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}
          >
            PennyPal
          </Typography>

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" component={Link} to="/home">Home</Button>
            <Button color="inherit" component={Link} to="/deposit-withdraw">Manage Funds</Button>
            <Button color="inherit" component={Link} to="/history">Transactions</Button>
            <Button color="inherit" component={Link} to="/goals">Goals</Button>
            <Button color="inherit" onClick={handleLogout}>Log Out</Button>
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
