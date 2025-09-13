import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/home";
import ChatPage from "../pages/chat";
import LoginSignupForm from "../pages/auth/Login";
import SinistroViewer from "../pages/sinistro";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase.config";

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
        <Route path="/login" element={<LoginSignupForm />} />
        <Route path="/sinistro" element={<SinistroViewer />} />
      </Routes>
    </Router>
  );
};
