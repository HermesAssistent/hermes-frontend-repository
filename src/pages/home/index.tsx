import React, { useState } from "react";
import { User, MessageCircle, Settings, LogOut, Menu, X, BarChart3, Wrench, Users, Notebook } from "lucide-react";
import { authService } from '../../services/auth/authService';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../services/contexts/AuthContext";

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showTipoSinistro, setShowTipoSinistro] = useState(false);

  // Verifica se o usuário é da seguradora
  const isSeguradora = user?.role === 'SEGURADORA';

  // Define as cores baseado no tipo de usuário
  const colors = isSeguradora ? {
    primary: 'green',
    header: 'bg-green-600',
    headerHover: 'hover:bg-green-700',
    headerBorder: 'border-green-500',
    cardBorder: 'border-green-100',
    cardBorderHover: 'hover:border-green-300',
    cardBg: 'bg-green-100',
    iconText: 'text-green-600',
    button: 'bg-green-600',
    buttonHover: 'hover:bg-green-700',
    buttonBorder: 'border-green-600',
    buttonBorderHover: 'hover:bg-green-50',
    textButton: 'text-green-600'
  } : {
    primary: 'blue',
    header: 'bg-blue-600',
    headerHover: 'hover:bg-blue-700',
    headerBorder: 'border-blue-500',
    cardBorder: 'border-blue-100',
    cardBorderHover: 'hover:border-blue-300',
    cardBg: 'bg-blue-100',
    iconText: 'text-blue-600',
    button: 'bg-blue-600',
    buttonHover: 'hover:bg-blue-700',
    buttonBorder: 'border-blue-600',
    buttonBorderHover: 'hover:bg-blue-50',
    textButton: 'text-blue-600'
  };

  const handleLogout = () => {
    authService.logout(user?.id || '');
    navigate('/login');
  };

  const handleSelecionarTipoSinistro = async (tipo: string) => {
    localStorage.setItem("tipoSinistro", tipo);
    navigate('/chat');
  };


  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className={`${colors.header} text-white shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">Hermes</h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${colors.headerHover} transition-colors`}>
                <User className="w-5 h-5" />
                <span>Perfil</span>
              </button>
              <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${colors.headerHover} transition-colors`}>
                <Settings className="w-5 h-5" />
                <span>Configurações</span>
              </button>
              <button onClick={handleLogout} className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${colors.headerHover} transition-colors`}>
                <LogOut className="w-5 h-5" />
                <span>Sair</span>
              </button>
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden flex items-center"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className={`md:hidden py-4 border-t ${colors.headerBorder}`}>
              <div className="flex flex-col space-y-2">
                <button onClick={() => navigate('/perfil')} className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${colors.headerHover} transition-colors text-left`}>
                  <User className="w-5 h-5" />
                  <span>Perfil</span>
                </button>
                <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${colors.headerHover} transition-colors text-left`}>
                  <Settings className="w-5 h-5" />
                  <span>Configurações</span>
                </button>
                <button onClick={handleLogout} className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${colors.headerHover} transition-colors text-left`}>
                  <LogOut className="w-5 h-5" />
                  <span>Sair</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            {isSeguradora ? 'Painel da Seguradora' : 'Bem-vindo ao Hermes'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isSeguradora 
              ? 'Gerencie suas operações, acompanhe oficinas parceiras e monitore seus clientes.'
              : 'Sua plataforma de comunicação inteligente. Acesse suas opções de usuário ou inicie uma conversa no chat.'
            }
          </p>
        </div>

        {/* Feature Cards - Renderização Condicional */}
        {isSeguradora ? (
          // Cards para Seguradora
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div 
              onClick={() => navigate('/dashboards')}
              className={`bg-white border-2 ${colors.cardBorder} rounded-xl p-6 ${colors.cardBorderHover} hover:shadow-lg transition-all cursor-pointer`}
            >
              <div className={`w-12 h-12 ${colors.cardBg} rounded-lg flex items-center justify-center mb-4`}>
                <BarChart3 className={`w-6 h-6 ${colors.iconText}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Dashboards</h3>
              <p className="text-gray-600">Visualize métricas, relatórios e indicadores de desempenho.</p>
            </div>

            <div 
              onClick={() => navigate('/oficinas')}
              className={`bg-white border-2 ${colors.cardBorder} rounded-xl p-6 ${colors.cardBorderHover} hover:shadow-lg transition-all cursor-pointer`}
            >
              <div className={`w-12 h-12 ${colors.cardBg} rounded-lg flex items-center justify-center mb-4`}>
                <Wrench className={`w-6 h-6 ${colors.iconText}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Oficinas Parceiras</h3>
              <p className="text-gray-600">Gerencie a rede de oficinas credenciadas e parcerias.</p>
            </div>

            <div 
              onClick={() => navigate('/clientes-seguradora')}
              className={`bg-white border-2 ${colors.cardBorder} rounded-xl p-6 ${colors.cardBorderHover} hover:shadow-lg transition-all cursor-pointer`}
            >
              <div className={`w-12 h-12 ${colors.cardBg} rounded-lg flex items-center justify-center mb-4`}>
                <Users className={`w-6 h-6 ${colors.iconText}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Clientes</h3>
              <p className="text-gray-600">Acesse informações e histórico dos seus segurados.</p>
            </div>
          </div>
        ) : (
          // Cards para Cliente Normal
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div onClick={() => navigate('/perfil')} className={`bg-white border-2 ${colors.cardBorder} rounded-xl p-6 ${colors.cardBorderHover} hover:shadow-lg transition-all cursor-pointer`}>
              <div className={`w-12 h-12 ${colors.cardBg} rounded-lg flex items-center justify-center mb-4`}>
                <User className={`w-6 h-6 ${colors.iconText}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Perfil do Usuário</h3>
              <p className="text-gray-600">Gerencie suas informações pessoais e preferências da conta.</p>
            </div>

            <div onClick={() => setShowTipoSinistro(true)} className={`bg-white border-2 ${colors.cardBorder} rounded-xl p-6 ${colors.cardBorderHover} hover:shadow-lg transition-all cursor-pointer`}>
              <div className={`w-12 h-12 ${colors.cardBg} rounded-lg flex items-center justify-center mb-4`}>
                <MessageCircle className={`w-6 h-6 ${colors.iconText}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Chat Inteligente</h3>
              <p className="text-gray-600">Converse com nossa IA para obter ajuda e suporte instantâneo.</p>
            </div>

            <div onClick={() => navigate('/sinistro')} className={`bg-white border-2 ${colors.cardBorder} rounded-xl p-6 ${colors.cardBorderHover} hover:shadow-lg transition-all cursor-pointer`}>
              <div className={`w-12 h-12 ${colors.cardBg} rounded-lg flex items-center justify-center mb-4`}>
                <Notebook className={`w-6 h-6 ${colors.iconText}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Visualize seus relatórios</h3>
              <p className="text-gray-600">Acompanhe o andamento das suas solicitações.</p>
            </div>
          </div>
        )}

        {/* Quick Actions*/}
        {!isSeguradora ? (
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Ações Rápidas</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setShowTipoSinistro(true)}
                className={`${colors.button} text-white px-6 py-3 rounded-lg ${colors.buttonHover} transition-colors flex items-center space-x-2 font-medium`}
              >
                <MessageCircle className="w-5 h-5" />
                <span>Iniciar Chat</span>
              </button>
              <button onClick={() => navigate('/perfil')} className={`bg-white ${colors.textButton} border-2 ${colors.buttonBorder} px-6 py-3 rounded-lg ${colors.buttonBorderHover} transition-colors flex items-center space-x-2 font-medium`}>
                <User className="w-5 h-5" />
                <span>Ver Perfil</span>
              </button>
            </div>
          </div>
        ) :  <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Ações Rápidas</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/chat-seguradora')}
                className={`${colors.button} text-white px-6 py-3 rounded-lg ${colors.buttonHover} transition-colors flex items-center space-x-2 font-medium`}
              >
                <MessageCircle className="w-5 h-5" />
                <span>Iniciar Chat</span>
              </button>
            </div>
          </div>}

        {showTipoSinistro && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Selecione o tipo de problema</h3>

              <div className="space-y-3">
                <button
                  onClick={() => handleSelecionarTipoSinistro("AUTOMOTIVO")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                >
                  Automotivo
                </button>

                <button
                  onClick={() => handleSelecionarTipoSinistro("RESIDENCIAL")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                >
                  Residencial
                </button>

                <button
                  onClick={() => handleSelecionarTipoSinistro("TRANSPORTE")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                >
                  Transporte de carga
                </button>

                <button
                  onClick={() => setShowTipoSinistro(false)}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default HomePage;