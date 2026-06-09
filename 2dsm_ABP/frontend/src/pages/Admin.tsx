import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import PainelPerguntas from "./PainelPerguntas";
import PainelRelatorios from "./PainelRelatorios";

const logoFatec = "/logo-fatec.png";
const logoCps = "/logo-cps.png";

type Status = "ABERTA" | "ATENDIMENTO" | "RESPONDIDA";

interface SupportContact {
  id: number;
  email: string;
  message: string;
  status: Status;
  created_at: string;
  closed_at: string | null;
  answered_by: string | null;
}

type Tab = "duvidas" | "painel" | "relatorio";

export default function Admin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("duvidas");
  const [duvidas, setDuvidas] = useState<SupportContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [msgRespondida, setMsgRespondida] = useState(false);
  const [duvidaSelecionada, setDuvidaSelecionada] = useState<SupportContact | null>(null);

  // Controle de Acesso
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  const isAdmin = user?.role === 'admin';
  
  // Filtros para Dúvidas
  const [busca, setFiltroBusca] = useState('');

  useEffect(() => {
    fetchDuvidas();
  }, []);

  async function fetchDuvidas() {
    setLoading(true);
    setDuvidaSelecionada(null);
    try {
      const { data } = await api.get<SupportContact[]>("/admin/perguntas?limit=100");
      setDuvidas(data);
    } catch {
      setDuvidas([]);
    } finally {
      setLoading(false);
    }
  }

  async function marcarRespondido(id: number) {
    try {
      await api.patch(`/admin/perguntas/${id}`, { status: "RESPONDIDA", answered_by: null });
      setDuvidas((prev) => prev.map(d => d.id === id ? { ...d, status: 'RESPONDIDA' as Status } : d));
      if (duvidaSelecionada?.id === id) {
        setDuvidaSelecionada(prev => prev ? { ...prev, status: 'RESPONDIDA' as Status } : null);
      }
      setMsgRespondida(true);
      setTimeout(() => setMsgRespondida(false), 3000);
    } catch {
      alert("Erro ao atualizar status.");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const duvidasFiltradas = useMemo(() => {
    return duvidas.filter(d => {
      return d.email.toLowerCase().includes(busca.toLowerCase()) || d.message.toLowerCase().includes(busca.toLowerCase());
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [duvidas, busca]);

  const pendentes = duvidasFiltradas.filter(d => d.status === 'ABERTA');
  const respondidas = duvidasFiltradas.filter(d => d.status === 'RESPONDIDA');
  const total = duvidas.length;
  const totalPendentes = duvidas.filter(d => d.status === 'ABERTA').length;
  const totalRespondidas = duvidas.filter(d => d.status === 'RESPONDIDA').length;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#EFEFEF] font-sans text-gray-800">
      <header className="bg-white px-6 py-2.5 flex items-center justify-between shadow-md border-b border-gray-200 z-30 shrink-0">
        <div className="flex items-center gap-4">
          <img src={logoFatec} alt="FATEC Jacareí" className="h-12 object-contain" />
          <div className="w-px h-9 bg-gray-300 hidden md:block" />
          <img src={logoCps} alt="Centro Paula Souza" className="h-12 object-contain hidden md:block" />
        </div>
        <div className="flex items-center gap-4">
           {isAdmin && <span className="text-xs font-bold text-gray-400 uppercase hidden md:inline-block">Perfil: Administrador</span>}
           {!isAdmin && <span className="text-xs font-bold text-gray-400 uppercase hidden md:inline-block">Perfil: Secretaria</span>}
           <div className="flex items-center border border-gray-300 rounded overflow-hidden w-64 bg-white">
             <input type="text" placeholder="Localizar global..." className="border-none outline-none px-3 py-2 text-sm text-gray-600 w-full" readOnly />
             <button className="bg-[#8B0000] text-white px-3 py-2 flex items-center justify-center">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
             </button>
           </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <aside className="w-64 bg-[#8B0000] flex flex-col shadow-inner pt-4 shrink-0 h-full">
          <nav className="flex-1 space-y-2 px-3">
            <button onClick={() => setTab("duvidas")} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-bold transition-all ${tab === "duvidas" ? "bg-white text-[#8B0000] shadow" : "text-white hover:bg-white/10"}`}>
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
               <span className="flex-1 text-left">Suporte e Dúvidas</span>
               {totalPendentes > 0 && (
                 <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${tab === "duvidas" ? "bg-red-100 text-red-700" : "bg-white/20 text-white"}`}>{totalPendentes}</span>
               )}
            </button>
            <button onClick={() => setTab("painel")} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-bold transition-all ${tab === "painel" ? "bg-white text-[#8B0000] shadow" : "text-white hover:bg-white/10"}`}>
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>
               <span className="flex-1 text-left">Fluxogramas</span>
            </button>
            {isAdmin && (
               <button onClick={() => setTab("relatorio")} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-bold transition-all ${tab === "relatorio" ? "bg-white text-[#8B0000] shadow" : "text-white hover:bg-white/10"}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                  <span className="flex-1 text-left">Estatísticas</span>
               </button>
            )}
          </nav>
          <div className="p-4 border-t border-white/10 mt-auto">
            <button onClick={handleLogout} className="w-full bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold py-3 px-4 rounded transition-all flex items-center justify-center gap-2 uppercase tracking-widest border border-white/20">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sair
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {tab === "duvidas" && (
            <div className="max-w-7xl mx-auto h-full flex flex-col gap-6">
              
              {/* HEADER E RESUMO RÁPIDO */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Suporte ao Usuário</h1>
                  <p className="text-gray-500 text-sm">Gerencie as dúvidas e solicitações enviadas pelo chatbot</p>
                </div>
                
                <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-lg border border-gray-200 shadow-sm">
                   <div className="text-center pr-4 border-r border-gray-100">
                      <span className="block text-xl font-black text-gray-700 leading-none">{total}</span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase">Total</span>
                   </div>
                   <div className="text-center pr-4 border-r border-gray-100">
                      <span className="block text-xl font-black text-red-600 leading-none">{totalPendentes}</span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase">Pendentes</span>
                   </div>
                   <div className="text-center">
                      <span className="block text-xl font-black text-green-600 leading-none">{totalRespondidas}</span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase">Respondidas</span>
                   </div>
                </div>

                <button onClick={fetchDuvidas} className="flex items-center gap-2 bg-white border border-gray-300 px-5 py-3 rounded-lg text-[#8B0000] text-xs font-bold uppercase hover:bg-gray-50 transition-colors shadow-sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 1 0 2.13-5.85L7 8"/></svg>
                  Atualizar Lista
                </button>
              </div>

              {msgRespondida && (
                 <div className="shrink-0 bg-green-50 text-green-800 border border-green-200 p-3 rounded-lg shadow-sm text-sm font-bold flex items-center gap-3 animate-fadeIn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    Atendimento marcado como concluído com sucesso!
                 </div>
              )}

              {/* LAYOUT MESTRE-DETALHE */}
              <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-[500px]">
                
                {/* COLUNA ESQUERDA: LISTA (MESTRE) */}
                <div className="w-full md:w-[400px] flex flex-col gap-4 shrink-0">
                   
                   {/* Busca */}
                   <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 shrink-0">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                      </span>
                      <input 
                        type="text" 
                        value={busca} 
                        onChange={e => setFiltroBusca(e.target.value)} 
                        placeholder="Buscar e-mail ou dúvida..." 
                        className="w-full bg-transparent border-none pl-12 pr-4 py-3.5 text-sm outline-none font-medium placeholder-gray-400" 
                      />
                   </div>

                   <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                      {loading ? (
                         <div className="p-8 text-center text-gray-400 italic font-bold">Carregando fila...</div>
                      ) : duvidasFiltradas.length === 0 ? (
                         <div className="p-8 text-center text-gray-400 italic font-bold">Nenhuma dúvida encontrada.</div>
                      ) : (
                         <>
                            {/* GRUPO PENDENTES */}
                            {pendentes.length > 0 && (
                               <div className="space-y-3">
                                  <h3 className="text-xs font-black text-red-700 uppercase tracking-wider flex items-center gap-2">
                                     <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                                     Pendentes ({pendentes.length})
                                  </h3>
                                  <div className="space-y-2">
                                     {pendentes.map(d => (
                                        <button 
                                          key={d.id}
                                          onClick={() => setDuvidaSelecionada(d)}
                                          className={`w-full text-left p-4 rounded-lg border transition-all ${duvidaSelecionada?.id === d.id ? 'bg-red-50 border-red-200 shadow-md ring-1 ring-red-200' : 'bg-white border-gray-200 hover:border-red-300 shadow-sm hover:shadow'}`}
                                        >
                                           <div className="flex justify-between items-start mb-2">
                                              <span className="font-bold text-gray-800 text-sm truncate pr-4">{d.email}</span>
                                              <span className="text-[10px] font-bold text-gray-400 shrink-0">{new Date(d.created_at).toLocaleDateString('pt-BR')}</span>
                                           </div>
                                           <p className="text-gray-600 text-xs italic line-clamp-2 leading-relaxed">"{d.message}"</p>
                                        </button>
                                     ))}
                                  </div>
                               </div>
                            )}

                            {/* GRUPO RESPONDIDAS */}
                            {respondidas.length > 0 && (
                               <div className="space-y-3">
                                  <h3 className="text-xs font-black text-green-700 uppercase tracking-wider flex items-center gap-2 opacity-70">
                                     <span className="w-2 h-2 rounded-full bg-green-600" />
                                     Respondidas ({respondidas.length})
                                  </h3>
                                  <div className="space-y-2 opacity-70 hover:opacity-100 transition-opacity">
                                     {respondidas.map(d => (
                                        <button 
                                          key={d.id}
                                          onClick={() => setDuvidaSelecionada(d)}
                                          className={`w-full text-left p-4 rounded-lg border transition-all ${duvidaSelecionada?.id === d.id ? 'bg-green-50 border-green-200 shadow-md ring-1 ring-green-200' : 'bg-white border-gray-200 hover:border-green-300 shadow-sm hover:shadow'}`}
                                        >
                                           <div className="flex justify-between items-start mb-2">
                                              <span className="font-bold text-gray-700 text-sm truncate pr-4">{d.email}</span>
                                              <span className="text-[10px] font-bold text-gray-400 shrink-0">{new Date(d.created_at).toLocaleDateString('pt-BR')}</span>
                                           </div>
                                           <p className="text-gray-500 text-xs italic line-clamp-1 leading-relaxed">"{d.message}"</p>
                                        </button>
                                     ))}
                                  </div>
                               </div>
                            )}
                         </>
                      )}
                   </div>
                </div>

                {/* COLUNA DIREITA: DETALHES (DETAIL) */}
                <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col overflow-hidden">
                   {!duvidaSelecionada ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4 p-8">
                         <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                         <p className="text-sm font-medium">Selecione uma dúvida na lista ao lado para visualizar os detalhes e realizar o atendimento.</p>
                      </div>
                   ) : (
                      <>
                         {/* Header do Detalhe */}
                         <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-wrap justify-between items-start gap-4">
                            <div>
                               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Remetente</span>
                               <h2 className="text-xl font-bold text-gray-800">{duvidaSelecionada.email}</h2>
                               <span className="text-xs text-gray-500 font-medium mt-1 block">Enviado em {new Date(duvidaSelecionada.created_at).toLocaleDateString('pt-BR')} às {new Date(duvidaSelecionada.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${duvidaSelecionada.status === 'RESPONDIDA' ? "bg-green-100 border-green-200 text-green-800" : "bg-red-100 border-red-200 text-red-800"}`}>
                               {duvidaSelecionada.status === 'RESPONDIDA' ? 'Atendimento Concluído' : 'Aguardando Atendimento'}
                            </span>
                         </div>

                         {/* Corpo da Mensagem */}
                         <div className="flex-1 p-6 overflow-y-auto">
                            <span className="text-[10px] font-black text-[#8B0000] uppercase tracking-widest mb-4 block">Mensagem Recebida</span>
                            <div className="bg-[#F9F9F9] border border-gray-200 rounded-lg p-6 shadow-inner">
                               <p className="text-gray-700 text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
                                  {duvidaSelecionada.message}
                               </p>
                            </div>
                         </div>

                         {/* Footer de Ações */}
                         <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-wrap justify-end gap-3">
                            <button 
                              onClick={() => navigator.clipboard.writeText(duvidaSelecionada.email)}
                              className="px-6 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-700 text-xs font-bold uppercase hover:bg-gray-100 transition-colors shadow-sm flex items-center gap-2"
                            >
                               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                               Copiar E-mail
                            </button>
                            
                            {duvidaSelecionada.status === 'ABERTA' && (
                               <button 
                                 onClick={() => marcarRespondido(duvidaSelecionada.id)}
                                 className="px-6 py-2.5 rounded-lg bg-[#2E7D32] border border-green-800 text-white text-xs font-bold uppercase hover:bg-green-800 transition-colors shadow-md flex items-center gap-2"
                               >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                                  Marcar como Concluída
                               </button>
                            )}
                         </div>
                      </>
                   )}
                </div>
              </div>
            </div>
          )}

          {tab === "painel" && <PainelPerguntas isAdmin={isAdmin} />}
          {tab === "relatorio" && <PainelRelatorios onNavigateToDuvidas={() => setTab("duvidas")} />}
        </main>
      </div>
    </div>
  );
}