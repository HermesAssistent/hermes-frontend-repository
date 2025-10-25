import { useState, ChangeEvent } from 'react';

export interface FormErrors {
  [key: string]: string;
}

export function useAuthForm<T extends Record<string, any>>(initialState: T) {
  const [formData, setFormData] = useState<T>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const resetForm = () => {
    setFormData(initialState);
    setErrors({});
    setMensagem('');
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    mensagem,
    setMensagem,
    carregando,
    setCarregando,
    handleInputChange,
    resetForm
  };
}

// Validadores comuns
export const validators = {
  validateEmail: (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email);
  },

  validatePassword: (password: string): boolean => {
    return password.length >= 6;
  },

  validatePhone: (phone: string): boolean => {
    return /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(phone);
  },

  validateCPF: (cpf: string): boolean => {
    const cleanCPF = cpf.replace(/\D/g, '');
    return cleanCPF.length === 11;
  },

  validateCNPJ: (cnpj: string): boolean => {
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    return cleanCNPJ.length === 14;
  }
};

// Formatadores
export const formatters = {
  formatPhone: (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  },

  formatCPF: (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  },

  formatCNPJ: (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 14) {
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return value;
  }
};