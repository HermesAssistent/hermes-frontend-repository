import React, { useEffect, useState, useRef } from "react";
import { Car, MapPin, Calendar, Clock, Shield, AlertTriangle, Users, ArrowLeft, FileDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { sinistroService } from "../../services/sinistro/sinistroService";
import { relatorioService } from "../../services/relatorio/relatorioService";

export interface Sinistro {
  id: number;
  problema: string;
  local: string;
  data: string;
  hora: string;
  modeloVeiculo: string;
  anoFabricacao: string;
  placa: string;
  danosVeiculo: string;
  outrosEnvolvidos: boolean;
  feridos: boolean;
  possuiSeguro: boolean;
  seguradora: string;
  cobertura: string;
  gravidade: string;
  condicoesClimaticas: string;
  condicoesVia: string;
  testemunhas: string;
  autoridadesAcionadas: string;
  veiculoImobilizado: string;
  categoriaProblema: string;
}

const SinistroViewer = () => {
  const [sinistros, setSinistros] = useState<Sinistro[]>([]);
  const [selectedSinistro, setSelectedSinistro] = useState<Sinistro | null>(null);
  const fetchedRef = useRef(false); 
  const navigate = useNavigate();

  const [isDownloading, setIsDownloading] = useState(false);

 const handleDownloadPDF = async () => {
    if (!selectedSinistro) return;
    
    setIsDownloading(true);
      try {
          const pdfBlob = await relatorioService.downloadRelatorio(selectedSinistro.id);
          
          const url = window.URL.createObjectURL(pdfBlob);
          
          const link = document.createElement('a');
          link.href = url;
          link.download = `relatorio-sinistro-${selectedSinistro.id}.pdf`;
          document.body.appendChild(link);
          link.click();
          
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        
      } catch (error) {
        console.error("Erro ao baixar relatório:", error);
        alert("Erro ao baixar o relatório. Tente novamente.");
      } finally {
        setIsDownloading(false);
      }
  };

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchSinistros = async () => {
      try {
        const response = await sinistroService.listarSinistrosById("4");
        if (response && Array.isArray(response)) {
          setSinistros(response);
          if (response.length > 0) {
            setSelectedSinistro(response[0]);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar sinistros:", error);
      }
    };

    fetchSinistros();
  }, []);

  const getGravidadeColor = (gravidade: string) => {
    switch (gravidade?.toLowerCase()) {
      case "baixa":
        return "bg-green-100 text-green-800 border-green-200";
      case "média":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "alta":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const InfoCard = ({ icon: Icon, title, value, className = "" }: any) => (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-lg font-semibold text-gray-900">{value || "N/A"}</p>
        </div>
      </div>
    </div>
  );

  const DetailRow = ({ label, value }: any) => (
    <div className="py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex flex-col sm:flex-row sm:justify-between">
        <span className="text-sm font-medium text-gray-600 mb-1 sm:mb-0">{label}:</span>
        <span className="text-sm text-gray-900 sm:text-right">{value || "N/A"}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Sinistros</h1>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg border border-gray-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
          </div>
          <p className="text-gray-600">
            Visualize e gerencie informações detalhadas dos sinistros reportados
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Sinistros */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Lista de Sinistros</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {sinistros.map((sinistro) => (
                  <div
                    key={sinistro.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedSinistro?.id === sinistro.id
                        ? "bg-blue-50 border-r-4 border-blue-500"
                        : ""
                    }`}
                    onClick={() => setSelectedSinistro(sinistro)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">#{sinistro.id}</span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full border ${getGravidadeColor(
                          sinistro.gravidade
                        )}`}
                      >
                        {sinistro.gravidade}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1 truncate">{sinistro.problema}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {sinistro.data}
                      <Clock className="w-3 h-3 ml-2" />
                      {sinistro.hora}
                    </div>
                  </div>
                ))}
                {sinistros.length === 0 && (
                  <p className="p-4 text-gray-500 text-sm">Nenhum sinistro encontrado</p>
                )}
              </div>
            </div>
          </div>

          {/* Detalhes do Sinistro */}
          <div className="lg:col-span-2">
            {selectedSinistro && (
              
              <div className="space-y-6">

                   <div className="flex justify-end">
                      <button
                        onClick={handleDownloadPDF}
                        disabled={isDownloading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors shadow-sm"
                      >
                        <FileDown className="w-4 h-4" />
                        {isDownloading ? "Gerando PDF..." : "Baixar Relatório PDF"}
                      </button>
                   </div>
                {/* Cards de Resumo */}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <InfoCard
                    icon={AlertTriangle}
                    title="Gravidade"
                    value={selectedSinistro.gravidade}
                    className={getGravidadeColor(selectedSinistro.gravidade)}
                  />
                  <InfoCard
                    icon={Car}
                    title="Veículo"
                    value={`${selectedSinistro.modeloVeiculo} ${selectedSinistro.anoFabricacao}`}
                  />
                  <InfoCard
                    icon={Shield}
                    title="Seguradora"
                    value={selectedSinistro.seguradora}
                  />
                  <InfoCard
                    icon={MapPin}
                    title="Local"
                    value={selectedSinistro.local?.split(",")[0]}
                  />
                </div>

                {/* Detalhes */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Detalhes do Sinistro
                    </h3>
                    <div className="divide-y divide-gray-100">
                      <DetailRow label="Problema" value={selectedSinistro.problema} />
                      <DetailRow label="Local" value={selectedSinistro.local} />
                      <DetailRow label="Data" value={selectedSinistro.data} />
                      <DetailRow label="Hora" value={selectedSinistro.hora} />
                      <DetailRow
                        label="Danos"
                        value={selectedSinistro.danosVeiculo}
                      />
                      <DetailRow
                        label="Outros Envolvidos"
                        value={selectedSinistro.outrosEnvolvidos ? "Sim" : "Não"}
                      />
                      <DetailRow
                        label="Feridos"
                        value={selectedSinistro.feridos ? "Sim" : "Não"}
                      />
                      <DetailRow
                        label="Seguro"
                        value={selectedSinistro.possuiSeguro ? "Sim" : "Não"}
                      />
                      <DetailRow label="Cobertura" value={selectedSinistro.cobertura} />
                      <DetailRow
                        label="Condições Climáticas"
                        value={selectedSinistro.condicoesClimaticas}
                      />
                      <DetailRow
                        label="Condições da Via"
                        value={selectedSinistro.condicoesVia}
                      />
                      <DetailRow
                        label="Testemunhas"
                        value={selectedSinistro.testemunhas}
                      />
                      <DetailRow
                        label="Autoridades"
                        value={selectedSinistro.autoridadesAcionadas}
                      />
                      <DetailRow
                        label="Veículo Imobilizado"
                        value={selectedSinistro.veiculoImobilizado}
                      />
                      <DetailRow
                        label="Categoria"
                        value={selectedSinistro.categoriaProblema}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinistroViewer;