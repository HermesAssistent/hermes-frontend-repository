import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Car, MapPin, Shield } from 'lucide-react';
import { useAuth } from '../../../services/contexts/AuthContext';
import { seguradoraService } from '../../../services/seguradora/seguradoraService';

interface Usuario {
  id: number;
  nome: string;
  email: string;
}

interface Seguradora {
  id: number;
  nome: string;
  cnpj: string;
}

interface Cliente {
  id: number;
  cpf: string;
  veiculo: string;
  usuario: Usuario;
  seguradora: Seguradora;
  latitude: number;
  longitude: number;
}

export default function ListaClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const {seguradoraId} = useAuth();

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const idSeguradora = localStorage.getItem('@App:seguradoraId');
      const response = await seguradoraService.listarClientesDaSeguradora(String(idSeguradora));
      
      setClientes(response || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    window.history.back();
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatCoord = (coord: number) => {
    return coord?.toFixed(6) || 'N/A';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
          <p className="mt-4 text-green-700 font-medium">Carregando clientes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-red-500 text-center">
            <p className="text-lg font-semibold mb-2">Erro ao carregar dados</p>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={fetchClientes}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleVoltar}
            className="flex items-center gap-2 text-green-700 hover:text-green-900 font-medium mb-4 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-green-800 flex items-center gap-3">
              <Shield className="w-8 h-8" />
              Clientes da Seguradora
            </h1>
            <p className="text-gray-600 mt-2">
              Total de {clientes.length} cliente{clientes.length !== 1 ? 's' : ''} cadastrado{clientes.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Lista de Clientes */}
        {clientes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Nenhum cliente encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clientes.map((cliente) => (
              <div
                key={cliente.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 border-t-4 border-green-500"
              >
                {/* Usuário Info */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <User className="w-6 h-6 text-green-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800">{cliente.usuario.nome}</h3>
                    <p className="text-sm text-gray-500">{cliente.usuario.email}</p>
                  </div>
                </div>

                {/* Dados do Cliente */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="font-medium text-sm">CPF:</span>
                    <span className="text-sm">{formatCPF(cliente.cpf)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-700">
                    <Car className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{cliente.veiculo}</span>
                  </div>

                  {/* Localização */}
                  <div className="bg-green-50 rounded-lg p-3 mt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-green-700" />
                      <span className="font-medium text-sm text-green-800">Localização</span>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>Lat: {formatCoord(cliente.latitude)}</div>
                      <div>Long: {formatCoord(cliente.longitude)}</div>
                    </div>
                  </div>

                  {/* Seguradora */}
                  <div className="border-t pt-3 mt-3">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Seguradora</p>
                        <p className="font-medium text-sm text-gray-800">{cliente.seguradora.nome}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}