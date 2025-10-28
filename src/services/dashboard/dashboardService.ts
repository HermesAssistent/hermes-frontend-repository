import api from "../api";


export interface DashboardStats {
  totalClientes: number;
  totalSinistros: number;
  totalOficinas: number;
  sinistrosComFeridos: number;
  sinistrosAtivos: number;
  gravidade: {
    baixa: number;
    moderada: number;
    alta: number;
  };
}

export interface SinistroMensal {
  mes: string;
  sinistros: number;
}

export interface SinistroRecente {
  id: number;
  cliente: string;
  veiculo: string;
  data: string;
  gravidade: string;
  status: string;
}

export interface SinistroCategoria {
  categoria: string;
  qtd: number;
}

export const dashboardService = {
 
  async getStats(): Promise<DashboardStats> {
    try {
      const response = await api.get<DashboardStats>(`/dashboard/stats`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
  },

  async getSinistrosMensais(meses: number = 6): Promise<SinistroMensal[]> {
    try {
      const response = await api.get<SinistroMensal[]>(
        `dashboard/sinistros-mensais`,
        { params: { meses } }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar sinistros mensais:', error);
      throw error;
    }
  },

  async getSinistrosRecentes(limit: number = 10): Promise<SinistroRecente[]> {
    try {
      const response = await api.get<SinistroRecente[]>(
        `dashboard/sinistros-recentes`,
        { params: { limit } }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar sinistros recentes:', error);
      throw error;
    }
  },

  async getSinistrosPorCategoria(): Promise<SinistroCategoria[]> {
    try {
      const response = await api.get<SinistroCategoria[]>(
        `/dashboard/sinistros-categoria`
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar sinistros por categoria:', error);
      throw error;
    }
  }
}