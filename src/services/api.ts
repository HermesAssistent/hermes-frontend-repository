import axios from 'axios';

const API_URL = 'http://localhost:8090/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token às requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@App:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    alert("Erro ao enviar requisição");
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      
      localStorage.removeItem('@App:token');
      
      alert('Sessão expirada! Você será redirecionado para o login.');
      
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;