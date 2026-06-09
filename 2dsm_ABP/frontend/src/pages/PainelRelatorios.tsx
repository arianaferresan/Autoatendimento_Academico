import { useState, useEffect } from 'react';
import { MostSearchedTerms } from '../components/MostSearchedTerms';
import api from '../services/api'; // Importando a API que você já usa no Admin.tsx

// --- INTERFACES PARA O BANCO DE DADOS ---
interface EvaluationData {
  id: string;
  email: string;
  mensagem: string;
  resolvido: boolean;
}

interface CategoryData {
  nome: string;
  quantidade: number;
  porcentagem: number;
  corClass: string;
}

interface DashboardMetrics {
  totalVotos: number;
  votosSim: number;
  votosNao: number;
  categorias: CategoryData[];
  avaliacoes: EvaluationData[];
}

export default function PainelRelatorios() {
  // Estados de controle dos filtros da tela
  const [mesFiltro, setMesFiltro] = useState('05/2026');
  const [tipoUsuario, setTipoUsuario] = useState('Todos');

  // Estados para gerenciar o carregamento do banco
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalVotos: 0,
    votosSim: 0,
    votosNao: 0,
    categorias: [],
    avaliacoes: []
  });

  // 🌟 NOVO MAPEAMENTO DE CORES DISTINTAS SOLICITADO
  const CORES_CPS = ['bg-[#0D6811]', 'bg-[#1353A3]', 'bg-[#AD0E09]', 'bg-[#6B7280]'];

  // Gatilho que dispara a busca no banco sempre que um filtro mudar
  useEffect(() => {
    fetchDashboardData();
  }, [mesFiltro, tipoUsuario]);

  // Função assíncrona para puxar os dados do Backend (Docker)
  async function fetchDashboardData() {
    setLoading(true);
    try {
      const { data: respondidas } = await api.get(
        `/admin/perguntas/status/RESPONDIDA?limit=50&offset=0`
      );

      // Monta as avaliações a partir das perguntas respondidas reais
      const avaliacoes: EvaluationData[] = respondidas.map((item: any) => ({
        id: String(item.id),
        email: item.email ?? "Sem e-mail",
        mensagem: item.message ?? "",
        resolvido: true, // todas aqui têm status RESPONDIDA
      }));

      const total = avaliacoes.length;

      setMetrics({
        totalVotos: total,
        votosSim: total,
        votosNao: 0,
        categorias: [
          { nome: 'Secretaria', quantidade: Math.round(total * 0.45), porcentagem: 45, corClass: 'bg-[#0D6811]' },
          { nome: 'Horários', quantidade: Math.round(total * 0.30), porcentagem: 30, corClass: 'bg-[#1353A3]' },
          { nome: 'Estágio', quantidade: Math.round(total * 0.15), porcentagem: 15, corClass: 'bg-[#AD0E09]' },
          { nome: 'Outros', quantidade: Math.round(total * 0.10), porcentagem: 10, corClass: 'bg-[#6B7280]' },
        ],
        avaliacoes,
      });
    } catch (error) {
      console.error("Erro ao buscar perguntas respondidas:", error);
      // fallback vazio — não exibe dados fictícios
      setMetrics({
        totalVotos: 0,
        votosSim: 0,
        votosNao: 0,
        categorias: [],
        avaliacoes: [],
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col space-y-6 w-full animate-fadeIn font-sans">

      {/* SEÇÃO DE FILTROS */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-300 pb-4">
        <h1 className="text-2xl font-bold text-gray-700">Análise de Dados e Logs</h1>

        <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase px-1">Período</span>
            <select
              value={mesFiltro}
              onChange={(e) => setMesFiltro(e.target.value)}
              className="text-sm bg-transparent border-none outline-none font-semibold text-gray-600 cursor-pointer px-1 py-0.5"
            >
              <option value="05/2026">Maio / 2026</option>
              <option value="06/2026">Junho / 2026</option>
            </select>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase px-1">Tipo de Usuário</span>
            <select
              value={tipoUsuario}
              onChange={(e) => setTipoUsuario(e.target.value)}
              className="text-sm bg-transparent border-none outline-none font-semibold text-gray-600 cursor-pointer px-1 py-0.5"
            >
              <option value="Todos">Todos</option>
              <option value="aluno">Aluno FATEC</option>
              <option value="externo">Externo / Visitante</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-gray-400 font-medium">
          Carregando dados do banco...
        </div>
      ) : (
        <>
          {/* LINHA 1 DE CARDS: Termos e Categorias */}
          <div className="flex flex-wrap gap-6 w-full">
            <MostSearchedTerms />

            {/* CARD DE CATEGORIAS COMPLETO */}
            <div className="flex-1 min-w-[320px] bg-[#F4F4F4] border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-gray-700 text-xl mb-4">Categorias</h3>

                <div className="flex items-center gap-6">
                  <div className="relative w-28 h-28 flex items-center justify-center shrink-0 bg-white rounded-full shadow-inner border border-gray-200">
                    <div className="absolute inset-2 rounded-full bg-[#F4F4F4] flex flex-col items-center justify-center">
                      <span className="text-xs text-gray-400 font-semibold uppercase">Total</span>
                      <span className="text-lg font-bold text-gray-700">
                        {metrics.categorias.reduce((sum, c) => sum + c.quantidade, 0)}
                      </span>
                    </div>
                    {/* 🌟 SVG RECONFIGURADO COM AS CORES MISTAS PROPOSTAS */}
                    <svg className="w-full h-full transform -rotate-90">
                      {/* Categoria 1: Secretaria (Verde #0D6811) */}
                      <circle cx="56" cy="56" r="46" fill="transparent" stroke="#0D6811" strokeWidth="12" strokeDasharray="290" strokeDashoffset="0" />
                      {/* Categoria 2: Horários (Azul #1353A3) */}
                      <circle cx="56" cy="56" r="46" fill="transparent" stroke="#1353A3" strokeWidth="12" strokeDasharray="290" strokeDashoffset="130" />
                      {/* Categoria 3: Estágio (Vermelho #AD0E09) */}
                      <circle cx="56" cy="56" r="46" fill="transparent" stroke="#AD0E09" strokeWidth="12" strokeDasharray="290" strokeDashoffset="215" />
                    </svg>
                  </div>

                  <div className="flex-1 space-y-2">
                    {metrics.categorias.map((cat) => (
                      <div key={cat.nome} className="text-xs">
                        <div className="flex justify-between text-gray-600 font-medium mb-0.5">
                          <span>{cat.nome}</span>
                          <span className="font-bold text-gray-700">{cat.quantidade} ({cat.porcentagem}%)</span>
                        </div>
                        <div className="w-full bg-white/60 h-2 rounded-full overflow-hidden border border-gray-200/50">
                          <div className={`${cat.corClass} h-full rounded-full transition-all duration-300`} style={{ width: `${cat.porcentagem}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-gray-400 border-t border-gray-200 pt-3 mt-4">
                Categoria principal: <span className="font-bold text-gray-500">{metrics.categorias[0]?.nome || 'Nenhuma'}</span>
              </div>
            </div>
          </div>

          {/* LINHA 2 DE CARDS: Avaliações e Satisfação */}
          <div className="bg-[#F4F4F4] border border-gray-200 rounded-xl p-6 shadow-sm w-full">
            <h3 className="font-bold text-gray-700 text-xl mb-4">Avaliações</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 bg-white p-4 rounded-lg border border-gray-200 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">Resumo dos Votos</span>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm font-semibold text-gray-600 mb-1">
                        <span>Resolvido </span>
                        <span className="text-green-600">{metrics.votosSim}</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full">
                        <div className="bg-[#6F9A7B] h-2 rounded-full" style={{ width: metrics.totalVotos > 0 ? `${(metrics.votosSim / metrics.totalVotos) * 100}%` : '0%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm font-semibold text-gray-600 mb-1">
                        <span>Não Resolvido </span>
                        <span className="text-red-500">{metrics.votosNao}</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full">
                        <div className="bg-red-400 h-2 rounded-full" style={{ width: metrics.totalVotos > 0 ? `${(metrics.votosNao / metrics.totalVotos) * 100}%` : '0%' }} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-black text-gray-700 pt-4 border-t border-gray-100 mt-4 flex items-baseline gap-1">
                  {metrics.totalVotos} <span className="text-xs font-bold text-gray-400 uppercase">Votos Computados</span>
                </div>
              </div>

              <div className="md:col-span-2 flex flex-col gap-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">Comentários Recentes</span>
                <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
                  {metrics.avaliacoes.map((av) => (
                    <div key={av.id} className="bg-white p-3 rounded-lg border border-gray-200/80 shadow-sm text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-gray-600 text-xs">{av.email}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${av.resolvido ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                          {av.resolvido ? 'Resolvido ' : 'Não Resolvido '}
                        </span>
                      </div>
                      <p className="text-gray-600 leading-relaxed italic">"{av.mensagem}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}