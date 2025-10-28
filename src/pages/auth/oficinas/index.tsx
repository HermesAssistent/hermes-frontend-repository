import React, { useState, useEffect, use } from 'react';
import { ArrowLeft, Phone, MapPin, Wrench, Link } from 'lucide-react';
import { useNavigate, useNavigation } from 'react-router-dom';
import { oficinaService } from '../../../services/oficinas/oficinaService';

// Tipos
interface Oficina {
  id: number;
  nome: string;
  telefone: string;
  endereco: string;
  latitude: number;
  longitude: number;
  especialidades: string[];
}

const ListaOficinas: React.FC = () => {
  const [oficinas, setOficinas] = useState<Oficina[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    carregarOficinas();
  }, []);

  const carregarOficinas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await oficinaService.listarOficinas();
      setOficinas(data);
    } catch (err) {
      setError("Erro ao carregar oficinas. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    navigate('/')
  };

  const handleVincular = (oficina: Oficina) => {
    console.log("Vincular oficina:", oficina);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleVoltar}
              className="p-2 hover:bg-green-700 rounded-lg transition-colors"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Oficinas</h1>
              <p className="text-green-100 text-sm">
                Gerencie e vincule oficinas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
            <p className="text-red-700">{error}</p>
            <button
              onClick={carregarOficinas}
              className="mt-2 text-red-600 hover:text-red-800 underline text-sm"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !error && oficinas.length === 0 && (
          <div className="text-center py-20">
            <Wrench className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Nenhuma oficina encontrada</p>
          </div>
        )}

        {!loading && !error && oficinas.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Telefone
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Endereço
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Especialidades
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {oficinas.map((oficina) => (
                    <tr key={oficina.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Wrench className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">
                              {oficina.nome}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-700">
                          <Phone className="h-4 w-4 text-gray-400 mr-2" />
                          <a
                            href={`tel:${oficina.telefone}`}
                            className="hover:text-green-600 transition-colors"
                          >
                            {oficina.telefone}
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start text-sm text-gray-700 max-w-xs">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{oficina.endereco}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-sm">
                          {oficina.especialidades.map((esp, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {esp}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleVincular(oficina)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                        >
                          <Link className="h-4 w-4" />
                          Vincular
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListaOficinas;