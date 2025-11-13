import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from './routes/AppRoutes.jsx';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import { ClinicStatusProvider } from "./context/ClinicStatusContext";


function App() {
  return (
  <Router>
    <AuthProvider>
      <ClinicStatusProvider>
        <AppRoutes />
      </ClinicStatusProvider>
    </AuthProvider>
  </Router>
  );
}

export default App
