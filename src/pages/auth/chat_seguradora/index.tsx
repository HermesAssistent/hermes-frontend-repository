import React, { useState, useRef, useEffect } from 'react';
import { Send, Database, Loader2, MessageSquare, ArrowLeft } from 'lucide-react';
import { chatSeguradoraService } from '../../../services/chat_seguradora/chatSeguradoraService';

export default function ChatSQL() {
  const [messages, setMessages] = useState([
    {
      type: 'system',
      text: '👋 Olá! Sou seu assistente de consultas inteligente. Faça perguntas sobre seus dados e eu vou gerar consultas SQL automaticamente!\n\nExemplos:\n• Quantos clientes temos cadastrados?\n• Listar sinistros com feridos\n• Quantas seguradoras estão ativas?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef: any = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chatSeguradoraService.perguntar(encodeURIComponent(userMessage))

      if (!response) {
        throw new Error(`Erro ao consultar a API`);
      }
      
      setMessages(prev => [...prev, { type: 'assistant', text: String(response?.data) }]);
    } catch (error: any) {
      console.error('Erro ao consultar:', error);
      setMessages(prev => [...prev, { 
        type: 'error', 
        text: `❌ Erro ao processar sua pergunta` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

 return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-lg shadow-lg">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Hermes Assistant</h1>
                <p className="text-sm text-slate-500">Faça perguntas em linguagem natural sobre seus dados</p>
              </div>
            </div>
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 
                       hover:bg-slate-100 rounded-lg transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Voltar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[80%] rounded-2xl px-5 py-3 shadow-md
                  ${message.type === 'user' 
                    ? 'bg-gradient-to-br from-green-500 to-green-600 text-white' 
                    : message.type === 'error'
                    ? 'bg-gradient-to-br from-red-50 to-red-100 text-red-800 border border-red-200'
                    : message.type === 'system'
                    ? 'bg-gradient-to-br from-green-50 to-green-100 text-green-900 border border-green-200'
                    : 'bg-white text-slate-800 border border-slate-200'
                  }
                `}
              >
                {message.type !== 'user' && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200">
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-semibold text-sm">
                      {message.type === 'system' ? 'Sistema' : message.type === 'error' ? 'Erro' : 'Assistente'}
                    </span>
                  </div>
                )}
                <div className="whitespace-pre-wrap text-[15px] leading-relaxed">
                  {message.text}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl px-5 py-4 shadow-md border border-slate-200">
                <div className="flex items-center gap-3 text-slate-600">
                  <Loader2 className="w-5 h-5 animate-spin text-green-500" />
                  <span className="text-sm font-medium">Processando sua pergunta...</span>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  Gerando SQL e executando consulta
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua pergunta aqui... (Ex: Quantos sinistros tivemos este mês?)"
                disabled={isLoading}
                rows={1}
                className="w-full px-4 py-3 pr-12 border-2 border-slate-300 rounded-xl 
                         focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200
                         disabled:bg-slate-100 disabled:cursor-not-allowed
                         resize-none text-[15px] transition-all"
                style={{ minHeight: '50px', maxHeight: '120px' }}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !inputValue.trim()}
              className="bg-gradient-to-br from-green-500 to-green-600 text-white px-6 py-3 rounded-xl
                       hover:from-green-600 hover:to-green-700 disabled:from-slate-300 disabled:to-slate-400
                       disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg
                       flex items-center gap-2 font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Enviando</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Enviar</span>
                </>
              )}
            </button>
          </div>
          
          <div className="mt-3 text-center">
            <p className="text-xs text-slate-500">
              💡 Pressione <kbd className="px-2 py-1 bg-slate-200 rounded text-slate-700 font-mono">Enter</kbd> para enviar ou <kbd className="px-2 py-1 bg-slate-200 rounded text-slate-700 font-mono">Shift+Enter</kbd> para nova linha
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}