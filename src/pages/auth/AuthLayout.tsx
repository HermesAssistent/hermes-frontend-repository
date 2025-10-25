import React, { ReactNode } from 'react';
import { Sparkles, LogIn, Users, Building2 } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  userType?: 'cliente' | 'seguradora';
  isLogin?: boolean;
}

export default function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  userType = 'cliente',
  isLogin = false 
}: AuthLayoutProps) {
  const colors = {
    cliente: {
      gradient: 'from-blue-600 via-indigo-600 to-purple-600',
      bg: 'from-slate-900 via-blue-900 to-indigo-900',
      bgBlobs: ['bg-blue-500/10', 'bg-indigo-500/10', 'bg-purple-500/10']
    },
    seguradora: {
      gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
      bg: 'from-slate-900 via-teal-900 to-cyan-900',
      bgBlobs: ['bg-emerald-500/10', 'bg-teal-500/10', 'bg-cyan-500/10']
    }
  };

  const currentColors = colors[userType];

  const getIcon = () => {
    if (isLogin) return <LogIn className="w-8 h-8 text-white" />;
    return userType === 'cliente' ? 
      <Users className="w-8 h-8 text-white" /> : 
      <Building2 className="w-8 h-8 text-white" />;
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
              {getIcon()}
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
              {title}
            </h2>
            <p className="text-white/90 text-sm font-medium">
              {subtitle}
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
          {children}
        </div>
      </div>
    </div>
  );
}