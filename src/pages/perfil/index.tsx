import React, { useState, useEffect } from 'react';
import { User, Car, Shield, Phone, Mail, MapPin, Edit2, Save, X, Link, ArrowLeft } from 'lucide-react';
import { clienteService } from '../../services/cliente/clienteService';
import { useAuth } from '../../services/contexts/AuthContext';
import { seguradoraService } from '../../services/seguradora/seguradoraService';

interface Usuario {
  id: number;
  uid: string;
  nome: string;
  login: string;
  email: string;
  endereco: string;
  telefone: string;
  celular: string;
  role: string;
}

interface Seguradora {
  id: number;
  cnpj: string;
  contato: string;
  usuario: Usuario;
  razaoSocial: string;
}

interface Cliente {
  id: number;
  cpf: string;
  veiculo: string;
  latitude: number;
  longitude: number;
  usuario: Usuario;
  seguradora?: Seguradora;
}

const PerfilCliente = () => {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showSeguradoraSelect, setShowSeguradoraSelect] = useState(false);
  const [seguradoras, setSeguradoras] = useState<Seguradora[]>([]);
  const [seguradoraSelecionada, setSeguradoraSelecionada] = useState<number | null>(null);
  const {user, clienteId} = useAuth()
  
  const [formData, setFormData] = useState({
    cpf: '',
    veiculo: '',
    nome: '',
    endereco: '',
    telefone: '',
    celular: '',
  });

  const loadSeguradoras = async () => {
    const seguradorasResponse = await seguradoraService.listarSeguradorasParaClientes();
    return seguradorasResponse;
  }

  useEffect(() => {
    
  }, []);
  
  async function loadCliente() {
    const clienteIdBusca = clienteId || localStorage.getItem('@App:clienteId')
    const clienteResponse = await clienteService.listarClienteById(String(clienteIdBusca || ''))
    return clienteResponse
  }
  
  useEffect(() => {

    setLoading(true)

    loadCliente().then((mockCliente) => {
    setCliente(mockCliente);
    setSeguradoraSelecionada(mockCliente.seguradora);
    setFormData({
        cpf: mockCliente.cpf,
        veiculo: mockCliente.veiculo,
        nome: mockCliente.usuario.nome,
        endereco: mockCliente.usuario.endereco,
        telefone: mockCliente.usuario.telefone,
        celular: mockCliente.usuario.celular,
    })}).finally(() => 
       {
         loadSeguradoras().then((data) => {
           setSeguradoras(data);
           
         }).finally(() => {
           setLoading(false);
         });
       }
    );

  }, []);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    if (cliente) {
      setFormData({
        cpf: cliente.cpf,
        veiculo: cliente.veiculo,
        nome: cliente.usuario.nome,
        endereco: cliente.usuario.endereco,
        telefone: cliente.usuario.telefone,
        celular: cliente.usuario.celular,
      });
    }
    setEditMode(false);
  };

  const handleSave = () => {
    // TODO: Implementar chamada à API para atualizar
    // api.put('/cliente/perfil', formData)
    console.log('Salvando:', formData);
    setEditMode(false);
  };

  const handleVincularSeguradora = () => {
    if (seguradoraSelecionada) {
      
      clienteService.vincularClienteComSeguradora(String(seguradoraSelecionada), String(cliente?.id || '')).then(() => {
     
      const seguradora = seguradoras.find(s => s.id === seguradoraSelecionada);
      if (seguradora && cliente) {
        setCliente({ ...cliente, seguradora });
      }
      
      setShowSeguradoraSelect(false);
      setSeguradoraSelecionada(null);      
     
    }).catch((error) => {
        console.error('Erro ao vincular seguradora:', error);
        alert('Erro ao vincular seguradora. Tente novamente.');
    });
    }
  };

  const handleDesvincularSeguradora = () => {
    clienteService.desvincularClienteComSeguradora(String(cliente?.id || '')).then(() => {
        if (cliente) {
            setCliente({ ...cliente, seguradora: undefined });
         }
        }).catch((error) => {
            console.error('Erro ao desvincular seguradora:', error);
            alert('Erro ao desvincular seguradora. Tente novamente.');
        });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-gray-600">Cliente não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Botão Voltar */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Voltar</span>
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="bg-white rounded-full p-2 shadow-lg">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">{cliente.usuario.nome}</h1>
                  <p className="text-blue-100 mt-1">{cliente.usuario.email}</p>
                </div>
              </div>
              {/*!editMode ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-2 bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors shadow-md font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Editar Perfil</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-md"
                  >
                    <Save className="w-4 h-4" />
                    <span>Salvar</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 bg-white text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors shadow-md"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancelar</span>
                  </button>
                </div>
              )*/}
            </div>
          </div>
        </div>

        {/* Informações Pessoais */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <User className="w-6 h-6 mr-2 text-blue-600" />
            Informações Pessoais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Nome Completo</label>
              {editMode ? (
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-800 font-medium">{cliente.usuario.nome}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">CPF</label>
              {editMode ? (
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-800 font-medium">{cliente.cpf}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                Email
              </label>
              <p className="text-gray-800 font-medium">{cliente.usuario.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                Celular
              </label>
              {editMode ? (
                <input
                  type="text"
                  value={formData.celular}
                  onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-800 font-medium">{cliente.usuario.celular}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                Telefone
              </label>
              {editMode ? (
                <input
                  type="text"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-800 font-medium">{cliente.usuario.telefone}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Endereço
              </label>
              {editMode ? (
                <input
                  type="text"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-800 font-medium">{cliente.usuario.endereco}</p>
              )}
            </div>
          </div>
        </div>

        {/* Veículo */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Car className="w-6 h-6 mr-2 text-blue-600" />
            Veículo
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Modelo do Veículo</label>
            {editMode ? (
              <input
                type="text"
                value={formData.veiculo}
                onChange={(e) => setFormData({ ...formData, veiculo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800 font-medium">{cliente.veiculo}</p>
            )}
          </div>
        </div>

        {/* Seguradora */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-blue-600" />
              Seguradora
            </h2>
          </div>
          
          {cliente.seguradora ? (
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">{cliente.seguradora.usuario.nome}</h3>
                <button
                  onClick={handleDesvincularSeguradora}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Desvincular
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">CNPJ</p>
                  <p className="text-gray-800 font-medium">{cliente.seguradora.cnpj}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contato</p>
                  <p className="text-gray-800 font-medium">{cliente.seguradora.contato}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-gray-800 font-medium">{cliente.seguradora.usuario.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Telefone</p>
                  <p className="text-gray-800 font-medium">{cliente.seguradora.usuario.telefone}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Nenhuma seguradora vinculada</p>
                <p className="text-sm text-gray-500 mb-4">Vincule uma seguradora para ter acesso a benefícios exclusivos</p>
                {!showSeguradoraSelect && (
                  <button
                    onClick={() => setShowSeguradoraSelect(true)}
                    className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Link className="w-4 h-4" />
                    <span>Adicionar Seguradora</span>
                  </button>
                )}
              </div>
              
              {showSeguradoraSelect && (
                <div className="border border-gray-300 rounded-lg p-6 bg-blue-50">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecione a seguradora
                  </label>
                  <select
                    value={seguradoraSelecionada || ''}
                    onChange={(e) => setSeguradoraSelecionada(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 bg-white"
                  >
                    <option value="">Escolha uma seguradora...</option>
                    {seguradoras.map((seg) => (
                      <option key={seg.id} value={seg.id}>
                        {seg.razaoSocial} - CNPJ: {seg.cnpj}
                      </option>
                    ))}
                  </select>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={handleVincularSeguradora}
                      disabled={!seguradoraSelecionada}
                      className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                      <span>Confirmar Vínculo</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowSeguradoraSelect(false);
                        setSeguradoraSelecionada(null);
                      }}
                      className="flex items-center justify-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancelar</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerfilCliente;