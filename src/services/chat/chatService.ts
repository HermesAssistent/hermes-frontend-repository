import api from "../api";

export const chatService = {
 
async iniciarChat(userId: string) {
    const response = await api.post(`/chat/iniciar`, null, {
      params: { userId },
    });
    return response.data;
  },

  async processarMensagem(userId: string, texto: string) {
    const response = await api.post(`/chat/processar`, null, {
      params: { userId, texto },
    });
    return response.data;
  },

  async listarSessoes() {
    const response = await api.get(`/chat/sessoes`);
    return response.data;
  },

  async limparSessao(userId: string) {
    const response = await api.delete(`/chat/limpar/${userId}`);
    return response.data;
  },
    
}