import api from "../api";

export const sinistroService = {
 
  async listarSinistrosById(userId: string) {
     const response = await api.get(`/sinistro/${userId}`);
     return response.data;
  },
}