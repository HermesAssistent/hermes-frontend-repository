import api from "../api";

export const seguradoraService = {
 
  async listarSeguradoras() {
     const response = await api.get(`/seguradora`);
     return response.data;
  },

  async listarSeguradorasParaClientes() {
     const response = await api.get(`/seguradora/listar-para-clientes`);
     return response.data;
  },
  async findSeguradoraById(seguradoraId: string) {
     const response = await api.get(`/seguradora/`+ seguradoraId);
     return response.data;
  },
  async listarClientesDaSeguradora(seguradoraId: string) {
     const response = await api.get(`/seguradora/`+ seguradoraId + `/clientes`);
     return response.data;
  },
}