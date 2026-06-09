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

interface Node {
  id: number;
  parent_id: number | null;
  title: string;
  content: string | null;
  display_order: number;
  chunk_path: string | null;
  link: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

type ModalState = { mode: "create" | "edit"; node?: Node };

type Tab = "duvidas" | "painel" | "relatorio";

// ─── Estilos compartilhados do modal ─────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 600,
  color: "#333",
  marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #ccc",
  borderRadius: "4px",
  padding: "8px 10px",
  fontSize: "13px",
  color: "#333",
  outline: "none",
  backgroundColor: "#fff",
};

// ─── Modal de criação de item ─────────────────────────────────────────────────

function ItemModalAdmin({
  allNodes,
  onClose,
  onSave,
}: {
  allNodes: Node[];
  onClose: () => void;
  onSave: (data: Partial<Node> & { id?: number }) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [tipo, setTipo] = useState<"menu" | "resposta">("menu");
  const [parentId, setParentId] = useState<number | null>(null);
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");
  const [chunkPath, setChunkPath] = useState("");
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!title.trim()) return;
    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        content: tipo === "resposta" ? content : null,
        link: tipo === "resposta" && link.trim() ? link.trim() : null,
        chunk_path:
          tipo === "resposta" && chunkPath.trim() ? chunkPath.trim() : null,
        parent_id: parentId,
        display_order: order,
        is_active: isActive,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "28px 24px",
          width: "500px",
          maxWidth: "95vw",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        }}
      >
        <h2
          style={{
            margin: "0 0 20px",
            fontSize: "17px",
            fontWeight: 700,
            color: "#222",
          }}
        >
          Criar novo item
        </h2>

        {/* Título */}
        <label style={labelStyle}>Título</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value.slice(0, 100))}
          placeholder="Digite aqui o título"
          style={inputStyle}
          maxLength={100}
        />
        <div
          style={{
            textAlign: "right",
            fontSize: "11px",
            color: "#999",
            marginBottom: "16px",
          }}
        >
          {title.length}/100
        </div>

        {/* Tipo do item */}
        <label style={labelStyle}>Tipo do item</label>
        <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
          {(["menu", "resposta"] as const).map((t) => (
            <label
              key={t}
              style={{
                flex: 1,
                border: `2px solid ${tipo === t ? "#C0392B" : "#ddd"}`,
                borderRadius: "6px",
                padding: "10px 12px",
                cursor: "pointer",
                backgroundColor: tipo === t ? "#fdf0f0" : "#fafafa",
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
              }}
            >
              <input
                type="radio"
                checked={tipo === t}
                onChange={() => setTipo(t)}
                style={{ marginTop: "2px", accentColor: "#C0392B" }}
              />
              <div>
                <div
                  style={{ fontSize: "13px", fontWeight: 600, color: "#333" }}
                >
                  {t === "menu" ? "Opção de menu" : "Resposta final"}
                </div>
                <div style={{ fontSize: "11px", color: "#888" }}>
                  {t === "menu"
                    ? "(Possui mais respostas)"
                    : "(O item chegou à última solução)"}
                </div>
              </div>
            </label>
          ))}
        </div>

        {/* Pertence a */}
        <label style={labelStyle}>O item pertence a:</label>
        <select
          value={parentId ?? ""}
          onChange={(e) =>
            setParentId(e.target.value === "" ? null : Number(e.target.value))
          }
          style={{ ...inputStyle, marginBottom: "16px" }}
        >
          <option value="">Defina o local do item</option>
          {allNodes.map((n) => (
            <option key={n.id} value={n.id}>
              {n.title}
            </option>
          ))}
        </select>

        {/* Campos de resposta final */}
        {tipo === "resposta" && (
          <>
            <label style={labelStyle}>Resposta final</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, 800))}
              placeholder="Digite aqui a resposta"
              style={{
                ...inputStyle,
                height: "110px",
                resize: "vertical",
                marginBottom: "4px",
              }}
              maxLength={800}
            />
            <div
              style={{
                textAlign: "right",
                fontSize: "11px",
                color: "#999",
                marginBottom: "16px",
              }}
            >
              {content.length}/800
            </div>

            <label style={labelStyle}>
              Link de evidência{" "}
              <span style={{ color: "#999", fontWeight: 400 }}>(opcional)</span>
            </label>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://... ou /assets/arquivo.pdf"
              style={{ ...inputStyle, marginBottom: "16px" }}
            />

            <label style={labelStyle}>
              Caminho do documento{" "}
              <span style={{ color: "#999", fontWeight: 400 }}>(opcional)</span>
            </label>
            <input
              value={chunkPath}
              onChange={(e) => setChunkPath(e.target.value)}
              placeholder="Ex: /assets/knowledge-base/pdf/arquivo.pdf"
              style={{ ...inputStyle, marginBottom: "16px" }}
            />
          </>
        )}

        {/* Ordem + Status */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Ordem</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              style={inputStyle}
              min={0}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Status</label>
            <select
              value={isActive ? "true" : "false"}
              onChange={(e) => setIsActive(e.target.value === "true")}
              style={inputStyle}
            >
              <option value="">Defina um status</option>
              <option value="true">Ativo</option>
              <option value="false">Desativado</option>
            </select>
          </div>
        </div>

        {/* Ações */}
        <div
          style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}
        >
          <button
            onClick={onClose}
            disabled={saving}
            style={{
              backgroundColor: "#666",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "9px 16px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !title.trim()}
            style={{
              backgroundColor: "#1a56bb",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "9px 16px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: saving || !title.trim() ? "not-allowed" : "pointer",
              opacity: saving || !title.trim() ? 0.6 : 1,
            }}
          >
            {saving ? "Criando..." : "Criar item"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function Admin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("duvidas");
  const role = localStorage.getItem('role'); // adicionar essa linha
  const [duvidas, setDuvidas] = useState<SupportContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [msgRespondida, setMsgRespondida] = useState(false);
  const [duvidaSelecionada, setDuvidaSelecionada] = useState<any | null>(null);
  const [statusFiltro, setStatusFiltro] = useState<Status>("ABERTA");

  // Estados do modal de criação
  const [modalCriar, setModalCriar] = useState<ModalState | null>(null);
  const [allNodes, setAllNodes] = useState<Node[]>([]);
  const [toastAdmin, setToastAdmin] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (tab === "duvidas") fetchDuvidas();
  }, [tab, statusFiltro]);

  useEffect(() => {
    api
      .get<Node[]>("/admin/nodes/all")
      .then(({ data }) => {
        setAllNodes(data);
      })
      .catch(() => {});
  }, []);

  async function fetchDuvidas() {
    setLoading(true);
    try {
      const { data } = await api.get<SupportContact[]>(
          `/admin/perguntas/status/${statusFiltro}?offset=0`
      );
      setDuvidas(data);
    } catch {
      setDuvidas([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveNode(data: Partial<Node> & { id?: number }) {
    try {
      const form = new FormData();
      form.append("title", data.title ?? "");
      if (data.content) form.append("content", data.content);
      form.append("display_order", String(data.display_order ?? 0));
      form.append("is_active", String(data.is_active ?? true));
      if (data.parent_id !== null && data.parent_id !== undefined)
        form.append("parent_id", String(data.parent_id));
      if (data.link) form.append("link", data.link);
      if (data.chunk_path) form.append("chunk_path", data.chunk_path);
      await api.post("/admin/nodes/create", form);
      setModalCriar(null);
      const { data: nodes } = await api.get<Node[]>("/admin/nodes/all");
      setAllNodes(nodes);
      showToastAdmin("Item criado com sucesso!", "success");
    } catch {
      showToastAdmin("Erro ao criar item.", "error");
    }
  }

  function showToastAdmin(msg: string, type: "success" | "error") {
    setToastAdmin({ msg, type });
    setTimeout(() => setToastAdmin(null), 3000);
  }

  async function marcarRespondido(id: number) {
    try {
      await api.patch(`/admin/perguntas/${id}`, { status: "RESPONDIDA" });
      setDuvidas((prev) => prev.filter((d) => d.id !== id));
      setMsgRespondida(true);
      setTimeout(() => setMsgRespondida(false), 3000);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401) {
        alert("Sessão expirada. Faça login novamente.");
        localStorage.removeItem("token");
        navigate("/login");
      } else if (status === 404) {
        alert("Dúvida não encontrada no banco de dados.");
      } else {
        alert(
          `Erro ao atualizar status. (${status ?? "sem resposta do servidor"})`
        );
      }
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
          <div
            style={{ width: "1px", height: "36px", backgroundColor: "#ccc" }}
          />
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
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#540000")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#AD0E09")
            }
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
              {/* BARRA SUPERIOR VERMELHA */}
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <label
                    style={{ color: "#fff", fontSize: "16px", fontWeight: 600 }}
                  >
                    Status
                  </label>
                  <select
                    value={statusFiltro}
                    onChange={(e) => setStatusFiltro(e.target.value as Status)}
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
                    <option value="ABERTA">Aberta</option>
                    <option value="ATENDIMENTO">Em atendimento</option>
                    <option value="RESPONDIDA">Respondida</option>
                  </select>
                </div>
                <div style={{ flex: 1 }} />
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
                <p
                  style={{
                    color: "#888",
                    textAlign: "center",
                    marginTop: "40px",
                  }}
                >
                  Carregando...
                </p>
              ) : duvidas.length === 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "60px",
                    gap: "12px",
                  }}
                >
                  <span style={{ fontSize: "36px" }}>✅</span>
                  <p style={{ fontSize: "16px", color: "#555", fontWeight: 600, margin: 0 }}>
                    Nenhuma dúvida {statusFiltro === "ABERTA" ? "em aberto" : statusFiltro === "ATENDIMENTO" ? "em atendimento" : "respondida"} no momento.
                  </p>
                  <p style={{ fontSize: "13px", color: "#999", margin: 0 }}>
                    {statusFiltro === "ABERTA" 
                      ? "Quando novos alunos enviarem perguntas, elas aparecerão aqui." 
                      : "As perguntas com este status serão exibidas aqui."}
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
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
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "20px",
                          fontWeight: 500,
                          color: "#333",
                        }}
                      >
                        {d.email}
                      </h3>
                      <p
                        style={{
                          margin: "0 0 12px 0",
                          fontSize: "16px",
                          color: "#444",
                          lineHeight: "1.5",
                        }}
                      >
                        {d.message}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: "12px",
                        }}
                      >
                        <button
                          onClick={() => {
                            atualizarStatus(d.id, "ATENDIMENTO");
                            setDuvidaSelecionada({
                              id: d.id,
                              assunto: d.email,
                              mensagem: d.message,
                            });
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
                            transition: "background 0.2s",
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.backgroundColor = "#152842")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.backgroundColor = "#1F3A60")
                          }
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
                            transition: "background 0.2s",
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.backgroundColor = "#004d00")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.backgroundColor = "#006400")
                          }
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

      {/* Modal de detalhes da dúvida */}
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
            <h2
              style={{
                margin: 0,
                fontSize: "22px",
                fontWeight: 500,
                color: "#333",
              }}
            >
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
              <p style={{ margin: 0 }}>
                {duvidaSelecionada.mensagem || duvidaSelecionada.message}
              </p>
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
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#222222")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#333333")
                }
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast de confirmação do modal de criação */}
      {toastAdmin && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            backgroundColor:
              toastAdmin.type === "success" ? "#2E7D32" : "#8B0000",
            color: "#fff",
            borderRadius: "6px",
            padding: "14px 20px",
            fontWeight: 600,
            fontSize: "14px",
            zIndex: 9998,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          {toastAdmin.msg}
        </div>
      )}

      {/* Modal de criação de item */}
      {modalCriar && (
        <ItemModalAdmin
          allNodes={allNodes}
          onClose={() => setModalCriar(null)}
          onSave={handleSaveNode}
        />
      )}
    </div>
  );
}
