import React, { ChangeEvent, ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface AuthInputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  icon: LucideIcon;
  type?: string;
  placeholder?: string;
  userType?: 'cliente' | 'seguradora';
  maxLength?: number;
  rightElement?: ReactNode;
  isTextArea?: boolean;
  rows?: number;
}

export default function AuthInputField({
  label,
  name,
  value,
  onChange,
  error,
  icon: Icon,
  type = 'text',
  placeholder,
  userType = 'cliente',
  maxLength,
  rightElement,
  isTextArea = false,
  rows = 3
}: AuthInputFieldProps) {
  const colors = {
    cliente: {
      icon: 'from-blue-500 to-indigo-500',
      focus: 'focus:ring-blue-500/20 focus:border-blue-500',
      text: 'text-blue-600'
    },
    seguradora: {
      icon: 'from-emerald-500 to-teal-500',
      focus: 'focus:ring-emerald-500/20 focus:border-emerald-500',
      text: 'text-emerald-600'
    }
  };

  const currentColors = colors[userType];

  const inputClasses = `w-full px-4 py-4 bg-gray-50/80 border-2 rounded-xl ${currentColors.focus} transition-all duration-300 backdrop-blur-sm ${
    error ? 'border-red-400 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
  } ${rightElement ? 'pr-12' : ''}`;

  return (
    <div className="group">
      <label className={`flex items-center text-sm font-semibold text-gray-700 mb-3 transition-colors group-focus-within:${currentColors.text}`}>
        <div className={`flex items-center justify-center w-8 h-8 bg-gradient-to-r ${currentColors.icon} rounded-lg mr-3 shadow-lg`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        {label}
      </label>
      <div className="relative">
        {isTextArea ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows={rows}
            className={`${inputClasses} resize-none`}
            placeholder={placeholder}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className={inputClasses}
            placeholder={placeholder}
            maxLength={maxLength}
          />
        )}
        {rightElement && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <div className="flex items-center mt-2 text-red-500 text-sm">
          <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
          {error}
        </div>
      )}
    </div>
  );
}