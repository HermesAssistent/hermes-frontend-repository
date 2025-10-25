import React, { useState, ChangeEvent } from 'react';
import { Eye, EyeOff, Building2, Mail, Lock, Phone, MapPin, UserPlus } from 'lucide-react';
import { authService } from '../../services/auth/authService';
import { useAuthForm, validators, formatters } from './hooks/useAuthForm';
import AuthLayout from './AuthLayout';
import AuthInputField from './AuthInputField';

interface SeguradoraSignupFormProps {
  onToggleMode: () => void;
}

interface SeguradoraFormData {
  razaoSocial: string;
  cnpj: string;
  email: string;
  senha: string;
  telefone: string;
  endereco: string;
}

export default function SeguradoraSignupForm({ onToggleMode }: SeguradoraSignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    formData,
    setFormData,
    errors,
    setErrors,
    mensagem,
    setMensagem,
    carregando,
    setCarregando,
    handleInputChange
  } = useAuthForm<SeguradoraFormData>({
    razaoSocial: '',
    cnpj: '',
    email: '',
    senha: '',
    telefone: '',
    endereco: ''
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.razaoSocial) {
      newErrors.razaoSocial = 'Razão Social é obrigatória';
    }

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

    if (!formData.cnpj) {
      newErrors.cnpj = 'CNPJ é obrigatório';
    } else if (!validators.validateCNPJ(formData.cnpj)) {
      newErrors.cnpj = 'CNPJ inválido';
    }

    if (!formData.telefone) {
      newErrors.telefone = 'Telefone é obrigatório';
    } else if (!validators.validatePhone(formData.telefone)) {
      newErrors.telefone = 'Formato: (11) 99999-9999';
    }

    if (!formData.endereco) {
      newErrors.endereco = 'Endereço é obrigatório';
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

      const registerData = {
        ...formData,
        userType: 'seguradora'
      };
      
      await authService.register(registerData, 'seguradora');
      setMensagem('Cadastro realizado! Faça login com suas credenciais.');
      setTimeout(() => onToggleMode(), 1500);
    } catch (error: any) {
      setMensagem('Erro: ' + (error?.status === 500 ? 'Erro no servidor, tente novamente mais tarde.' : error?.response?.data?.message));
    } finally {
      setCarregando(false);
    }
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement> | any): void => {
    const formatted = formatters.formatPhone(e.target.value);
    setFormData(prev => ({ ...prev, telefone: formatted }));
  };

  const handleCNPJChange = (e: ChangeEvent<HTMLInputElement> | any): void => {
    const formatted = formatters.formatCNPJ(e.target.value);
    setFormData(prev => ({ ...prev, cnpj: formatted }));
  };

  return (
    <AuthLayout
      title="Cadastro de Seguradora"
      subtitle="Preencha os dados para criar sua conta"
      userType="seguradora"
      isLogin={false}
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
          label="Razão Social"
          name="razaoSocial"
          value={formData.razaoSocial}
          onChange={handleInputChange}
          error={errors.razaoSocial}
          icon={Building2}
          placeholder="Digite a razão social"
          userType="seguradora"
        />

        <AuthInputField
          label="CNPJ"
          name="cnpj"
          value={formData.cnpj}
          onChange={handleCNPJChange}
          error={errors.cnpj}
          icon={Building2}
          placeholder="00.000.000/0000-00"
          maxLength={18}
          userType="seguradora"
        />

        <AuthInputField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          icon={Mail}
          type="email"
          placeholder="Digite seu email"
          userType="seguradora"
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
          userType="seguradora"
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-2 text-gray-400 hover:text-emerald-600 transition-colors rounded-lg hover:bg-emerald-50"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          }
        />

        <AuthInputField
          label="Telefone"
          name="telefone"
          value={formData.telefone}
          onChange={handlePhoneChange}
          error={errors.telefone}
          icon={Phone}
          placeholder="(11) 99999-9999"
          maxLength={15}
          userType="seguradora"
        />

        <AuthInputField
          label="Endereço"
          name="endereco"
          value={formData.endereco}
          onChange={handleInputChange}
          error={errors.endereco}
          icon={MapPin}
          placeholder="Digite seu endereço completo"
          userType="seguradora"
          isTextArea={true}
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={carregando}
          className="relative w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-4 px-6 rounded-xl hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 focus:ring-4 focus:ring-emerald-500/20 transform hover:scale-[1.02] transition-all duration-300 font-semibold text-lg shadow-xl hover:shadow-2xl group overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-center">
            {carregando ? 'Processando...' : (
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
              Já tem uma conta?
            </span>
          </div>
        </div>
        
        <button
          onClick={onToggleMode}
          className="mt-4 text-emerald-600 hover:underline font-semibold transition-all duration-200 transform hover:scale-105"
        >
          Fazer login
        </button>
      </div>
    </AuthLayout>
  );
}