import api from "../api";

export const clienteService = {
 
  async listarClienteById(userId: string) {
     const response = await api.get(`/clientes/${userId}`);
     return response.data;
  },
  async listarClientes() {
     const response = await api.get(`/clientes`);
     return response.data;
  },
  async listarClienteBySeguradoraId(seguradoraId: string) {
     const response = await api.get(`/clientes/seguradora/${seguradoraId}`);
     return response.data;
  },
   async desvincularClienteComSeguradora(clienteId: string) {
     const response = await api.put(`/clientes/desvincular-seguradora/${clienteId}`);
     return response.data;
  },
   async vincularClienteComSeguradora(seguradoraId: string, clienteId: string) {
     const response = await api.put(`/clientes/vincular-seguradora/${seguradoraId}/${clienteId}`);
     return response.data;
  },
}