import api from '../api';
import { signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase.config';

import { LoginCredentials, RegisterCredentials, AuthResponse } from '../../types/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const userCredencials = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    const user = userCredencials.user;
    const token = await user.getIdToken();
    localStorage.setItem('@App:token', token);
    const response = await api.post<AuthResponse>('/auth/login');
    response.data.token = token;
    return response.data;
  },

  async register(credentials: any, userType: 'cliente' | 'seguradora'): Promise<AuthResponse> {
    console.log("enviando para o back...")
    const response = await api.post<AuthResponse>(`/auth/registrar/${userType}`, credentials);
    if (response.data.token) {
      console.log(response);
      localStorage.setItem('@App:token', response.data.token);
      localStorage.setItem('@App:user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async logout(id: string): Promise<void> {
    try {
      await signOut(auth);
      await api.post(`/auth/logout/${id}`);
      localStorage.removeItem('@App:token');
      localStorage.removeItem('@App:user');      console.log('Logout realizado com sucesso!');
    } catch (err: any) {
      console.error('Erro ao fazer logout:', err.message);
    }
  },

  getCurrentUser(): any {
    const userStr = localStorage.getItem('@App:user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('@App:token');
  }
};