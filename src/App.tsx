import React, { useState, useEffect } from 'react';
import Header from './pages/layout/Header';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { authService } from './services/auth/authService';
import './App.css';
import LoginSignupForm from './pages/auth/Login';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [showLogin, setShowLogin] = useState<boolean>(true);

  return <>
   <LoginSignupForm />
  
  </>
}

export default App;