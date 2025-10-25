import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Tipos
export interface User {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  endereco?: string;
  role?: string;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

// Criação do contexto
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Provider
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega dados do localStorage ao iniciar
  useEffect(() => {
    const loadStorageData = () => {
      try {
        const storedUser = localStorage.getItem('@App:user');
        const storedToken = localStorage.getItem('@App:token');

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStorageData();
  }, []);

  // Função de login
  const login = (userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    
    // Salva no localStorage
    localStorage.setItem('@App:user', JSON.stringify(userData));
    localStorage.setItem('@App:token', userToken);
  };

  // Função de logout
  const logout = () => {
    setUser(null);
    setToken(null);
    
    // Remove do localStorage
    localStorage.removeItem('@App:user');
    localStorage.removeItem('@App:token');
  };

  // Função para atualizar dados do usuário
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      // Atualiza no localStorage
      localStorage.setItem('@App:user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar o contexto
export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
}