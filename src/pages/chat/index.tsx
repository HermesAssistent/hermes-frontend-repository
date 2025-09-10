import React, { useState } from "react";
import { chatService } from "../../services/chat/chatService";

interface Message {
  id: number;
  text: string;
  sender: "me" | "other";
}

export const ChatHeader: React.FC = () => {
  return (
    <div className="flex items-center p-3 bg-gray-100 shadow-md">
      <div
        className="cursor-pointer w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded-full"
        onClick={() => window.history.back()}
      >
        <img src="seta-esquerda.png" alt="Voltar" className="w-5 h-5" />
      </div>

      <div className="ml-4 flex items-center">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            src="hermes-logo.png"
            alt="Hermes Assistant"
            className="w-full h-full object-cover"
          />
        </div>

        <span className="ml-3 font-semibold text-gray-800 text-lg">
          Hermes Assistant
        </span>
      </div>
    </div>
  );
};

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Olá! Clique em enviar para iniciar sua conversa com Hermes 🤖",
      sender: "other",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Estado de controle de sessão
  const [userId, setUserId] = useState<string | null>(null);
  const [conversaFinalizada, setConversaFinalizada] = useState(false);

  const handleSend = async () => {
    if (input.trim() === "" || conversaFinalizada) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "me",
    };

    setMessages([...messages, newMessage]);
    setInput("");
    setLoading(true);

    try {
      let respostaApi: any;

      if (!userId) {
        // primeira mensagem -> inicia chat
        const inicio = await chatService.iniciarChat("123"); //colocar id do usuario depois que login for feito
        setUserId(inicio.user_id);
        respostaApi = inicio;
      } else {
        // mensagens seguintes -> processar
        respostaApi = await chatService.processarMensagem(userId, input);
      }

      // Mensagem de resposta do Hermes
      const newMessageApi: Message = {
        id: messages.length + 2,
        text: respostaApi.resposta || respostaApi.mensagem_final,
        sender: "other",
      };

      setMessages((prev) => [...prev, newMessageApi]);

      if (respostaApi.conversa_finalizada) {
        setConversaFinalizada(true);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 2,
          text: "⚠️ Ocorreu um erro na comunicação.",
          sender: "other",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <ChatHeader />

      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-xs shadow ${
                msg.sender === "me"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Indicador de carregamento */}
        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 rounded-2xl max-w-xs shadow bg-white text-gray-800 rounded-bl-none flex items-center gap-1">
              <span className="dots-loading">...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input de mensagem */}
      <div className="p-4 bg-white border-t flex items-center gap-2">
        <input
          type="text"
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder={
            conversaFinalizada
              ? "Conversa finalizada ✅"
              : "Digite sua mensagem..."
          }
          value={input}
          disabled={conversaFinalizada}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={conversaFinalizada}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full disabled:opacity-50"
        >
          Enviar
        </button>
      </div>

      {/* Animação de loading */}
      <style>
        {`
          .dots-loading::after {
            content: '';
            display: inline-block;
            width: 1ch;
            animation: dots 1s steps(3, end) infinite;
          }

          @keyframes dots {
            0%, 20% { content: ''; }
            40% { content: '.'; }
            60% { content: '..'; }
            80%, 100% { content: '...'; }
          }
        `}
      </style>
    </div>
  );
};

export default ChatPage;
