# PennyPal

PennyPal is a modern, single-page web application that helps users take control of their personal finances. It allows users to securely sign up and log in, deposit and withdraw funds, review a complete transaction history, and create, edit, or delete customizable savings goals—each with a visual progress bar. Built with React, Vite, Material-UI, and Firebase, PennyPal delivers a fast, responsive, and feature-rich experience.

---

## Features

- **Secure Authentication**  
  Sign up, log in, and log out using Firebase Authentication, with custom error messages for invalid credentials and weak passwords.

- **Real-Time Balance Management**  
  Deposit and withdraw funds in real time. Successful deposits trigger a celebratory coin-drop animation.

- **Transaction History**  
  View a chronological ledger of all deposits and withdrawals, stored in Cloud Firestore and updated live.

- **Savings Goals**  
  Create, edit, and delete savings goals. Each goal displays a linear progress bar showing progress toward the target amount.

- **Responsive UI**  
  Built with Material-UI’s Grid system and theming, PennyPal adapts smoothly to desktop and mobile viewports.

- **User Feedback & Error Handling**  
  Friendly snackbars and alerts guide users through successes and errors (e.g., “Insufficient funds,” “Incorrect username or password,” etc.).
