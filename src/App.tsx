import React, { useState, useEffect } from 'react';
import Header from './pages/layout/Header';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { authService } from './services/auth/authService';
import './App.css';
import LoginSignupForm from './pages/auth/Login';
import ChatPage from './pages/chat';
import { AppRouter } from './routes';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase.config';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [showLogin, setShowLogin] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Carregando...</div>;

  return <>
     <AppRouter />
  </>
}

export default App;