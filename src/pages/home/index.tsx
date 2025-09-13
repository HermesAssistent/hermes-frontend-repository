import React, { useState } from "react";
import { User, MessageCircle, Settings, LogOut, Send, Menu, X, GrapeIcon, GitGraph, Notebook } from "lucide-react";
import { authService } from '../../services/auth/authService';
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Olá! Como posso ajudá-lo hoje?", sender: "bot", timestamp: "10:30" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();


  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const userMessage = {
      id: chatMessages.length + 1,
      text: newMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages([...chatMessages, userMessage]);
    setNewMessage("");

    // Simular resposta do bot
    setTimeout(() => {
      const botMessage = {
        id: chatMessages.length + 2,
        text: "Obrigado pela sua mensagem! Como posso ajudá-lo melhor?",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">Hermes</h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <User className="w-5 h-5" />
                <span>Perfil</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Settings className="w-5 h-5" />
                <span>Configurações</span>
              </button>
              <button onClick={handleLogout} className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
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
            <div className="md:hidden py-4 border-t border-blue-500">
              <div className="flex flex-col space-y-2">
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-left">
                  <User className="w-5 h-5" />
                  <span>Perfil</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-left">
                  <Settings className="w-5 h-5" />
                  <span>Configurações</span>
                </button>
                <button onClick={handleLogout} className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-left">
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
            Bem-vindo ao Hermes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sua plataforma de comunicação inteligente. Acesse suas opções de usuário ou inicie uma conversa no chat.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border-2 border-blue-100 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Perfil do Usuário</h3>
            <p className="text-gray-600">Gerencie suas informações pessoais e preferências da conta.</p>
          </div>

          <div className="bg-white border-2 border-blue-100 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Chat Inteligente</h3>
            <p className="text-gray-600">Converse com nossa IA para obter ajuda e suporte instantâneo.</p>
          </div>

          <div className="bg-white border-2 border-blue-100 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Settings className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Configurações</h3>
            <p className="text-gray-600">Personalize sua experiência e ajuste as configurações do sistema.</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Ações Rápidas</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/chat')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-medium"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Iniciar Chat</span>
            </button>
            <button className="bg-white text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-2 font-medium">
              <User className="w-5 h-5" />
              <span>Ver Perfil</span>
            </button>
          </div>
        </div>
      </main>

    </div>
  );
};

export default HomePage;