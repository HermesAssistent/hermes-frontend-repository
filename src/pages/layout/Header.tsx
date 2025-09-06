import React from 'react';
import { authService } from '../../services/auth/authService';

interface HeaderProps {
  isAuthenticated: boolean;
  user: any;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, user, onLogout }) => {
  const handleLogout = () => {
    authService.logout();
    onLogout();
  };

  return (
    <header className="header">
      <div className="container">
        <h1>Meu App</h1>
        {isAuthenticated && (
          <div className="user-menu">
            <span>Olá, {user?.name}</span>
            <button onClick={handleLogout}>Sair</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;