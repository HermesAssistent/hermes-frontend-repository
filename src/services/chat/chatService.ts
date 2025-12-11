import api from "../api";

export const chatService = {
 
async iniciarChat(userId: string) {
    const tipoSinistro = localStorage.getItem('tipoSinistro')
    const response = await api.post(`/chat/iniciar`, null, {
      params: { userId, tipoSinistro },
    });
    if (response.data) {
      localStorage.setItem('sessionId', response.data?.sessionId)
    }
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
    
  async listarMensagens(sessionId: string) {
    const response = await api.get(`/chat/listar-mensagens/${sessionId}`);
    return response.data;
  },

  async uploadFoto(file: File, sessionId: string) {
    const formData = new FormData();
    formData.append("arquivo", file);
    formData.append("sessionId", sessionId);

    const response = await api.post("/fotos/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },
}