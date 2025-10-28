import React, { useState, useEffect } from 'react';
import { 
  Users, 
  AlertTriangle, 
  Wrench, 
  TrendingUp, 
  Activity,
  ArrowLeft,
  Shield,
  Car,
  Clock,
  RefreshCw
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import {dashboardService,DashboardStats,SinistroCategoria,SinistroMensal,SinistroRecente} from '../../../services/dashboard/dashboardService';

export default function HermesDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClientes: 0,
    totalSinistros: 0,
    totalOficinas: 0,
    sinistrosComFeridos: 0,
    sinistrosAtivos: 0,
    gravidade: {
      baixa: 0,
      moderada: 0,
      alta: 0
    }
  });

  const [sinistrosMensais, setSinistrosMensais] = useState<SinistroMensal[]>([]);
  const [sinistrosRecentes, setSinistrosRecentes] = useState<SinistroRecente[]>([]);
  const [categoriaData, setCategoriaData] = useState<SinistroCategoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [statsData, mensaisData, recentesData, categoriasData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getSinistrosMensais(6),
        dashboardService.getSinistrosRecentes(4),
        dashboardService.getSinistrosPorCategoria()
      ]);

      setStats(statsData);
      setSinistrosMensais(mensaisData);
      setSinistrosRecentes(recentesData);
      setCategoriaData(categoriasData);
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
      setError('Erro ao carregar os dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Dados para gráfico de pizza (Gravidade)
  const gravidadeData = [
    { name: 'Baixa', value: stats.gravidade.baixa, color: '#10b981' },
    { name: 'Moderada', value: stats.gravidade.moderada, color: '#f59e0b' },
    { name: 'Alta', value: stats.gravidade.alta, color: '#ef4444' }
  ];

  const StatCard = ({ title, value, icon: Icon, color, subtitle }: any) => (
    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 hover:shadow-lg transition-shadow" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">{loading ? '...' : value}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: color + '20' }}>
          <Icon className="w-8 h-8" style={{ color }} />
        </div>
      </div>
    </div>
  );

  const getGravidadeColor = (gravidade: string) => {
    switch (gravidade.toUpperCase()) {
      case 'BAIXA': return 'bg-green-100 text-green-800';
      case 'MODERADA': return 'bg-yellow-100 text-yellow-800';
      case 'ALTA': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusColor = (status: string) => {
    const statusUpper = status.toUpperCase().replace(/ /g, '_');
    switch (statusUpper) {
      case 'ABERTO': return 'bg-blue-100 text-blue-800';
      case 'EM_ANDAMENTO': return 'bg-orange-100 text-orange-800';
      case 'FINALIZADO': return 'bg-green-100 text-green-800';
      case 'ANALISE': return 'bg-purple-100 text-purple-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Erro ao Carregar Dashboard</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Hermes Dashboard</h1>
                <p className="text-green-100 text-sm mt-1">Painel de Controle e Análise de Dados</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadDashboardData}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white 
                         hover:bg-white/30 rounded-lg transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                <span className="font-medium">Atualizar</span>
              </button>
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white 
                         hover:bg-white/30 rounded-lg transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Voltar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total de Clientes" 
            value={stats.totalClientes} 
            icon={Users} 
            color="#10b981"
            subtitle="Clientes cadastrados"
          />
          <StatCard 
            title="Sinistros Totais" 
            value={stats.totalSinistros} 
            icon={AlertTriangle} 
            color="#f59e0b"
            subtitle={`${stats.sinistrosAtivos} ativos`}
          />
          <StatCard 
            title="Oficinas Parceiras" 
            value={stats.totalOficinas} 
            icon={Wrench} 
            color="#3b82f6"
            subtitle="Rede credenciada"
          />
          <StatCard 
            title="Com Feridos" 
            value={stats.sinistrosComFeridos} 
            icon={Shield} 
            color="#ef4444"
            subtitle="Sinistros com vítimas"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Line Chart - Sinistros Mensais */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Sinistros por Mês
            </h3>
            {sinistrosMensais.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={sinistrosMensais}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="mes" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sinistros" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-400">
                Nenhum dado disponível
              </div>
            )}
          </div>

          {/* Pie Chart - Gravidade */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Distribuição por Gravidade
            </h3>
            {gravidadeData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={gravidadeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {gravidadeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-400">
                Nenhum dado disponível
              </div>
            )}
          </div>
        </div>

        {/* Bar Chart - Categorias */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Car className="w-5 h-5 text-blue-600" />
            Sinistros por Categoria
          </h3>
          {categoriaData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoriaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="categoria" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
                <Bar dataKey="qtd" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400">
              Nenhum dado disponível
            </div>
          )}
        </div>

        {/* Recent Incidents Table */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            Sinistros Recentes
          </h3>
          {sinistrosRecentes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Cliente</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Veículo</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Data</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Gravidade</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sinistrosRecentes.map((sinistro) => (
                    <tr key={sinistro.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-sm text-slate-800 font-medium">#{sinistro.id}</td>
                      <td className="py-3 px-4 text-sm text-slate-800">{sinistro.cliente}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{sinistro.veiculo}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{sinistro.data}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getGravidadeColor(sinistro.gravidade)}`}>
                          {formatStatus(sinistro.gravidade)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(sinistro.status)}`}>
                          {formatStatus(sinistro.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              Nenhum sinistro recente encontrado
            </div>
          )}
        </div>
      </div>
    </div>
  );
}