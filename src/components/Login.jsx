import React, { useState } from "react";
import { signUp, logIn } from "../firebase/auth";
import {
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
} from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      if (isSignup) {
        await signUp(email, password);
        alert("Account created successfully!");
      } else {
        await logIn(email, password);
        alert("Logged in successfully!");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Card elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            {isSignup ? "Create an Account" : "Welcome Back"}
          </Typography>

          {/* Toggle between Signup & Login */}
          <Box display="flex" justifyContent="center" mb={2}>
            <ToggleButtonGroup
              value={isSignup}
              exclusive
              onChange={() => setIsSignup(!isSignup)}
              color="primary"
            >
              <ToggleButton value={true}>Sign Up</ToggleButton>
              <ToggleButton value={false}>Log In</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          {/* Form Fields */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              {isSignup ? "Sign Up" : "Log In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
