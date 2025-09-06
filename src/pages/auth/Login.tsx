import React, { useState, ChangeEvent, JSX } from 'react';
import { Eye, EyeOff, User, Mail, Lock, Phone, MapPin, Sparkles, UserPlus, LogIn } from 'lucide-react';

interface FormData {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  endereco: string;
}

interface FormErrors {
  nome?: string;
  email?: string;
  senha?: string;
  telefone?: string;
  endereco?: string;
}

export default function LoginSignupForm(): JSX.Element {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    endereco: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!isLogin) {
      if (!formData.nome) {
        newErrors.nome = 'Nome é obrigatório';
      }

      if (!formData.telefone) {
        newErrors.telefone = 'Telefone é obrigatório';
      } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.telefone)) {
        newErrors.telefone = 'Formato: (11) 99999-9999';
      }

      if (!formData.endereco) {
        newErrors.endereco = 'Endereço é obrigatório';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (): void => {
    if (validateForm()) {
      if (isLogin) {
        console.log('Login realizado:', { email: formData.email, senha: formData.senha });
        alert('Login realizado com sucesso!');
      } else {
        console.log('Cadastro realizado:', formData);
        alert('Cadastro realizado com sucesso!');
      }
    }
  };

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({
      ...prev,
      telefone: formatted
    }));
  };

  const toggleMode = (): void => {
    setIsLogin(!isLogin);
    setFormData({
      nome: '',
      email: '',
      senha: '',
      telefone: '',
      endereco: ''
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-md overflow-hidden">
        {/* Header with glassmorphism effect */}
        <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-center overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
              {isLogin ? (
                <LogIn className="w-8 h-8 text-white" />
              ) : (
                <UserPlus className="w-8 h-8 text-white" />
              )}
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
              {isLogin ? 'Bem-vindo!' : 'Junte-se a nós'}
            </h2>
            <p className="text-white/90 text-sm font-medium">
              {isLogin ? 'Entre na sua conta para continuar' : 'Crie sua conta em poucos passos'}
            </p>
          </div>
          
          {/* Floating particles */}
          <div className="absolute top-4 right-4">
            <Sparkles className="w-5 h-5 text-white/60 animate-pulse" />
          </div>
          <div className="absolute bottom-6 left-6">
            <Sparkles className="w-4 h-4 text-white/40 animate-pulse delay-700" />
          </div>
        </div>

        <div className="p-8">
          <div className="space-y-6">
            {!isLogin && (
              <div className="group">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3 transition-colors group-focus-within:text-blue-600">
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg mr-3 shadow-lg">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  Nome Completo
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-4 bg-gray-50/80 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm ${
                    errors.nome ? 'border-red-400 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder="Digite seu nome completo"
                />
                {errors.nome && (
                  <div className="flex items-center mt-2 text-red-500 text-sm">
                    <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                    {errors.nome}
                  </div>
                )}
              </div>
            )}

            <div className="group">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3 transition-colors group-focus-within:text-blue-600">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg mr-3 shadow-lg">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-4 bg-gray-50/80 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm ${
                  errors.email ? 'border-red-400 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                }`}
                placeholder="Digite seu email"
              />
              {errors.email && (
                <div className="flex items-center mt-2 text-red-500 text-sm">
                  <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                  {errors.email}
                </div>
              )}
            </div>

            <div className="group">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3 transition-colors group-focus-within:text-blue-600">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg mr-3 shadow-lg">
                  <Lock className="w-4 h-4 text-white" />
                </div>
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="senha"
                  value={formData.senha}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-4 pr-12 bg-gray-50/80 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm ${
                    errors.senha ? 'border-red-400 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.senha && (
                <div className="flex items-center mt-2 text-red-500 text-sm">
                  <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                  {errors.senha}
                </div>
              )}
            </div>

            {!isLogin && (
              <>
                <div className="group">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-3 transition-colors group-focus-within:text-blue-600">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg mr-3 shadow-lg">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    Telefone
                  </label>
                  <input
                    type="text"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handlePhoneChange}
                    className={`w-full px-4 py-4 bg-gray-50/80 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm ${
                      errors.telefone ? 'border-red-400 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="(11) 99999-9999"
                    maxLength={15}
                  />
                  {errors.telefone && (
                    <div className="flex items-center mt-2 text-red-500 text-sm">
                      <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                      {errors.telefone}
                    </div>
                  )}
                </div>

                <div className="group">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-3 transition-colors group-focus-within:text-blue-600">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg mr-3 shadow-lg">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    Endereço
                  </label>
                  <textarea
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-4 bg-gray-50/80 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm resize-none ${
                      errors.endereco ? 'border-red-400 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="Digite seu endereço completo"
                  />
                  {errors.endereco && (
                    <div className="flex items-center mt-2 text-red-500 text-sm">
                      <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                      {errors.endereco}
                    </div>
                  )}
                </div>
              </>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              className="relative w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-500/20 transform hover:scale-[1.02] transition-all duration-300 font-semibold text-lg shadow-xl hover:shadow-2xl group overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center">
                {isLogin ? (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Entrar na Conta
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" />
                    Criar Conta
                  </>
                )}
              </div>
            </button>
          </div>

          <div className="mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                </span>
              </div>
            </div>
            
            <button
              onClick={toggleMode}
              className="mt-4 text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-all duration-200 transform hover:scale-105"
            >
              {isLogin ? 'Criar nova conta' : 'Fazer login'}
            </button>
          </div>

          {isLogin && (
            <div className="mt-6 text-center">
              <button className="text-gray-500 hover:text-blue-600 text-sm hover:underline transition-colors duration-200">
                Esqueci minha senha
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}