import React, { useState, useEffect } from 'react';
import './App.css';
import { AppRouter } from './routes';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase.config';
import { AuthProvider } from './services/contexts/AuthContext';

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
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </>
}

export default App;