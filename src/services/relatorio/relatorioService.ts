import api from "../api";

export const relatorioService = {
   async downloadRelatorio(sinistroId: number): Promise<Blob> {
    const response = await api.get(`/relatorios/sinistro/${sinistroId}`, {
      responseType: 'blob', 
    });
    return response.data;
  },
}