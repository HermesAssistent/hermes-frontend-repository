import api from "../api";

export const oficinaService = {
 
  async listarOficinas() {
     const response = await api.get(`/oficinas`);
     return response.data;
  }
}