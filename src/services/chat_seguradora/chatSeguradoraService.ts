import api from "../api";

export const chatSeguradoraService = {
 
  async perguntar(pergunta: string) {
     const response = await api.get(`/chat-sql/${pergunta}`);
     return response;
  }
  
}