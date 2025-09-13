

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface User {
  id?: number;
  email: string;
  name: string;
}

export interface Message {
  id: number;
  text: string;
  sender: "USER" | "BOT";
}

export interface Sinistro {
  id: number;
  problema: string;
  local: string;
  data: string; 
  hora: string;
  modeloVeiculo: string;
  anoFabricacao: string; 
  placa: string;
  danosVeiculo: string;
  outrosEnvolvidos: boolean;
  feridos: boolean;
  possuiSeguro: boolean;
  seguradora: string;
  cobertura: string;
  gravidade: string;
  condicoesClimaticas: string;
  condicoesVia: string;
  testemunhas: string;
  autoridadesAcionadas: string;
  veiculoImobilizado: string;
  categoriaProblema: string;
}
