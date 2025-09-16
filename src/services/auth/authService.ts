import api from '../api';
import { signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase.config';

import { LoginCredentials, RegisterCredentials, AuthResponse } from '../../types/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const userCredencials = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    const user = userCredencials.user;
    const token = await user.getIdToken();
    localStorage.setItem('token', token);

    const response = await api.post<AuthResponse>('/auth/login');
    response.data.token = token;
    
    return response.data;
  },

  async register(credentials: any): Promise<AuthResponse> {
    console.log("enviando para o back...")
    const response = await api.post<AuthResponse>('/auth/registrar/cliente', credentials);
    if (response.data.token) {
      console.log(response);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await signOut(auth);
      await api.post('/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('Logout realizado com sucesso!');
    } catch (err: any) {
      console.error('Erro ao fazer logout:', err.message);
    }
  },

  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
};