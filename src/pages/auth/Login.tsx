import React, { useState, ChangeEvent, JSX } from 'react';
import { Eye, EyeOff, User, Mail, Lock, Phone, MapPin, Sparkles, UserPlus, LogIn, Building2, Users } from 'lucide-react';
import { authService } from '../../services/auth/authService';
import { useNavigate } from 'react-router-dom';
import { LoginCredentials } from '../../types/auth';
import { useAuth } from '../../services/contexts/AuthContext';

type UserType = 'cliente' | 'seguradora';

interface FormData {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  endereco: string;
  cpf: string;
  cnpj: string;
  razaoSocial: string;
  userType: UserType;
}

interface FormErrors {
  nome?: string;
  email?: string;
  senha?: string;
  telefone?: string;
  endereco?: string;
  cpf?: string;
  cnpj?: string;
  razaoSocial?: string;
}

export default function LoginSignupForm(): JSX.Element {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [userType, setUserType] = useState<UserType>('cliente');
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    endereco: '',
    cpf: '',
    cnpj: '',
    razaoSocial: '',
    userType: 'cliente'
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Cores dinâmicas baseadas no tipo de usuário
  const colors = {
    cliente: {
      gradient: 'from-blue-600 via-indigo-600 to-purple-600',
      gradientHover: 'from-blue-700 via-indigo-700 to-purple-700',
      icon: 'from-blue-500 to-indigo-500',
      bg: 'from-slate-900 via-blue-900 to-indigo-900',
      focus: 'focus:ring-blue-500/20 focus:border-blue-500',
      text: 'text-blue-600',
      bgBlobs: ['bg-blue-500/10', 'bg-indigo-500/10', 'bg-purple-500/10']
    },
    seguradora: {
      gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
      gradientHover: 'from-emerald-700 via-teal-700 to-cyan-700',
      icon: 'from-emerald-500 to-teal-500',
      bg: 'from-slate-900 via-teal-900 to-cyan-900',
      focus: 'focus:ring-emerald-500/20 focus:border-emerald-500',
      text: 'text-emerald-600',
      bgBlobs: ['bg-emerald-500/10', 'bg-teal-500/10', 'bg-cyan-500/10']
    }
  };

  const currentColors = colors[userType];

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

  const validateCPF = (cpf: string): boolean => {
    const cleanCPF = cpf.replace(/\D/g, '');
    return cleanCPF.length === 11;
  };

  const validateCNPJ = (cnpj: string): boolean => {
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    return cleanCNPJ.length === 14;
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
      if (userType === 'cliente') {
        if (!formData.nome) {
          newErrors.nome = 'Nome é obrigatório';
        }
        if (!formData.cpf) {
          newErrors.cpf = 'CPF é obrigatório';
        } else if (!validateCPF(formData.cpf)) {
          newErrors.cpf = 'CPF inválido';
        }
      } else {
        if (!formData.razaoSocial) {
          newErrors.razaoSocial = 'Razão Social é obrigatória';
        }
        if (!formData.cnpj) {
          newErrors.cnpj = 'CNPJ é obrigatório';
        } else if (!validateCNPJ(formData.cnpj)) {
          newErrors.cnpj = 'CNPJ inválido';
        }
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

  const handleSubmit = async (): Promise<void> => {
    setCarregando(true);
    setMensagem('');

    try {
      if (!validateForm()) {
        setCarregando(false);
        return;
      }

      if (isLogin) {
        const credenciais: LoginCredentials = {
          email: formData.email,
          password: formData.senha
        };

        const response = await authService.login(credenciais);
        const payload = response;
        const user = payload?.user;
        const token = payload?.token;

        if (!user) {
          setMensagem('Erro: resposta inválida do servidor');
          return;
        }

        const userId = (user as any).id ?? (user as any)._id;
        if (userId == null) {
          setMensagem('Erro: id do usuário não foi retornado');
          return;
        }

        login(
          {
            id: userId,
            nome: (user as any).nome ?? (user as any).name ?? '',
            email: user.email ?? '',
            telefone: user.telefone ?? '',
            endereco: user.endereco ?? '',
            role: user.role ?? ''
          },
          token ?? ''
        );

        setMensagem('Login realizado com sucesso!');
        setTimeout(() => navigate('/'), 1500);
      } else {
        const registerData = {
          ...formData,
          userType
        };
        await authService.register(registerData, userType);
        setMensagem('Cadastro realizado! Faça login com suas credenciais.');
        setTimeout(() => setIsLogin(true), 1500);
      }
    } catch (error: any) {
      setMensagem('Erro: ' + (error?.message ?? String(error)));
    } finally {
      setCarregando(false);
    }
  };

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const formatCPF = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  const formatCNPJ = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 14) {
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return value;
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({ ...prev, telefone: formatted }));
  };

  const handleCPFChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const formatted = formatCPF(e.target.value);
    setFormData(prev => ({ ...prev, cpf: formatted }));
  };

  const handleCNPJChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const formatted = formatCNPJ(e.target.value);
    setFormData(prev => ({ ...prev, cnpj: formatted }));
  };

  const toggleMode = (): void => {
    setIsLogin(!isLogin);
    setMensagem('');
    setFormData({
      nome: '',
      email: '',
      senha: '',
      telefone: '',
      endereco: '',
      cpf: '',
      cnpj: '',
      razaoSocial: '',
      userType: 'cliente'
    });
    setUserType('cliente');
    setErrors({});
  };

  const handleUserTypeChange = (type: UserType): void => {
    setUserType(type);
    setFormData(prev => ({ ...prev, userType: type }));
    setErrors({});
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentColors.bg} flex items-center justify-center p-4 relative overflow-hidden transition-all duration-500`}>
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className={`absolute top-10 left-10 w-72 h-72 ${currentColors.bgBlobs[0]} rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute bottom-10 right-10 w-96 h-96 ${currentColors.bgBlobs[1]} rounded-full blur-3xl animate-pulse delay-1000`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 ${currentColors.bgBlobs[2]} rounded-full blur-3xl animate-pulse delay-500`}></div>
      </div>

      <div className="relative z-10 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className={`relative bg-gradient-to-r ${currentColors.gradient} p-8 text-center overflow-hidden transition-all duration-500`}>
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
              {isLogin ? (
                <LogIn className="w-8 h-8 text-white" />
              ) : userType === 'cliente' ? (
                <Users className="w-8 h-8 text-white" />
              ) : (
                <Building2 className="w-8 h-8 text-white" />
              )}
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
              {isLogin ? 'Bem-vindo!' : userType === 'cliente' ? 'Cadastro de Cliente' : 'Cadastro de Seguradora'}
            </h2>
            <p className="text-white/90 text-sm font-medium">
              {isLogin ? 'Entre na sua conta para continuar' : 'Preencha os dados para criar sua conta'}
            </p>
          </div>
          
          <div className="absolute top-4 right-4">
            <Sparkles className="w-5 h-5 text-white/60 animate-pulse" />
          </div>
          <div className="absolute bottom-6 left-6">
            <Sparkles className="w-4 h-4 text-white/40 animate-pulse delay-700" />
          </div>
        </div>

        <div className="p-8">
          {mensagem && (
            <div className={`p-4 rounded-xl mb-6 flex items-center ${
              mensagem.includes('Erro') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              <div className="w-2 h-2 rounded-full mr-3 bg-current"></div>
              {mensagem}
            </div>
          )}

          {/* Seletor de tipo de usuário (apenas no cadastro) */}
          {!isLogin && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Tipo de Cadastro
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleUserTypeChange('cliente')}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    userType === 'cliente'
                      ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <Users className={`w-8 h-8 mx-auto mb-2 ${userType === 'cliente' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className={`text-sm font-semibold ${userType === 'cliente' ? 'text-blue-600' : 'text-gray-600'}`}>
                    Cliente
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => handleUserTypeChange('seguradora')}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    userType === 'seguradora'
                      ? 'border-emerald-500 bg-emerald-50 shadow-lg scale-105'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <Building2 className={`w-8 h-8 mx-auto mb-2 ${userType === 'seguradora' ? 'text-emerald-600' : 'text-gray-400'}`} />
                  <span className={`text-sm font-semibold ${userType === 'seguradora' ? 'text-emerald-600' : 'text-gray-600'}`}>
                    Seguradora
                  </span>
                </button>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Campos específicos para cadastro */}
            {!isLogin && (
              <>
                {userType === 'cliente' ? (
                  <>
                    <div className="group">
                      <label className={`flex items-center text-sm font-semibold text-gray-700 mb-3 transition-colors group-focus-within:${currentColors.text}`}>
                        <div className={`flex items-center justify-center w-8 h-8 bg-gradient-to-r ${currentColors.icon} rounded-lg mr-3 shadow-lg`}>
                          <User className="w-4 h-4 text-white" />
                        </div>
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-4 bg-gray-50/80 border-2 rounded-xl ${currentColors.focus} transition-all duration-300 backdrop-blur-sm ${
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

                    <div className="group">
                      <label className={`flex items-center text-sm font-semibold text-gray-700 mb-3 transition-colors group-focus-within:${currentColors.text}`}>
                        <div className={`flex items-center justify-center w-8 h-8 bg-gradient-to-r ${currentColors.icon} rounded-lg mr-3 shadow-lg`}>
                          <User className="w-4 h-4 text-white" />
                        </div>
                        CPF
                      </label>
                      <input
                        type="text"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleCPFChange}
                        className={`w-full px-4 py-4 bg-gray-50/80 border-2 rounded-xl ${currentColors.focus} transition-all duration-300 backdrop-blur-sm ${
                          errors.cpf ? 'border-red-400 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="000.000.000-00"
                        maxLength={14}
                      />
                      {errors.cpf && (
                        <div className="flex items-center mt-2 text-red-500 text-sm">
                          <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                          {errors.cpf}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="group">
                      <label className={`flex items-center text-sm font-semibold text-gray-700 mb-3 transition-colors group-focus-within:${currentColors.text}`}>
                        <div className={`flex items-center justify-center w-8 h-8 bg-gradient-to-r ${currentColors.icon} rounded-lg mr-3 shadow-lg`}>
                          <Building2 className="w-4 h-4 text-white" />
                        </div>
                        Razão Social
                      </label>
                      <input
                        type="text"
                        name="razaoSocial"
                        value={formData.razaoSocial}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-4 bg-gray-50/80 border-2 rounded-xl ${currentColors.focus} transition-all duration-300 backdrop-blur-sm ${
                          errors.razaoSocial ? 'border-red-400 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="Digite a razão social"
                      />
                      {errors.razaoSocial && (
                        <div className="flex items-center mt-2 text-red-500 text-sm">
                          <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                          {errors.razaoSocial}
                        </div>
                      )}
                    </div>

                    <div className="group">
                      <label className={`flex items-center text-sm font-semibold text-gray-700 mb-3 transition-colors group-focus-within:${currentColors.text}`}>
                        <div className={`flex items-center justify-center w-8 h-8 bg-gradient-to-r ${currentColors.icon} rounded-lg mr-3 shadow-lg`}>
                          <Building2 className="w-4 h-4 text-white" />
                        </div>
                        CNPJ
                      </label>
                      <input
                        type="text"
                        name="cnpj"
                        value={formData.cnpj}
                        onChange={handleCNPJChange}
                        className={`w-full px-4 py-4 bg-gray-50/80 border-2 rounded-xl ${currentColors.focus} transition-all duration-300 backdrop-blur-sm ${
                          errors.cnpj ? 'border-red-400 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="00.000.000/0000-00"
                        maxLength={18}
                      />
                      {errors.cnpj && (
                        <div className="flex items-center mt-2 text-red-500 text-sm">
                          <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                          {errors.cnpj}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </>
            )}

            <div className="group">
              <label className={`flex items-center text-sm font-semibold text-gray-700 mb-3 transition-colors group-focus-within:${currentColors.text}`}>
                <div className={`flex items-center justify-center w-8 h-8 bg-gradient-to-r ${currentColors.icon} rounded-lg mr-3 shadow-lg`}>
                  <Mail className="w-4 h-4 text-white" />
                </div>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-4 bg-gray-50/80 border-2 rounded-xl ${currentColors.focus} transition-all duration-300 backdrop-blur-sm ${
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
              <label className={`flex items-center text-sm font-semibold text-gray-700 mb-3 transition-colors group-focus-within:${currentColors.text}`}>
                <div className={`flex items-center justify-center w-8 h-8 bg-gradient-to-r ${currentColors.icon} rounded-lg mr-3 shadow-lg`}>
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
                  className={`w-full px-4 py-4 pr-12 bg-gray-50/80 border-2 rounded-xl ${currentColors.focus} transition-all duration-300 backdrop-blur-sm ${
                    errors.senha ? 'border-red-400 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:${currentColors.text} transition-colors rounded-lg hover:bg-blue-50`}
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
                  <label className={`flex items-center text-sm font-semibold text-gray-700 mb-3 transition-colors group-focus-within:${currentColors.text}`}>
                    <div className={`flex items-center justify-center w-8 h-8 bg-gradient-to-r ${currentColors.icon} rounded-lg mr-3 shadow-lg`}>
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    Telefone
                  </label>
                  <input
                    type="text"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handlePhoneChange}
                    className={`w-full px-4 py-4 bg-gray-50/80 border-2 rounded-xl ${currentColors.focus} transition-all duration-300 backdrop-blur-sm ${
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
                  <label className={`flex items-center text-sm font-semibold text-gray-700 mb-3 transition-colors group-focus-within:${currentColors.text}`}>
                    <div className={`flex items-center justify-center w-8 h-8 bg-gradient-to-r ${currentColors.icon} rounded-lg mr-3 shadow-lg`}>
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    Endereço
                  </label>
                  <textarea
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-4 bg-gray-50/80 border-2 rounded-xl ${currentColors.focus} transition-all duration-300 backdrop-blur-sm resize-none ${
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
              disabled={carregando}
              className={`relative w-full bg-gradient-to-r ${currentColors.gradient} text-white py-4 px-6 rounded-xl hover:${currentColors.gradientHover} focus:ring-4 ${currentColors.focus} transform hover:scale-[1.02] transition-all duration-300 font-semibold text-lg shadow-xl hover:shadow-2xl group overflow-hidden`}
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center">
                {carregando ? 'Processando...' : (isLogin ? (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Entrar na Conta
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" />
                    Criar Conta
                  </>
                ))}
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
              className={`mt-4 ${currentColors.text} hover:underline font-semibold transition-all duration-200 transform hover:scale-105`}
            >
              {isLogin ? 'Criar nova conta' : 'Fazer login'}
            </button>
          </div>

          {isLogin && (
            <div className="mt-6 text-center">
              <button className={`text-gray-500 hover:${currentColors.text} text-sm hover:underline transition-colors duration-200`}>
                Esqueci minha senha
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}