import React, { useState } from 'react';
import { Users, Building2 } from 'lucide-react';
import LoginForm from './LoginForm';
import SeguradoraSignupForm from './SeguradoraSignupForm';
import ClienteSignupForm from './ClienteSigupForm';

type AuthMode = 'login' | 'signup-cliente' | 'signup-seguradora' | 'select-type';

export default function AuthContainer() {
  const [mode, setMode] = useState<AuthMode>('login');

  const handleToggleToSignup = () => {
    setMode('select-type');
  };

  const handleToggleToLogin = () => {
    setMode('login');
  };

  const handleSelectUserType = (type: 'cliente' | 'seguradora') => {
    setMode(type === 'cliente' ? 'signup-cliente' : 'signup-seguradora');
  };

  if (mode === 'login') {
    return <LoginForm onToggleMode={handleToggleToSignup} />;
  }

  if (mode === 'select-type') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-2xl p-12">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-800 mb-3">
              Escolha o Tipo de Cadastro
            </h2>
            <p className="text-gray-600 text-lg">
              Selecione como deseja se cadastrar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <button
              onClick={() => handleSelectUserType('cliente')}
              className="group relative p-8 rounded-2xl border-3 border-gray-200 bg-white hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Cliente
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Cadastre-se como cliente para contratar seguros e gerenciar suas apólices
                </p>
              </div>
            </button>

            <button
              onClick={() => handleSelectUserType('seguradora')}
              className="group relative p-8 rounded-2xl border-3 border-gray-200 bg-white hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Seguradora
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Cadastre-se como seguradora para oferecer seguros e gerenciar clientes
                </p>
              </div>
            </button>
          </div>

          <div className="text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  Já tem uma conta?
                </span>
              </div>
            </div>
            
            <button
              onClick={handleToggleToLogin}
              className="text-purple-600 hover:text-purple-700 font-semibold text-lg hover:underline transition-all duration-200 transform hover:scale-105"
            >
              Fazer login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'signup-cliente') {
    return <ClienteSignupForm onToggleMode={handleToggleToLogin} />;
  }

  if (mode === 'signup-seguradora') {
    return <SeguradoraSignupForm onToggleMode={handleToggleToLogin} />;
  }

  return null;
}