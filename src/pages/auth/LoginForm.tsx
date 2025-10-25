import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { authService } from '../../services/auth/authService';
import { useNavigate } from 'react-router-dom';
import { LoginCredentials } from '../../types/auth';
import { useAuth } from '../../services/contexts/AuthContext';
import { useAuthForm, validators } from './hooks/useAuthForm';
import AuthLayout from './AuthLayout';
import AuthInputField from './AuthInputField';

interface LoginFormProps {
  onToggleMode: () => void;
}

interface LoginFormData {
  email: string;
  senha: string;
}

export default function LoginForm({ onToggleMode }: LoginFormProps) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    formData,
    errors,
    setErrors,
    mensagem,
    setMensagem,
    carregando,
    setCarregando,
    handleInputChange
  } = useAuthForm<LoginFormData>({
    email: '',
    senha: ''
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validators.validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (!validators.validatePassword(formData.senha)) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
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

      const credenciais: LoginCredentials = {
        email: formData.email,
        password: formData.senha
      };

      const response = await authService.login(credenciais);
      const payload = response;
      const user = payload?.user;
      const token = payload?.token;
      const clienteId = payload?.clienteId;
      const seguradoraId = payload?.seguradoraId;

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
          role: user.role ?? '',
        },
        token ?? '',
        { clienteId, seguradoraId }
      );

      setMensagem('Login realizado com sucesso!');
      setTimeout(() => navigate('/'), 1500);
    } catch (error: any) {
      setMensagem('Erro: ' + (error?.status === 500 ? 'Erro no servidor, tente novamente mais tarde.' : error?.response?.data?.message));
    } finally {
      setCarregando(false);
    }
  };

  return (
    <AuthLayout
      title="Bem-vindo!"
      subtitle="Entre na sua conta para continuar"
      isLogin={true}
    >
      {mensagem && (
        <div className={`p-4 rounded-xl mb-6 flex items-center ${
          mensagem.includes('Erro') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          <div className="w-2 h-2 rounded-full mr-3 bg-current"></div>
          {mensagem}
        </div>
      )}

      <div className="space-y-6">
        <AuthInputField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          icon={Mail}
          type="email"
          placeholder="Digite seu email"
        />

        <AuthInputField
          label="Senha"
          name="senha"
          value={formData.senha}
          onChange={handleInputChange}
          error={errors.senha}
          icon={Lock}
          type={showPassword ? 'text' : 'password'}
          placeholder="Digite sua senha"
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          }
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={carregando}
          className="relative w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-500/20 transform hover:scale-[1.02] transition-all duration-300 font-semibold text-lg shadow-xl hover:shadow-2xl group overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-center">
            {carregando ? 'Processando...' : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Entrar na Conta
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
              Não tem uma conta?
            </span>
          </div>
        </div>
        
        <button
          onClick={onToggleMode}
          className="mt-4 text-blue-600 hover:underline font-semibold transition-all duration-200 transform hover:scale-105"
        >
          Criar nova conta
        </button>
      </div>

      <div className="mt-6 text-center">
        <button className="text-gray-500 hover:text-blue-600 text-sm hover:underline transition-colors duration-200">
          Esqueci minha senha
        </button>
      </div>
    </AuthLayout>
  );
}