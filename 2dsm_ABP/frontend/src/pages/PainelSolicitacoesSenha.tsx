import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

type PasswordRequestStatus = "pendente" | "atendida" | "cancelada";

interface PasswordResetRequest {
  id: number;
  login_institucional: string;
  usuario_id: number | null;
  status: PasswordRequestStatus;
  data_solicitacao: string;
  data_atendimento: string | null;
  admin_responsavel_id: number | null;
  observacao: string | null;
  user_name?: string | null;
  user_active?: boolean | null;
  admin_name?: string | null;
}

interface ResolveResponse {
  request: PasswordResetRequest;
  temporaryPassword: string;
}

const statusLabels: Record<PasswordRequestStatus, string> = {
  pendente: "Pendente",
  atendida: "Atendida",
  cancelada: "Cancelada",
};

export default function PainelSolicitacoesSenha({
  onPendingCountChange,
}: {
  onPendingCountChange?: (count: number) => void;
}) {
  const [requests, setRequests] = useState<PasswordResetRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"todas" | PasswordRequestStatus>("pendente");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [temporaryPassword, setTemporaryPassword] = useState<string | null>(null);
  const [resolvedLogin, setResolvedLogin] = useState<string>("");

  async function fetchRequests() {
    setLoading(true);
    setFeedback(null);
    try {
      const url = filter === "todas"
        ? "/users/password-reset-requests"
        : `/users/password-reset-requests?status=${filter}`;
      const { data } = await api.get<PasswordResetRequest[]>(url);
      setRequests(data);
      const pendingCount = filter === "pendente"
        ? data.length
        : data.filter((request) => request.status === "pendente").length;
      onPendingCountChange?.(pendingCount);
    } catch (error: any) {
      setFeedback({
        type: "error",
        text: error?.response?.data?.error ?? "Nao foi possivel carregar as solicitacoes.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  async function resolveRequest(request: PasswordResetRequest) {
    const confirmed = window.confirm(`Atender solicitacao de ${request.login_institucional}?`);
    if (!confirmed) return;

    setTemporaryPassword(null);
    setFeedback(null);
    try {
      const { data } = await api.post<ResolveResponse>(
        `/users/password-reset-requests/${request.id}/resolve`,
      );
      setTemporaryPassword(data.temporaryPassword);
      setResolvedLogin(data.request.login_institucional);
      setFeedback({ type: "success", text: "Senha provisoria gerada. Copie agora." });
      await fetchRequests();
    } catch (error: any) {
      setFeedback({
        type: "error",
        text: error?.response?.data?.error ?? "Nao foi possivel atender a solicitacao.",
      });
    }
  }

  async function cancelRequest(request: PasswordResetRequest) {
    const confirmed = window.confirm(`Cancelar solicitacao de ${request.login_institucional}?`);
    if (!confirmed) return;

    setFeedback(null);
    try {
      await api.post(`/users/password-reset-requests/${request.id}/cancel`, {
        observacao: "Cancelada pelo administrador.",
      });
      setFeedback({ type: "success", text: "Solicitacao cancelada." });
      await fetchRequests();
    } catch (error: any) {
      setFeedback({
        type: "error",
        text: error?.response?.data?.error ?? "Nao foi possivel cancelar a solicitacao.",
      });
    }
  }

  const counts = useMemo(() => ({
    pendente: requests.filter((request) => request.status === "pendente").length,
    atendida: requests.filter((request) => request.status === "atendida").length,
    cancelada: requests.filter((request) => request.status === "cancelada").length,
  }), [requests]);

  return (
    <div className="w-full max-w-[1060px] mx-auto flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-gray-800 leading-tight">Solicitacoes de senha</h1>
          <p className="text-gray-500 text-sm mt-1">
            Atenda pedidos de redefinicao sem enviar senhas por e-mail.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchRequests}
          className="inline-flex w-full sm:w-auto items-center justify-center bg-white border border-gray-300 px-4 py-2.5 rounded-lg text-[#8B0000] text-xs font-bold uppercase hover:bg-gray-50 shadow-sm"
        >
          Atualizar lista
        </button>
      </div>

      {feedback && (
        <div className={`p-3 rounded-lg border text-sm font-bold ${
          feedback.type === "success"
            ? "bg-green-50 text-green-800 border-green-200"
            : "bg-red-50 text-red-800 border-red-200"
        }`}>
          {feedback.text}
        </div>
      )}

      {temporaryPassword && (
        <div className="fixed inset-0 z-[120] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-lg border border-gray-200 shadow-xl overflow-hidden">
            <div className="bg-[#8B0000] text-white px-5 py-4 flex items-center justify-between">
              <h2 className="font-black text-lg">Senha provisoria gerada</h2>
              <button
                type="button"
                onClick={() => setTemporaryPassword(null)}
                className="text-white/80 hover:text-white text-xl leading-none"
              >
                x
              </button>
            </div>
            <div className="p-5">
              <p className="text-sm font-bold text-gray-800 mb-3">
                Copie esta senha agora. Ela nao sera exibida novamente.
              </p>
              <span className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2">
                Usuario: {resolvedLogin}
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <code className="flex-1 bg-yellow-50 border border-yellow-200 rounded px-3 py-2 text-sm font-black text-gray-800 break-all">
                  {temporaryPassword}
                </code>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(temporaryPassword)}
                  className="px-3 py-2 rounded bg-yellow-600 text-white text-xs font-bold uppercase"
                >
                  Copiar
                </button>
              </div>
              <p className="mt-3 text-xs text-gray-600 font-medium">
                Repasse a senha ao usuario por um canal institucional seguro.
              </p>
            </div>
          </div>
        </div>
      )}

      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-wrap items-center gap-2 bg-gray-50/70">
          {(["pendente", "atendida", "cancelada", "todas"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              className={`px-3.5 py-2 rounded-lg text-[11px] font-black uppercase border transition-colors ${
                filter === option
                  ? "bg-[#8B0000] text-white border-[#8B0000]"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {option === "todas" ? "Todas" : statusLabels[option]}
            </button>
          ))}
          <div className="w-full sm:w-auto sm:ml-auto text-[11px] text-gray-500 font-bold">
            Pendentes: {counts.pendente} | Atendidas: {counts.atendida} | Canceladas: {counts.cancelada}
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="bg-white border-b border-gray-100">
              <tr className="text-left text-[10px] text-gray-400 uppercase tracking-wider">
                <th className="px-5 py-3.5 font-black">Login institucional</th>
                <th className="px-5 py-3.5 font-black">Usuario</th>
                <th className="px-5 py-3.5 font-black">Solicitada em</th>
                <th className="px-5 py-3.5 font-black">Status</th>
                <th className="px-5 py-3.5 font-black">Atendida por</th>
                <th className="px-5 py-3.5 font-black text-right">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-400 font-bold">
                    Carregando solicitacoes...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-400 font-bold">
                    Nenhuma solicitacao encontrada.
                  </td>
                </tr>
              ) : requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-5 py-4 font-bold text-gray-800 whitespace-nowrap">
                    {request.login_institucional}
                  </td>
                  <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                    {request.user_name ?? "Nao encontrado"}
                  </td>
                  <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                    {new Date(request.data_solicitacao).toLocaleString("pt-BR")}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      request.status === "pendente"
                        ? "bg-yellow-100 text-yellow-800"
                        : request.status === "atendida"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                    }`}>
                      {statusLabels[request.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                    {request.admin_name ?? "-"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2 whitespace-nowrap">
                      <button
                        type="button"
                        disabled={request.status !== "pendente" || !request.usuario_id}
                        onClick={() => resolveRequest(request)}
                        className="px-3 py-2 rounded-lg border border-green-600 text-green-800 bg-green-50 text-xs font-bold hover:bg-green-100 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Atender
                      </button>
                      <button
                        type="button"
                        disabled={request.status !== "pendente"}
                        onClick={() => cancelRequest(request)}
                        className="px-3 py-2 rounded-lg border border-red-500 text-red-700 bg-red-50 text-xs font-bold hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Cancelar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
