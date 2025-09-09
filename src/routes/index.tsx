import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/home";
import ChatPage from "../pages/chat";
import LoginSignupForm from "../pages/auth/Login";

export const AppRouter: React.FC = () => {
  return (
    <Router>
      {/*colocar navbar aqui depois */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/login" element={<LoginSignupForm />} />
      </Routes>
    </Router>
  );
};
