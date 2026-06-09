import { useState, useEffect } from 'react';
import { MostSearchedTerms } from '../components/MostSearchedTerms';
import api from '../services/api';

interface SupportContact {
  id: number;
  email: string;
  message: string;
  status: string;
  created_at: string;
}

interface SupportStat {
  status: string;
  count: number;
}

interface LogStat {
  month: string;
  category: string;
  log_count: number;
}

interface InquiryStat {
  month: string;
  title: string;
  count: number;
}

interface SatisfactionStat {
  month: string;
  flag: string | null;
  count: number;
}

interface PainelRelatoriosProps {
  onNavigateToDuvidas?: () => void;
}

export default function PainelRelatorios({ onNavigateToDuvidas }: PainelRelatoriosProps) {
  const [mesFiltro, setMesFiltro] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  
  const [loading, setLoading] = useState(true);
  const [perguntaStats, setPerguntaStats] = useState<SupportStat[]>([]);
  const [recentQuestions, setRecentQuestions] = useState<SupportContact[]>([]);
  const [categoryStats, setCategoryStats] = useState<LogStat[]>([]);
  const [termStats, setTermStats] = useState<InquiryStat[]>([]);
  const [satisfactionStats, setSatisfactionStats] = useState<SatisfactionStat[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, [mesFiltro]);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      const [pStats, pRecent, lStats, iStats, sStats] = await Promise.all([
        api.get<SupportStat[]>('/admin/perguntas/stats'),
        api.get<SupportContact[]>('/admin/perguntas?limit=8'),
        api.get<LogStat[]>('/admin/logs/stats'),
        api.get<InquiryStat[]>('/admin/logs/inquiry-stats'),
        api.get<SatisfactionStat[]>('/admin/logs/satisfaction-stats')
      ]);
      setPerguntaStats(pStats.data);
      setRecentQuestions(pRecent.data);
      setCategoryStats(lStats.data);
      setTermStats(iStats.data);
      setSatisfactionStats(sStats.data);
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredCategories = categoryStats.filter(s => s.month === mesFiltro);
  const totalLogs = filteredCategories.reduce((sum, c) => sum + Number(c.log_count), 0);

  const filteredTerms = termStats
    .filter(s => s.month === mesFiltro)
    .slice(0, 5)
    .map(t => ({ title: t.title, count: Number(t.count) }));

  const respondidas = Number(perguntaStats.find(s => s.status === 'RESPONDIDA')?.count || 0);
  const abertas = perguntaStats.filter(s => s.status !== 'RESPONDIDA').reduce((sum, s) => sum + Number(s.count), 0);
  const totalPerguntas = respondidas + abertas;

  const filteredSatisfaction = satisfactionStats.filter(s => s.month === mesFiltro);
  
  const totalSessions = filteredSatisfaction.reduce((sum, s) => sum + Number(s.count), 0);
  const ratedSessions = filteredSatisfaction.filter(s => s.flag !== null).reduce((sum, s) => sum + Number(s.count), 0);
  const engagementRate = totalSessions > 0 ? ((ratedSessions / totalSessions) * 100).toFixed(0) : 0;

  const flagWeights: Record<string, number> = { 'RUIM': 1, 'SATISFATÓRIO': 2, 'BOM': 3, 'MUITO BOM': 4, 'ÓTIMO': 5 };
  let weightedSum = 0;
  let positiveCount = 0;

  const distribution = { 'RUIM': 0, 'SATISFATÓRIO': 0, 'BOM': 0, 'MUITO BOM': 0, 'ÓTIMO': 0 };

  filteredSatisfaction.filter(s => s.flag !== null).forEach(s => {
    const count = Number(s.count);
    const flag = s.flag as keyof typeof distribution;
    if (flagWeights[flag]) {
      weightedSum += flagWeights[flag] * count;
      distribution[flag] += count;
      if (['BOM', 'MUITO BOM', 'ÓTIMO'].includes(flag)) {
        positiveCount += count;
      }
    }
  });

  const averageRating = ratedSessions > 0 ? (weightedSum / ratedSessions).toFixed(1) : '0.0';
  const satisfactionRate = ratedSessions > 0 ? ((positiveCount / ratedSessions) * 100).toFixed(0) : 0;

  const CORES_SVG: Record<string, string> = {
    'Secretaria': '#059669',
    'DSM': '#1d4ed8',
    'Não sou aluno': '#b91c1c',
    'MARH': '#f97316',
    'Geoprocessamento': '#9333ea'
  };

  const CORES_AVALIACAO: Record<string, string> = {
    'RUIM': '#ef4444',
    'SATISFATÓRIO': '#f59e0b',
    'BOM': '#3b82f6',
    'MUITO BOM': '#6366f1',
    'ÓTIMO': '#10b981'
  };

  return (
    <div className="flex flex-col space-y-6">
      
      {/* HEADER DE FILTROS - PADRONIZADO */}
      <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Relatórios e Métricas</h2>
          <p className="text-gray-500 text-xs font-semibold uppercase">Visão geral do sistema e interações</p>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 p-2 rounded border border-gray-200">
           <label className="text-[10px] font-bold text-gray-400 uppercase px-1">Período:</label>
           <input type="month" value={mesFiltro} onChange={(e) => setMesFiltro(e.target.value)} className="text-sm font-bold text-gray-700 bg-transparent outline-none cursor-pointer" />
           <button onClick={fetchDashboardData} className="text-gray-400 hover:text-[#8B0000] ml-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><polyline points="21 3 21 8 16 8"/></svg>
           </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400 italic font-bold">Compilando dados...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* SATISFAÇÃO DOS USUÁRIOS */}
            <div className="lg:col-span-3 bg-white p-6 rounded-lg border border-gray-300 shadow-sm flex flex-col">
              <div className="mb-6 flex justify-between items-end">
                 <div>
                    <h3 className="font-bold text-gray-800">Satisfação dos Usuários</h3>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Avaliações do Chatbot no Período</span>
                 </div>
                 <div className="text-right">
                    <span className="text-xs font-bold text-gray-500 uppercase">Engajamento de Avaliação: </span>
                    <span className="text-sm font-bold text-[#8B0000]">{engagementRate}%</span>
                    <p className="text-[9px] text-gray-400 mt-0.5">({ratedSessions} avaliações de {totalSessions} sessões)</p>
                 </div>
              </div>

              {totalSessions === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" className="mb-2"><circle cx="12" cy="12" r="10"/><line x1="8" y1="15" x2="16" y2="15"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                  <p className="text-gray-400 italic text-xs font-medium">Nenhum atendimento realizado neste período.</p>
                </div>
              ) : ratedSessions === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" className="mb-2"><circle cx="12" cy="12" r="10"/><line x1="8" y1="15" x2="16" y2="15"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                  <p className="text-gray-400 italic text-xs font-medium">Os atendimentos deste período não receberam avaliações.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                   <div className="flex flex-col items-center justify-center border-r border-gray-100 pr-8">
                      <span className="text-[48px] font-black text-gray-800 leading-none">{averageRating}</span>
                      <div className="flex text-yellow-400 text-lg mt-2 mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                           <span key={i}>{i < Math.round(Number(averageRating)) ? '★' : '☆'}</span>
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Média Ponderada</span>
                   </div>

                   <div className="flex flex-col items-center justify-center border-r border-gray-100 pr-8">
                      <span className="text-[48px] font-black text-[#2E7D32] leading-none">{satisfactionRate}%</span>
                      <span className="text-[10px] font-bold text-[#2E7D32] uppercase mt-3">Satisfação Positiva</span>
                      <span className="text-[9px] text-gray-400 mt-1">(Bom, Muito Bom e Ótimo)</span>
                   </div>

                   <div className="space-y-2 flex-1 pl-4">
                      {['ÓTIMO', 'MUITO BOM', 'BOM', 'SATISFATÓRIO', 'RUIM'].map(flag => {
                         const f = flag as keyof typeof distribution;
                         const count = distribution[f];
                         const percent = ratedSessions > 0 ? (count / ratedSessions) * 100 : 0;
                         return (
                           <div key={flag} className="flex items-center gap-3">
                              <span className="text-[9px] font-bold text-gray-500 uppercase w-20 text-right">{flag}</span>
                              <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                 <div className="h-full rounded-full transition-all duration-700" style={{ width: `${percent}%`, backgroundColor: CORES_AVALIACAO[flag] }} />
                              </div>
                              <span className="text-xs font-bold text-gray-700 w-8">{count}</span>
                           </div>
                         );
                      })}
                   </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            {/* TERMOS */}
            <div className="lg:col-span-5">
               <MostSearchedTerms terms={filteredTerms} />
            </div>
            
            {/* CATEGORIAS */}
            <div className="lg:col-span-7 bg-white p-6 rounded-lg border border-gray-300 shadow-sm flex flex-col">
              <div className="mb-6">
                 <h3 className="font-bold text-gray-800">Interesse por Área</h3>
                 <span className="text-[10px] font-bold text-gray-400 uppercase">Distribuição de acessos no Chat</span>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8 flex-1">
                 <div className="relative w-40 h-40 shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                       <circle cx="80" cy="80" r="70" fill="transparent" stroke="#f1f5f9" strokeWidth="18" />
                       {totalLogs > 0 ? (
                         (() => {
                            let cumulativePercent = 0;
                            return filteredCategories.map((cat) => {
                               const percent = (cat.log_count / totalLogs);
                               const strokeDashoffset = 440 - (percent * 440);
                               const rotation = (cumulativePercent * 360);
                               cumulativePercent += percent;
                               return (
                                 <circle 
                                   key={cat.category} 
                                   cx="80" 
                                   cy="80" 
                                   r="70" 
                                   fill="transparent" 
                                   stroke={CORES_SVG[cat.category] || '#94a3b8'} 
                                   strokeWidth="18" 
                                   strokeDasharray="440" 
                                   strokeDashoffset={strokeDashoffset}
                                   style={{ transform: `rotate(${rotation}deg)`, transformOrigin: 'center' }}
                                   className="transition-all duration-500"
                                 />
                               );
                            });
                         })()
                       ) : (
                        <circle cx="80" cy="80" r="70" fill="transparent" stroke="#e2e8f0" strokeWidth="10" strokeDasharray="5,5" />
                       )}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-2xl font-bold text-gray-800">{totalLogs}</span>
                       <span className="text-[9px] font-bold text-gray-400 uppercase">Sessões</span>
                    </div>
                 </div>

                 <div className="space-y-3 w-full">
                    {filteredCategories.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-6 text-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" className="mb-2"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><polyline points="21 3 21 8 16 8"/></svg>
                        <p className="text-gray-400 italic text-xs font-medium">Nenhum dado registrado para o período.</p>
                      </div>
                    ) : (
                      filteredCategories.map((cat) => (
                        <div key={cat.category} className="flex flex-col">
                          <div className="flex justify-between text-xs font-bold mb-1.5">
                             <span className="text-gray-600 flex items-center gap-2">
                               <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CORES_SVG[cat.category] || '#94a3b8' }} />
                               {cat.category}
                             </span>
                             <span className="text-gray-800">{cat.log_count} <span className="text-[10px] text-gray-400 font-normal">({((cat.log_count / totalLogs) * 100).toFixed(0)}%)</span></span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                             <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(cat.log_count / totalLogs) * 100}%`, backgroundColor: CORES_SVG[cat.category] || '#94a3b8' }} />
                          </div>
                        </div>
                      ))
                    )}
                 </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-gray-800 mb-6">Taxa de Resposta</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between border border-gray-100">
                     <span className="text-xs font-bold text-gray-500 uppercase">Respondidas</span>
                     <span className="text-xl font-bold text-[#2E7D32]">{respondidas}</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between border border-gray-100">
                     <span className="text-xs font-bold text-gray-500 uppercase">Pendentes</span>
                     <span className="text-xl font-bold text-[#8B0000]">{abertas}</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-gray-100">
                 <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase mb-2">
                    <span>Aproveitamento Geral</span>
                    <span className="text-gray-700">{totalPerguntas > 0 ? ((respondidas / totalPerguntas) * 100).toFixed(0) : 0}%</span>
                 </div>
                 <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-[#2E7D32] transition-all duration-1000" style={{ width: totalPerguntas > 0 ? `${(respondidas / totalPerguntas) * 100}%` : '0%' }} />
                 </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-300 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-6">
                 <div>
                    <h3 className="font-bold text-gray-800">Últimos Atendimentos</h3>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Histórico recente de contato</span>
                 </div>
                 <button onClick={onNavigateToDuvidas} className="text-[#8B0000] text-xs font-bold uppercase underline hover:text-red-900 transition-colors">Gerenciar Todos</button>
              </div>
              <div className="space-y-3 overflow-y-auto max-h-[260px] pr-2 custom-scrollbar">
                {recentQuestions.length === 0 ? (
                  <div className="py-16 text-center flex flex-col items-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="2" className="mb-2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    <p className="text-gray-400 italic text-xs font-medium">Nenhuma interação registrada recentemente.</p>
                  </div>
                ) : (
                  recentQuestions.map((q) => (
                    <div key={q.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex justify-between items-center gap-6 hover:bg-gray-100/80 transition-colors">
                      <div className="truncate flex-1">
                        <span className="text-[10px] font-bold text-gray-400 block uppercase mb-0.5">{q.email}</span>
                        <p className="text-sm text-gray-700 truncate italic font-medium">"{q.message}"</p>
                      </div>
                      <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border shadow-sm ${q.status === 'RESPONDIDA' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                        {q.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}