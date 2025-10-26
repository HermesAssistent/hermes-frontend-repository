import React, { JSX, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/home";
import ChatPage from "../pages/chat";
import LoginSignupForm from "../pages/auth/Login";
import SinistroViewer from "../pages/sinistro";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase.config";
import PerfilCliente from "../pages/perfil";
import AuthContainer from "../pages/auth/AuthContainer";
import ChatSQL from "../pages/auth/chat_seguradora";
import HermesDashboard from "../pages/auth/dashboards";

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return user ? children : <Navigate to="/login" replace />;
};

export const AppRouter: React.FC = () => {
  return (
    <Router>
      {/*colocar navbar aqui depois */}
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<AuthContainer />} />
        <Route 
          path="/sinistro" 
          element={
            <ProtectedRoute>
              <SinistroViewer />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/perfil" 
          element={
            <ProtectedRoute>
              <PerfilCliente />
            </ProtectedRoute>
          } 
        />
         <Route 
          path="/chat-seguradora" 
          element={
            <ProtectedRoute>
              <ChatSQL />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboards" 
          element={
            <ProtectedRoute>
              <HermesDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
};
