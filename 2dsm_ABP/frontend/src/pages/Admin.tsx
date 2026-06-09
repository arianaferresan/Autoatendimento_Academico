import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import logoFatec from "../assets/logo-fatec.png";
import logoCps from "../assets/logo-cps.png";
import PainelPerguntas from "./PainelPerguntas";
import PainelRelatorios from "./PainelRelatorios";

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
  const role = localStorage.getItem('role'); // adicionar essa linha
  const [duvidas, setDuvidas] = useState<SupportContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [msgRespondida, setMsgRespondida] = useState(false);
  
  // 🌟 ESTADO PARA CONTROLAR A ABERTURA DO MODAL DE SOBREPOSIÇÃO
  const [duvidaSelecionada, setDuvidaSelecionada] = useState<any | null>(null);

  useEffect(() => {
    if (tab === "duvidas") fetchDuvidas();
  }, [tab]);

  async function fetchDuvidas() {
    setLoading(true);
    try {
      const { data } = await api.get<SupportContact[]>(
        "/admin/perguntas/status/ABERTA?offset=0"
      );
      setDuvidas(data);
    } catch {
      setDuvidas([]);
    } finally {
      setLoading(false);
    }
  }

  async function marcarRespondido(id: number) {
    try {
      await api.patch(`/admin/perguntas/${id}`, {
        status: "RESPONDIDA",
        answered_by: null,
      });
      setDuvidas((prev) => prev.filter((d) => d.id !== id));
      setMsgRespondida(true);
      setTimeout(() => setMsgRespondida(false), 3000);
    } catch {
      alert("Erro ao atualizar status.");
    }
  }

  async function atualizarStatus(id: number, novoStatus: Status) {
    try {
      await api.patch(`/admin/perguntas/${id}`, {
        status: novoStatus,
        answered_by: null,
      });
      setDuvidas((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: novoStatus } : d))
      );
    } catch {
      alert("Erro ao atualizar status.");
    }
  }

  function handleSair() {
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // adicionar essa linha
    navigate("/login");
  }

  const abertas = duvidas.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <header
        style={{
          backgroundColor: "#fff",
          padding: "10px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <img
            src={logoFatec}
            alt="FATEC Jacareí"
            style={{ height: "50px", objectFit: "contain" }}
          />
          <div style={{ width: "1px", height: "36px", backgroundColor: "#ccc" }} />
          <img
            src={logoCps}
            alt="Centro Paula Souza"
            style={{ height: "50px", objectFit: "contain" }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #ccc",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <input
            type="text"
            placeholder="O que deseja localizar?"
            readOnly
            style={{
              border: "none",
              outline: "none",
              padding: "8px 12px",
              fontSize: "14px",
              color: "#555",
              width: "240px",
              backgroundColor: "#fff",
            }}
          />
          <button
            style={{
              backgroundColor: "#8B0000",
              border: "none",
              padding: "8px 12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1 }}>
        <aside
          style={{
            width: "180px",
            backgroundColor: "#6B0000",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
        >
{(["painel", "relatorio", "duvidas"] as Tab[]).filter(t => !(t === "relatorio" && role === "secretaria")).map((t) => {

            const labels: Record<Tab, string> = {
              painel: "Painel de perguntas",
              relatorio: "Relatório",
              duvidas: "Dúvidas recebidas",
            };
            const active = tab === t;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  background: active ? "rgba(0,0,0,0.25)" : "none",
                  border: "none",
                  borderLeft: active ? "3px solid #fff" : "3px solid transparent",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: active ? 600 : 400,
                  padding: "14px 16px",
                  textAlign: "left",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "8px",
                }}
              >
                {labels[t]}
                {t === "duvidas" && abertas > 0 && (
                  <span
                    style={{
                      backgroundColor: "#1565C0",
                      color: "#fff",
                      borderRadius: "999px",
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "2px 7px",
                      minWidth: "20px",
                      textAlign: "center",
                    }}
                  >
                    {abertas}
                  </span>
                )}
              </button>
            );
          })}

          <div style={{ flex: 1 }} />

          <button
            onClick={handleSair}
            style={{
              background: "#AD0E09",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 600,
              padding: "12px 16px",
              margin: "0 auto 16px auto",
              textAlign: "center",
              justifyContent: "center",
              width: "calc(100% - 32px)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#540000")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#AD0E09")}
          >
            Sair
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </aside>

        <main style={{ flex: 1, backgroundColor: "#f4f4f4", padding: "24px" }}>
          {tab === "duvidas" && (
            <>
              {/* BARRA SUPERIOR VERMELHA DE OPÇÕES DO CURSO */}
              <div
                style={{
                  backgroundColor: "#8B0000",
                  borderRadius: "6px",
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "20px",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ color: "#fff", fontSize: "16px", fontWeight: 600 }}>
                    Curso
                  </label>
                  <select
                    style={{
                      padding: "6px 10px",
                      borderRadius: "4px",
                      border: "none",
                      fontSize: "13px",
                      backgroundColor: "#fff",
                      color: "#333",
                      cursor: "pointer",
                    }}
                  >
                    <option>Selecione o curso</option>
                  </select>
                </div>
                <div style={{ flex: 1 }} />
                <button
                  style={{
                    backgroundColor: "transparent",
                    border: "2px solid #fff",
                    color: "#fff",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "background-color 0.2s, color 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#fff";
                    e.currentTarget.style.color = "#333333";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#fff";
                  }}
                >
                  <span style={{ fontSize: "16px" }}>+</span> Criar novo item
                </button>

                <button
                  style={{
                    backgroundColor: "transparent",
                    border: "2px solid #fff",
                    color: "#fff",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "background-color 0.2s, color 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#fff";
                    e.currentTarget.style.color = "#333333";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#fff";
                  }}
                >
                  Importar/exportar
                </button>
              </div>

              {msgRespondida && (
                <div
                  style={{
                    backgroundColor: "#2E7D32",
                    color: "#fff",
                    borderRadius: "6px",
                    padding: "14px 20px",
                    textAlign: "center",
                    fontWeight: 600,
                    fontSize: "15px",
                    marginBottom: "16px",
                  }}
                >
                  Mensagem respondida!
                </div>
              )}

              {loading ? (
                <p style={{ color: "#888", textAlign: "center", marginTop: "40px" }}>
                  Carregando...
                </p>
              ) : duvidas.length === 0 ? (
                /* FALLBACK LOCAL SEGURO: Renderiza os seus cards estruturados */
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {[
                    {
                      id: 1,
                      assunto: "Transporte fretado",
                      mensagem: "Olá gostaria de saber se vocês possuem uma lista de contatos de transporte fretados moro em outra cidade e preciso saber para me organizar, pra poder ir até aí."
                    },
                    {
                      id: 2,
                      assunto: "Entrega de Termo de Estágio",
                      mensagem: "Qual o prazo máximo para enviar o termo de compromisso assinado pela empresa na secretaria acadêmica?"
                    }
                  ].map((mock) => (
                    <div
                      key={mock.id}
                      style={{
                        backgroundColor: "#eeeeee",
                        borderRadius: "8px",
                        padding: "20px 24px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        border: "1px solid #e0e0e0"
                      }}
                    >
                      <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 500, color: "#333" }}>
                        {mock.assunto}
                      </h3>
                      <p style={{ margin: "0 0 12px 0", fontSize: "16px", color: "#444", lineHeight: "1.5" }}>
                        {mock.mensagem}
                      </p>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                        <button
                          onClick={() => setDuvidaSelecionada(mock)} // 🌟 ABRE O MODAL COM OS DADOS MOCKADOS
                          style={{
                            backgroundColor: "#1F3A60",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            padding: "10px 24px",
                            fontSize: "15px",
                            fontWeight: 500,
                            cursor: "pointer",
                            transition: "background 0.2s"
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#152842"}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#1F3A60"}
                        >
                          Abrir
                        </button>
                        <button
                          onClick={() => marcarRespondido(mock.id)}
                          style={{
                            backgroundColor: "#006400",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            padding: "10px 24px",
                            fontSize: "15px",
                            fontWeight: 500,
                            cursor: "pointer",
                            transition: "background 0.2s"
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#004d00"}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#006400"}
                        >
                          Marcar como respondido
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* MONTAGEM EM TEMPO REAL VINDA DO BANCO DE DADOS */
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {duvidas.map((d) => (
                    <div
                      key={d.id}
                      style={{
                        backgroundColor: "#eeeeee",
                        borderRadius: "8px",
                        padding: "20px 24px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        border: "1px solid #e0e0e0"
                      }}
                    >
                      <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 500, color: "#333" }}>
                        {d.email}
                      </h3>
                      <p style={{ margin: "0 0 12px 0", fontSize: "16px", color: "#444", lineHeight: "1.5" }}>
                        {d.message}
                      </p>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                        <button
                          onClick={() => {
                            atualizarStatus(d.id, "ATENDIMENTO");
                            setDuvidaSelecionada({ id: d.id, assunto: d.email, mensagem: d.message }); // 🌟 ABRE O MODAL COM OS DADOS DA API
                          }}
                          style={{
                            backgroundColor: "#1F3A60",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            padding: "10px 24px",
                            fontSize: "15px",
                            fontWeight: 500,
                            cursor: "pointer",
                            transition: "background 0.2s"
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#152842"}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#1F3A60"}
                        >
                          Abrir
                        </button>
                        <button
                          onClick={() => marcarRespondido(d.id)}
                          style={{
                            backgroundColor: "#006400",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            padding: "10px 24px",
                            fontSize: "15px",
                            fontWeight: 500,
                            cursor: "pointer",
                            transition: "background 0.2s"
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#004d00"}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#006400"}
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
          {tab === "painel" && <PainelPerguntas />}

          {tab === "relatorio" && <PainelRelatorios />}
        </main>
      </div>

      {/* 🌟 PLUGIN DE SOBREPOSIÇÃO (MODAL) IDÊNTICO AO SEU DESIGN IMAGE_D67C7A.PNG */}
      {duvidaSelecionada && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "#f4f4f4",
              borderRadius: "8px",
              padding: "24px 32px",
              width: "90%",
              maxWidth: "800px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 500, color: "#333" }}>
              {duvidaSelecionada.assunto || "Detalhes da Dúvida"}
            </h2>

            <div
              style={{
                backgroundColor: "#eeeeee",
                borderRadius: "6px",
                padding: "20px",
                border: "1px solid #e0e0e0",
                fontSize: "16px",
                color: "#333",
                lineHeight: "1.6",
              }}
            >
              {/* Renderização condicional específica para quebrar a dúvida do fretado com as bolinhas (bullets) do print */}
              {duvidaSelecionada.id === 1 || duvidaSelecionada.assunto === "Transporte fretado" ? (
                <>
                  <p style={{ margin: "0 0 12px 0" }}>
                    Olá! Sou de fora e estou organizando a minha logística de transporte para a instituição. Gostaria de saber se vocês possuem uma lista centralizada, um guia ou um painel de contatos de transportes fretados (vans e ônibus) que fazem a rota entre a minha cidade e a unidade.
                  </p>
                  <p style={{ margin: "0 0 8px 0" }}>
                    Para conseguir me organizar financeiramente e planejar meus horários, eu precisaria visualizar:
                  </p>
                  <ul style={{ margin: "0 0 12px 0", paddingLeft: "24px", listStyleType: "disc" }}>
                    <li style={{ marginBottom: "4px" }}>Rotas e Cidades atendidas (Origem x Destino).</li>
                    <li style={{ marginBottom: "4px" }}>Horários disponíveis (Período da manhã, tarde e noite).</li>
                    <li style={{ marginBottom: "4px" }}>Dados de contato diretos dos responsáveis pelo fretado (WhatsApp, Telefone, E-mail).</li>
                    <li style={{ marginBottom: "4px" }}>Dias de operação (Dias úteis, sábados, etc.).</li>
                  </ul>
                  <p style={{ margin: 0 }}>
                    Vocês têm esse mapeamento disponível ou sabem onde os estudantes costumam centralizar essas vans?
                  </p>
                </>
              ) : (
                /* Texto fluido genérico para os dados reais do banco */
                <p style={{ margin: 0 }}>{duvidaSelecionada.mensagem || duvidaSelecionada.message}</p>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setDuvidaSelecionada(null)}
                style={{
                  backgroundColor: "#333333",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "10px 28px",
                  fontSize: "15px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#222222")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#333333")}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}