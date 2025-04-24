import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated React 18 syntax
import './index.css'; // Or your CSS file
import App from './App'; // Your main app component
import { ThemeProvider, createTheme } from '@mui/material/styles'; // If you're using Material UI
import 'bootstrap/dist/css/bootstrap.min.css'; // If you're using Bootstrap
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter for routing

// Create a theme (optional)
const theme = createTheme({
  // Customize your theme if needed
});

// Rendering the app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>  {/* Wrap App with BrowserRouter */}
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
