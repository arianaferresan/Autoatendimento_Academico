import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import logoFatec from '../assets/logo-fatec.png';
import logoCps from '../assets/logo-cps.png';

type Status = 'ABERTA' | 'ATENDIMENTO' | 'RESPONDIDA';

interface SupportContact {
  id: number;
  email: string;
  message: string;
  status: Status;
  created_at: string;
  closed_at: string | null;
  answered_by: string | null;
}

type Tab = 'duvidas' | 'painel' | 'relatorio';

export default function Admin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('duvidas');
  const [duvidas, setDuvidas] = useState<SupportContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [msgRespondida, setMsgRespondida] = useState(false);

  useEffect(() => {
    if (tab === 'duvidas') fetchDuvidas();
  }, [tab]);

  async function fetchDuvidas() {
    setLoading(true);
    try {
      const { data } = await api.get<SupportContact[]>('/admin/perguntas/status/ABERTA?offset=0');
      setDuvidas(data);
    } catch {
      setDuvidas([]);
    } finally {
      setLoading(false);
    }
  }

  async function marcarRespondido(id: number) {
    try {
      await api.patch(`/admin/perguntas/${id}`, { status: 'RESPONDIDA', answered_by: null });
      setDuvidas(prev => prev.filter(d => d.id !== id));
      setMsgRespondida(true);
      setTimeout(() => setMsgRespondida(false), 3000);
    } catch {
      alert('Erro ao atualizar status.');
    }
  }

  async function atualizarStatus(id: number, novoStatus: Status) {
    try {
      await api.patch(`/admin/perguntas/${id}`, { status: novoStatus, answered_by: null });
      setDuvidas(prev => prev.map(d => d.id === id ? { ...d, status: novoStatus } : d));
    } catch {
      alert('Erro ao atualizar status.');
    }
  }

  function handleSair() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  const abertas = duvidas.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      <header style={{
        backgroundColor: '#fff',
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src={logoFatec} alt="FATEC Jacareí" style={{ height: '50px', objectFit: 'contain' }} />
          <div style={{ width: '1px', height: '36px', backgroundColor: '#ccc' }} />
          <img src={logoCps} alt="Centro Paula Souza" style={{ height: '50px', objectFit: 'contain' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
          <input type="text" placeholder="O que deseja localizar?" readOnly
            style={{ border: 'none', outline: 'none', padding: '8px 12px', fontSize: '14px', color: '#555', width: '240px', backgroundColor: '#fff' }} />
          <button style={{ backgroundColor: '#8B0000', border: 'none', padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1 }}>

        <aside style={{
          width: '180px',
          backgroundColor: '#6B0000',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}>
          {(['painel', 'relatorio', 'duvidas'] as Tab[]).map((t) => {
            const labels: Record<Tab, string> = {
              painel: 'Painel de perguntas',
              relatorio: 'Relatório',
              duvidas: 'Dúvidas recebidas',
            };
            const active = tab === t;
            return (
              <button key={t} onClick={() => setTab(t)}
                style={{
                  background: active ? 'rgba(0,0,0,0.25)' : 'none',
                  border: 'none',
                  borderLeft: active ? '3px solid #fff' : '3px solid transparent',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: active ? 600 : 400,
                  padding: '14px 16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                }}>
                {labels[t]}
                {t === 'duvidas' && abertas > 0 && (
                  <span style={{
                    backgroundColor: '#1565C0',
                    color: '#fff',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 7px',
                    minWidth: '20px',
                    textAlign: 'center',
                  }}>{abertas}</span>
                )}
              </button>
            );
          })}

          <div style={{ flex: 1 }} />

          <button onClick={handleSair}
            style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)',
              fontSize: '14px', padding: '14px 16px', textAlign: 'left', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
            onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
          >
            Sair ⇥
          </button>
        </aside>

        <main style={{ flex: 1, backgroundColor: '#f4f4f4', padding: '24px' }}>
          {tab === 'duvidas' && (
            <>
              <div style={{
                backgroundColor: '#8B0000',
                borderRadius: '6px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ color: '#fff', fontSize: '11px', fontWeight: 600 }}>Curso</label>
                  <select style={{
                    padding: '6px 10px', borderRadius: '4px', border: 'none',
                    fontSize: '13px', backgroundColor: '#fff', color: '#333', cursor: 'pointer',
                  }}>
                    <option>Selecione o curso</option>
                  </select>
                </div>
                <div style={{ flex: 1 }} />
                <button style={{
                  backgroundColor: 'transparent', border: '2px solid #fff', color: '#fff',
                  padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px',
                  fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  <span style={{ fontSize: '16px' }}>+</span> Criar novo item
                </button>
                <button style={{
                  backgroundColor: 'transparent', border: '2px solid #fff', color: '#fff',
                  padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px',
                  fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  ↑ Importar/exportar
                </button>
              </div>

              {msgRespondida && (
                <div style={{
                  backgroundColor: '#2E7D32', color: '#fff',
                  borderRadius: '6px', padding: '14px 20px',
                  textAlign: 'center', fontWeight: 600, fontSize: '15px',
                  marginBottom: '16px',
                }}>
                  Mensagem respondida!
                </div>
              )}

              {loading ? (
                <p style={{ color: '#888', textAlign: 'center', marginTop: '40px' }}>Carregando...</p>
              ) : duvidas.length === 0 ? (
                <p style={{ color: '#888', textAlign: 'center', marginTop: '40px' }}>Nenhuma dúvida aberta.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {duvidas.map((d) => (
                    <div key={d.id} style={{
                      backgroundColor: '#fff',
                      borderRadius: '6px',
                      padding: '16px 20px',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '15px', color: '#222' }}>{d.email}</p>
                      <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>{d.message}</p>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {(['ABERTA', 'ATENDIMENTO', 'RESPONDIDA'] as Status[]).map((s) => {
                            const cor = s === 'ABERTA' ? '#E53935' : s === 'ATENDIMENTO' ? '#F9A825' : '#2E7D32';
                            const label = s === 'ABERTA' ? 'Aberta' : s === 'ATENDIMENTO' ? 'Em atendimento' : 'Respondida';
                            const ativo = d.status === s;
                            return (
                              <button key={s} onClick={() => atualizarStatus(d.id, s)}
                                title={label}
                                style={{
                                  display: 'flex', alignItems: 'center', gap: '5px',
                                  padding: '5px 10px', borderRadius: '999px', cursor: 'pointer', fontSize: '12px',
                                  fontWeight: ativo ? 700 : 400,
                                  border: ativo ? `2px solid ${cor}` : '2px solid #ddd',
                                  backgroundColor: ativo ? `${cor}18` : '#fff',
                                  color: ativo ? cor : '#999',
                                }}
                              >
                                <span style={{
                                  width: '8px', height: '8px', borderRadius: '50%',
                                  backgroundColor: ativo ? cor : '#ddd',
                                  flexShrink: 0,
                                }} />
                                {label}
                              </button>
                            );
                          })}
                        </div>
                        <button onClick={() => marcarRespondido(d.id)}
                          style={{
                            backgroundColor: '#2E7D32', color: '#fff', border: 'none',
                            borderRadius: '4px', padding: '7px 16px', fontSize: '13px',
                            fontWeight: 600, cursor: 'pointer',
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1B5E20'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2E7D32'}
                        >
                          Marcar como respondido
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {tab !== 'duvidas' && (
            <p style={{ color: '#888', textAlign: 'center', marginTop: '60px', fontSize: '16px' }}>
              Em construção.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
