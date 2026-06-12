import { useEffect, useMemo, useState, type FormEvent } from "react";
import api from "../services/api";
import PainelSolicitacoesSenha from "./PainelSolicitacoesSenha";

type UserRole = "admin" | "secretaria";

interface AdminUser {
  id: number;
  username: string;
  role: UserRole;
  name: string;
  active: boolean;
  troca_senha_obrigatoria?: boolean;
  created_at: string;
}

interface UserFormState {
  id: number | null;
  name: string;
  username: string;
  role: UserRole;
  active: boolean;
}

interface CreateUserResponse {
  user: AdminUser;
  temporaryPassword: string;
}

interface ResetPasswordResponse {
  user: AdminUser;
  temporaryPassword: string;
}

const emptyForm: UserFormState = {
  id: null,
  name: "",
  username: "",
  role: "secretaria",
  active: true,
};

export default function PainelUsuarios({
  pendingPasswordRequestCount = 0,
  onPasswordRequestCountChange,
}: {
  pendingPasswordRequestCount?: number;
  onPasswordRequestCountChange?: (count: number) => void;
}) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<UserFormState>(emptyForm);
  const [panelOpen, setPanelOpen] = useState(false);
  const [temporaryPassword, setTemporaryPassword] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"usuarios" | "solicitacoes">("usuarios");
  const [actionMenuUserId, setActionMenuUserId] = useState<number | null>(null);

  const isEditing = form.id !== null;

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const { data } = await api.get<AdminUser[]>("/admin/usuarios");
      setUsers(data);
    } catch {
      setFeedback({ type: "error", text: "Nao foi possivel carregar os usuarios." });
    } finally {
      setLoading(false);
    }
  }

  function openCreatePanel() {
    setForm(emptyForm);
    setTemporaryPassword(null);
    setFeedback(null);
    setPanelOpen(true);
  }

  function closePanel() {
    setPanelOpen(false);
    setForm(emptyForm);
  }

  function editUser(user: AdminUser) {
    setActionMenuUserId(null);
    setForm({
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      active: user.active,
    });
    setTemporaryPassword(null);
    setFeedback(null);
    setPanelOpen(true);
  }

  async function saveUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);
    setTemporaryPassword(null);

    const payload = {
      name: form.name.trim(),
      username: form.username.trim(),
      role: form.role,
      active: form.active,
    };

    try {
      if (isEditing && form.id) {
        await api.put(`/admin/usuarios/${form.id}`, payload);
        setFeedback({ type: "success", text: "Usuario atualizado com sucesso." });
        closePanel();
      } else {
        const { data } = await api.post<CreateUserResponse>("/admin/usuarios", payload);
        setTemporaryPassword(data.temporaryPassword);
        setFeedback({ type: "success", text: "Usuario criado. Copie a senha provisoria agora." });
      }
      await fetchUsers();
    } catch (error: any) {
      setFeedback({
        type: "error",
        text: error?.response?.data?.error ?? "Nao foi possivel salvar o usuario.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function toggleUserStatus(user: AdminUser) {
    setActionMenuUserId(null);
    const action = user.active ? "inativar" : "ativar";
    const confirmed = window.confirm(`Deseja ${action} o usuario ${user.name}?`);
    if (!confirmed) return;

    try {
      await api.patch(`/admin/usuarios/${user.id}/status`, { active: !user.active });
      setFeedback({
        type: "success",
        text: user.active ? "Usuario inativado com sucesso." : "Usuario ativado com sucesso.",
      });
      await fetchUsers();
    } catch (error: any) {
      setFeedback({
        type: "error",
        text: error?.response?.data?.error ?? "Nao foi possivel atualizar o status.",
      });
    }
  }

  async function resetUserPassword(user: AdminUser) {
    setActionMenuUserId(null);
    const confirmed = window.confirm(`Redefinir a senha de ${user.name}? A senha provisoria sera exibida uma unica vez.`);
    if (!confirmed) return;

    try {
      const { data } = await api.post<ResetPasswordResponse>(`/users/${user.id}/reset-password`);
      setTemporaryPassword(data.temporaryPassword);
      setFeedback({ type: "success", text: `Senha provisoria gerada para ${data.user.name}. Copie agora.` });
      setForm({
        id: data.user.id,
        name: data.user.name,
        username: data.user.username,
        role: data.user.role,
        active: data.user.active,
      });
      setPanelOpen(true);
      await fetchUsers();
    } catch (error: any) {
      setFeedback({
        type: "error",
        text: error?.response?.data?.error ?? "Nao foi possivel redefinir a senha.",
      });
    }
  }

  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return users;

    return users.filter((user) =>
      user.name.toLowerCase().includes(term) ||
      user.username.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term),
    );
  }, [users, search]);

  const activeCount = users.filter((user) => user.active).length;
  const inactiveCount = users.length - activeCount;

  return (
    <div className="w-full max-w-[1040px] mx-auto flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-[22px] font-black text-gray-800 leading-tight">Gerenciar Usuarios</h1>
            <p className="text-gray-500 text-sm mt-1">Controle acessos administrativos sem expor senhas.</p>
          </div>

          <button
            type="button"
            onClick={openCreatePanel}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-[#8B0000] hover:bg-[#6f0000] text-white rounded-lg px-4 py-2.5 text-xs font-black uppercase tracking-wider shadow-sm"
          >
            <span className="text-base leading-none">+</span>
            Novo usuario
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm px-4 py-2.5">
            <span className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">Total</span>
            <span className="block text-xl font-black text-gray-800 leading-tight mt-0.5">{users.length}</span>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm px-4 py-2.5">
            <span className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">Ativos</span>
            <span className="block text-xl font-black text-green-700 leading-tight mt-0.5">{activeCount}</span>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm px-4 py-2.5">
            <span className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">Inativos</span>
            <span className="block text-xl font-black text-red-700 leading-tight mt-0.5">{inactiveCount}</span>
          </div>
        </div>
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

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-1 grid grid-cols-1 sm:inline-grid sm:grid-cols-2 gap-1 w-full sm:w-auto max-w-full">
        <button
          type="button"
          onClick={() => setActiveTab("usuarios")}
          className={`px-4 py-2 rounded-lg text-xs font-black uppercase whitespace-nowrap transition-colors ${
            activeTab === "usuarios"
              ? "bg-[#8B0000] text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Usuarios
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("solicitacoes")}
          className={`px-4 py-2 rounded-lg text-xs font-black uppercase whitespace-nowrap transition-colors ${
            activeTab === "solicitacoes"
              ? "bg-[#8B0000] text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <span className="inline-flex items-center gap-2">
            Solicitacoes de senha
            {pendingPasswordRequestCount > 0 && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                activeTab === "solicitacoes"
                  ? "bg-white/20 text-white"
                  : "bg-red-100 text-red-700"
              }`}>
                {pendingPasswordRequestCount}
              </span>
            )}
          </span>
        </button>
      </div>

      {activeTab === "solicitacoes" && (
        <PainelSolicitacoesSenha onPendingCountChange={onPasswordRequestCountChange} />
      )}

      {activeTab === "usuarios" && <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-visible">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gray-50/70 rounded-t-xl">
          <div>
            <h2 className="text-base font-black text-gray-800 leading-tight">Usuarios cadastrados</h2>
            <p className="text-xs text-gray-500 font-medium">A senha nunca e exibida na listagem.</p>
          </div>
          <div className="relative w-full md:w-80">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            </span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar nome, login ou perfil..."
              className="w-full border border-gray-300 rounded-lg bg-white pl-10 pr-3 py-2.5 text-sm outline-none focus:border-[#8B0000] focus:ring-2 focus:ring-red-900/10"
            />
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-white border-b border-gray-100">
              <tr className="text-left text-[10px] text-gray-400 uppercase tracking-wider">
                <th className="px-4 py-3 font-black">Nome</th>
                <th className="px-4 py-3 font-black">Login/e-mail</th>
                <th className="px-4 py-3 font-black">Perfil</th>
                <th className="px-4 py-3 font-black">Status</th>
                <th className="px-4 py-3 font-black">Criado em</th>
                <th className="px-4 py-3 font-black text-right">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-400 font-bold">Carregando usuarios...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-400 font-bold">Nenhum usuario encontrado.</td>
                </tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-4 py-3 font-bold text-gray-800 whitespace-nowrap">{user.name}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{user.username}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-black uppercase">
                      {user.role === "admin" ? "Administrador" : "Secretaria"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-start gap-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        user.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {user.active ? "Ativo" : "Inativo"}
                      </span>
                      {user.troca_senha_obrigatoria && (
                        <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-[10px] font-black uppercase">
                          Troca obrigatoria
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {new Date(user.created_at).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative flex justify-end">
                      <button
                        type="button"
                        onClick={() => setActionMenuUserId((current) => current === user.id ? null : user.id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        aria-label={`Abrir acoes de ${user.name}`}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <circle cx="12" cy="5" r="2" />
                          <circle cx="12" cy="12" r="2" />
                          <circle cx="12" cy="19" r="2" />
                        </svg>
                      </button>
                      {actionMenuUserId === user.id && (
                        <div className="absolute right-0 top-9 z-30 w-48 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                          <button
                            type="button"
                            onClick={() => editUser(user)}
                            className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs font-bold text-gray-700 hover:bg-gray-50"
                          >
                            <span className="text-gray-500">✎</span>
                            Editar usuario
                          </button>
                          <button
                            type="button"
                            onClick={() => resetUserPassword(user)}
                            className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs font-bold text-gray-700 hover:bg-gray-50"
                          >
                            <span className="text-yellow-600">◆</span>
                            Redefinir senha
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleUserStatus(user)}
                            className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs font-bold hover:bg-gray-50 ${
                              user.active ? "text-red-700" : "text-green-700"
                            }`}
                          >
                            <span>{user.active ? "●" : "●"}</span>
                            {user.active ? "Inativar usuario" : "Ativar usuario"}
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>}

      {panelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
          <div className="w-full sm:max-w-md bg-white h-full shadow-xl flex flex-col">
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-start justify-between gap-4 bg-gray-50">
              <div>
                <h2 className="text-base sm:text-lg font-black text-gray-800">{isEditing ? "Editar usuario" : "Novo usuario"}</h2>
                <p className="text-xs text-gray-500 font-medium">
                  {isEditing ? "Atualize dados de acesso e status." : "O sistema gera a senha provisoria automaticamente."}
                </p>
              </div>
              <button type="button" onClick={closePanel} className="text-gray-500 hover:text-gray-800 text-xl leading-none">
                x
              </button>
            </div>

            <form onSubmit={saveUser} className="p-4 sm:p-5 flex-1 overflow-y-auto flex flex-col gap-4">
              <label className="flex flex-col gap-1 text-xs font-bold text-gray-600 uppercase">
                Nome
                <input
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  className="border border-gray-300 rounded px-3 py-2.5 text-sm normal-case font-medium outline-none focus:border-[#8B0000]"
                  required
                />
              </label>

              <label className="flex flex-col gap-1 text-xs font-bold text-gray-600 uppercase">
                Login/e-mail
                <input
                  value={form.username}
                  onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
                  className="border border-gray-300 rounded px-3 py-2.5 text-sm normal-case font-medium outline-none focus:border-[#8B0000]"
                  required
                />
              </label>

              <label className="flex flex-col gap-1 text-xs font-bold text-gray-600 uppercase">
                Perfil
                <select
                  value={form.role}
                  onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value as UserRole }))}
                  className="border border-gray-300 rounded px-3 py-2.5 text-sm normal-case font-medium outline-none focus:border-[#8B0000] bg-white"
                >
                  <option value="secretaria">Secretaria</option>
                  <option value="admin">Administrador</option>
                </select>
              </label>

              <label className="flex items-center justify-between gap-3 bg-gray-50 border border-gray-200 rounded px-3 py-2.5">
                <span className="text-xs font-bold text-gray-600 uppercase">Usuario ativo</span>
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(event) => setForm((prev) => ({ ...prev, active: event.target.checked }))}
                  className="h-4 w-4 accent-[#8B0000]"
                />
              </label>

              {temporaryPassword && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <span className="block text-[10px] font-black text-yellow-700 uppercase tracking-wider mb-2">
                    Senha provisoria
                  </span>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <code className="flex-1 bg-white border border-yellow-200 rounded px-3 py-2 text-sm font-black text-gray-800 break-all">
                      {temporaryPassword}
                    </code>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(temporaryPassword)}
                      className="px-3 py-2 rounded bg-yellow-600 text-white text-xs font-bold"
                    >
                      Copiar
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-yellow-800 font-medium">
                    Copie agora. Essa senha nao sera exibida novamente.
                  </p>
                </div>
              )}

              <div className="mt-auto flex flex-wrap justify-end gap-2 pt-4">
                <button type="button" onClick={closePanel} className="px-4 py-2.5 rounded border border-gray-300 text-gray-700 text-xs font-bold uppercase">
                  Fechar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#8B0000] hover:bg-[#6f0000] disabled:opacity-60 text-white rounded px-4 py-2.5 text-xs font-black uppercase tracking-wider"
                >
                  {saving ? "Salvando..." : isEditing ? "Salvar" : "Criar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
