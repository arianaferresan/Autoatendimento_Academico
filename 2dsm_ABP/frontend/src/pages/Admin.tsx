import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import PainelPerguntas from "./PainelPerguntas";
import PainelRelatorios from "./PainelRelatorios";
import PainelUsuarios from "./PainelUsuarios";
import MinhaConta from "./MinhaConta";

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
  answered_by: number | null;
  answered_by_name?: string | null;
}

type Tab = "duvidas" | "painel" | "relatorio" | "usuarios" | "minhaConta";

export default function Admin() {
  const navigate = useNavigate();
  const [duvidas, setDuvidas] = useState<SupportContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [msgRespondida, setMsgRespondida] = useState(false);
  const [duvidaSelecionada, setDuvidaSelecionada] = useState<SupportContact | null>(null);

  // Controle de Acesso
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  const isAdmin = user?.role === 'admin';
  const [mustChangePassword, setMustChangePassword] = useState(Boolean(user?.mustChangePassword));
  const [tab, setTab] = useState<Tab>(mustChangePassword ? "minhaConta" : "duvidas");
  const [passwordRequestCount, setPasswordRequestCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // Filtros para Dúvidas
  const [busca, setFiltroBusca] = useState('');

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    fetchDuvidas();
    if (isAdmin) fetchPasswordRequestCount();
  }, []);

  async function fetchPasswordRequestCount() {
    try {
      const { data } = await api.get("/users/password-reset-requests?status=pendente");
      setPasswordRequestCount(Array.isArray(data) ? data.length : 0);
    } catch {
      setPasswordRequestCount(0);
    }
  }

  function openTab(nextTab: Tab) {
    setTab(nextTab);
    setMenuOpen(false);
  }

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
      const { data } = await api.patch<SupportContact>(`/admin/perguntas/${id}`, { status: "RESPONDIDA" });
      setDuvidas((prev) => prev.map(d => d.id === id ? data : d));
      if (duvidaSelecionada?.id === id) {
        setDuvidaSelecionada(data);
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

  function renderInlineDuvidaDetalhe(duvida: SupportContact) {
    return (
      <div className="xl:hidden -mt-1 rounded-b-lg border border-t-0 border-gray-200 bg-white p-4 shadow-sm animate-fadeIn">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div>
            <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Remetente</span>
            <h2 className="text-sm font-black text-gray-800 break-all">{duvida.email}</h2>
            <span className="mt-1 block text-[11px] font-bold text-gray-500">
              {new Date(duvida.created_at).toLocaleDateString('pt-BR')} às {new Date(duvida.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${duvida.status === 'RESPONDIDA' ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}>
            {duvida.status === 'RESPONDIDA' ? 'Concluído' : 'Aberto'}
          </span>
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
          <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-[#8B0000]">Mensagem</span>
          <p className="whitespace-pre-wrap text-sm font-medium leading-relaxed text-gray-700">{duvida.message}</p>
        </div>

        <div className="mt-3 flex flex-col sm:flex-row sm:justify-end gap-2">
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(duvida.email)}
            className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-bold uppercase text-gray-700 hover:bg-gray-50"
          >
            Copiar E-mail
          </button>
          {duvida.status === 'ABERTA' && (
            <button
              type="button"
              onClick={() => marcarRespondido(duvida.id)}
              className="inline-flex justify-center rounded-lg border border-green-800 bg-[#2E7D32] px-4 py-2 text-xs font-bold uppercase text-white hover:bg-green-800"
            >
              Marcar como Concluída
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen lg:h-screen lg:overflow-hidden bg-[#F3F4F6] font-sans text-gray-800">
      {menuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/35 lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-label="Fechar menu"
        />
      )}

      <header className="bg-white px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-sm border-b border-gray-200 z-50 shrink-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          </button>
          <img src={logoFatec} alt="FATEC Jacareí" className="h-12 object-contain" />
          <div className="w-px h-9 bg-gray-300 hidden md:block" />
          <img src={logoCps} alt="Centro Paula Souza" className="h-12 object-contain hidden md:block" />
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
           {isAdmin && <span className="text-xs font-bold text-gray-400 uppercase hidden md:inline-block">Perfil: Administrador</span>}
           {!isAdmin && <span className="text-xs font-bold text-gray-400 uppercase hidden md:inline-block">Perfil: Secretaria</span>}
           <div className="hidden sm:flex items-center border border-gray-300 rounded overflow-hidden w-48 lg:w-64 bg-white">
             <input type="text" placeholder="Localizar global..." className="border-none outline-none px-3 py-2 text-sm text-gray-600 w-full" readOnly />
             <button className="bg-[#8B0000] text-white px-3 py-2 flex items-center justify-center">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
             </button>
           </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col lg:flex-row lg:overflow-hidden relative">
        <aside className={`fixed inset-y-0 left-0 z-50 w-[min(16rem,86vw)] bg-[#7F0D0D] flex flex-col shadow-2xl pt-3 shrink-0 lg:static lg:z-auto lg:h-full transform transition-transform duration-200 lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
          <div className="flex items-center justify-between px-3 pb-3 lg:hidden">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Menu</span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 text-white hover:bg-white/10"
              aria-label="Fechar menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </svg>
            </button>
          </div>
          <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto px-3 pb-3 lg:pb-0">
            <button disabled={mustChangePassword} onClick={() => openTab("duvidas")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-bold transition-all ${tab === "duvidas" ? "bg-white text-[#8B0000] shadow-sm" : "text-white/90 hover:bg-white/10"} ${mustChangePassword ? "opacity-50 cursor-not-allowed" : ""}`}>
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
               <span className="flex-1 text-left">Suporte e Dúvidas</span>
               {totalPendentes > 0 && (
                 <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${tab === "duvidas" ? "bg-red-100 text-red-700" : "bg-white/20 text-white"}`}>{totalPendentes}</span>
               )}
            </button>
            <button disabled={mustChangePassword} onClick={() => openTab("painel")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-bold transition-all ${tab === "painel" ? "bg-white text-[#8B0000] shadow-sm" : "text-white/90 hover:bg-white/10"} ${mustChangePassword ? "opacity-50 cursor-not-allowed" : ""}`}>
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>
               <span className="flex-1 text-left">Fluxogramas</span>
            </button>
            {isAdmin && (
               <button disabled={mustChangePassword} onClick={() => openTab("relatorio")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-bold transition-all ${tab === "relatorio" ? "bg-white text-[#8B0000] shadow-sm" : "text-white/90 hover:bg-white/10"} ${mustChangePassword ? "opacity-50 cursor-not-allowed" : ""}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                  <span className="flex-1 text-left">Estatísticas</span>
               </button>
            )}
          </nav>
          <div className="p-3 lg:p-4 border-t border-white/10 mt-auto flex flex-col gap-1.5">
            {isAdmin && (
              <button disabled={mustChangePassword} onClick={() => openTab("usuarios")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-bold transition-all ${tab === "usuarios" ? "bg-white text-[#8B0000] shadow-sm" : "text-white/90 hover:bg-white/10"} ${mustChangePassword ? "opacity-50 cursor-not-allowed" : ""}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span className="flex-1 text-left">Usuários</span>
                {passwordRequestCount > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${tab === "usuarios" ? "bg-red-100 text-red-700" : "bg-white/20 text-white"}`}>{passwordRequestCount}</span>
                )}
              </button>
            )}
            <button onClick={() => openTab("minhaConta")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-bold transition-all ${tab === "minhaConta" ? "bg-white text-[#8B0000] shadow-sm" : "text-white/90 hover:bg-white/10"}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>
              <span className="flex-1 text-left">Minha conta</span>
            </button>
            <button onClick={handleLogout} className="w-full bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-2 uppercase tracking-widest border border-white/15 mt-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sair
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          {mustChangePassword && (
            <div className="max-w-4xl mx-auto mb-4 p-3 rounded-lg border border-yellow-200 bg-yellow-50 text-yellow-900 text-sm font-bold">
              Altere sua senha provisoria para liberar o acesso ao painel.
            </div>
          )}
          {tab === "duvidas" && (
            <div className="w-full max-w-[1040px] mx-auto flex flex-col space-y-4">

              {/* HEADER E RESUMO RÁPIDO */}
              <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-3 shrink-0">
                <div>
                  <h1 className="text-xl font-black text-gray-800">Suporte ao Usuário</h1>
                  <p className="text-gray-500 text-sm">Gerencie as dúvidas e solicitações enviadas pelo chatbot</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 bg-white px-4 py-2.5 rounded-lg border border-gray-200 shadow-sm">
                   <div className="text-center pr-3 border-r border-gray-100">
                      <span className="block text-lg font-black text-gray-700 leading-none">{total}</span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase">Total</span>
                   </div>
                   <div className="text-center pr-3 border-r border-gray-100">
                      <span className="block text-lg font-black text-red-600 leading-none">{totalPendentes}</span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase">Pendentes</span>
                   </div>
                   <div className="text-center">
                      <span className="block text-lg font-black text-green-600 leading-none">{totalRespondidas}</span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase">Respondidas</span>
                   </div>
                </div>

                <button onClick={fetchDuvidas} className="flex items-center justify-center gap-2 bg-white border border-gray-300 px-4 py-2.5 rounded-lg text-[#8B0000] text-xs font-bold uppercase hover:bg-gray-50 transition-colors shadow-sm">
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
              <div className="flex-1 flex flex-col xl:flex-row gap-4 min-h-[420px] xl:min-h-[500px]">

                {/* COLUNA ESQUERDA: LISTA (MESTRE) */}
                <div className="w-full xl:w-[32rem] flex flex-col gap-4 shrink-0">

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
                                        <div key={d.id}>
                                          <button
                                            type="button"
                                            onClick={() => setDuvidaSelecionada((prev) => prev?.id === d.id ? null : d)}
                                            className={`w-full text-left p-3.5 rounded-lg border transition-all ${duvidaSelecionada?.id === d.id ? 'bg-red-50 border-red-200 shadow-md ring-1 ring-red-200 xl:rounded-b-lg rounded-b-none' : 'bg-white border-gray-200 hover:border-red-300 shadow-sm hover:shadow'}`}
                                          >
                                             <div className="flex justify-between items-start gap-3 mb-2">
                                                <span className="font-bold text-gray-800 text-sm truncate">{d.email}</span>
                                                <div className="flex items-center gap-2 shrink-0">
                                                  <span className="text-[10px] font-bold text-gray-400">{new Date(d.created_at).toLocaleDateString('pt-BR')}</span>
                                                  <span className="text-gray-400 xl:hidden">{duvidaSelecionada?.id === d.id ? "▾" : "▸"}</span>
                                                </div>
                                             </div>
                                             <p className="text-gray-600 text-xs italic line-clamp-2 leading-relaxed">"{d.message}"</p>
                                          </button>
                                          {duvidaSelecionada?.id === d.id && renderInlineDuvidaDetalhe(d)}
                                        </div>
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
                                        <div key={d.id}>
                                          <button
                                            type="button"
                                            onClick={() => setDuvidaSelecionada((prev) => prev?.id === d.id ? null : d)}
                                            className={`w-full text-left p-3.5 rounded-lg border transition-all ${duvidaSelecionada?.id === d.id ? 'bg-green-50 border-green-200 shadow-md ring-1 ring-green-200 xl:rounded-b-lg rounded-b-none' : 'bg-white border-gray-200 hover:border-green-300 shadow-sm hover:shadow'}`}
                                          >
                                             <div className="flex justify-between items-start gap-3 mb-2">
                                                <span className="font-bold text-gray-700 text-sm truncate">{d.email}</span>
                                                <div className="flex items-center gap-2 shrink-0">
                                                  <span className="text-[10px] font-bold text-gray-400">{new Date(d.created_at).toLocaleDateString('pt-BR')}</span>
                                                  <span className="text-gray-400 xl:hidden">{duvidaSelecionada?.id === d.id ? "▾" : "▸"}</span>
                                                </div>
                                             </div>
                                             <p className="text-gray-500 text-xs italic line-clamp-1 leading-relaxed">"{d.message}"</p>
                                          </button>
                                          {duvidaSelecionada?.id === d.id && renderInlineDuvidaDetalhe(d)}
                                        </div>
                                     ))}
                                  </div>
                               </div>
                            )}
                         </>
                      )}
                   </div>
                </div>

                {/* COLUNA DIREITA: DETALHES (DETAIL) */}
                <div className="hidden xl:flex flex-1 bg-white rounded-lg border border-gray-200 shadow-sm flex-col overflow-hidden">
                   {!duvidaSelecionada ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4 p-8">
                         <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                         <p className="text-sm font-medium">Selecione uma dúvida na lista ao lado para visualizar os detalhes e realizar o atendimento.</p>
                      </div>
                   ) : (
                      <>
                         {/* Header do Detalhe */}
                         <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50/50 flex flex-wrap justify-between items-start gap-4">
                            <div>
                               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Remetente</span>
                               <h2 className="text-xl font-bold text-gray-800">{duvidaSelecionada.email}</h2>
                               <span className="text-xs text-gray-500 font-medium mt-1 block">Enviado em {new Date(duvidaSelecionada.created_at).toLocaleDateString('pt-BR')} às {new Date(duvidaSelecionada.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="flex flex-col items-start md:items-end gap-1">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${duvidaSelecionada.status === 'RESPONDIDA' ? "bg-green-100 border-green-200 text-green-800" : "bg-red-100 border-red-200 text-red-800"}`}>
                                 {duvidaSelecionada.status === 'RESPONDIDA' ? 'Atendimento Concluído' : 'Aguardando Atendimento'}
                              </span>
                              {duvidaSelecionada.status === 'RESPONDIDA' && duvidaSelecionada.answered_by_name && (
                                <span className="text-[11px] font-bold text-gray-500">
                                  Respondida por: {duvidaSelecionada.answered_by_name}
                                </span>
                              )}
                            </div>
                         </div>

                         {/* Corpo da Mensagem */}
                         <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                            <span className="text-[10px] font-black text-[#8B0000] uppercase tracking-widest mb-4 block">Mensagem Recebida</span>
                            <div className="bg-[#F9F9F9] border border-gray-200 rounded-lg p-4 sm:p-6 shadow-inner">
                               <p className="text-gray-700 text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
                                  {duvidaSelecionada.message}
                               </p>
                            </div>
                         </div>

                         {/* Footer de Ações */}
                         <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50 flex flex-wrap justify-end gap-3">
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
          {tab === "usuarios" && isAdmin && (
            <PainelUsuarios
              pendingPasswordRequestCount={passwordRequestCount}
              onPasswordRequestCountChange={setPasswordRequestCount}
            />
          )}
          {tab === "minhaConta" && <MinhaConta onPasswordChanged={() => setMustChangePassword(false)} />}
        </main>
      </div>
    </div>
  );
}
