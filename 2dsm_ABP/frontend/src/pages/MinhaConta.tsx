import { useState, type FormEvent } from "react";
import api from "../services/api";

interface StoredUser {
  id: number;
  username: string;
  role: "admin" | "secretaria";
  name: string;
  mustChangePassword?: boolean;
}

interface MinhaContaProps {
  onPasswordChanged?: () => void;
}

export default function MinhaConta({ onPasswordChanged }: MinhaContaProps) {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) as StoredUser : null;

  const [name, setName] = useState(user?.name ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingProfile(true);
    setFeedback(null);

    try {
      const { data } = await api.put("/me/profile", { name });
      localStorage.setItem("user", JSON.stringify({ ...user, ...data }));
      setFeedback({ type: "success", text: "Nome atualizado com sucesso." });
    } catch (error: any) {
      setFeedback({
        type: "error",
        text: error?.response?.data?.error ?? "Nao foi possivel atualizar sua conta.",
      });
    } finally {
      setSavingProfile(false);
    }
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingPassword(true);
    setFeedback(null);

    if (newPassword !== confirmPassword) {
      setFeedback({ type: "error", text: "A confirmacao deve ser igual a nova senha." });
      setSavingPassword(false);
      return;
    }

    try {
      await api.put("/me/password", {
        currentPassword,
        newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      if (user) {
        localStorage.setItem("user", JSON.stringify({ ...user, mustChangePassword: false }));
      }
      onPasswordChanged?.();
      setFeedback({ type: "success", text: "Senha alterada com sucesso." });
    } catch (error: any) {
      setFeedback({
        type: "error",
        text: error?.response?.data?.error ?? "Nao foi possivel alterar a senha.",
      });
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Minha conta</h1>
        <p className="text-gray-500 text-sm">Atualize seus dados pessoais e sua senha de acesso.</p>
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

      {user?.mustChangePassword && (
        <div className="p-3 rounded-lg border border-yellow-200 bg-yellow-50 text-yellow-900 text-sm font-bold">
          Sua senha atual e provisoria. Altere a senha para continuar usando o painel.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <form onSubmit={saveProfile} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-5 flex flex-col gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-black text-gray-800">Dados da conta</h2>
            <p className="text-xs text-gray-500 font-medium">Login, perfil e status sao somente leitura.</p>
          </div>

          <label className="flex flex-col gap-1 text-xs font-bold text-gray-600 uppercase">
            Nome
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="border border-gray-300 rounded px-3 py-2.5 text-sm normal-case font-medium outline-none focus:border-[#8B0000]"
              required
            />
          </label>

          <label className="flex flex-col gap-1 text-xs font-bold text-gray-600 uppercase">
            Login/e-mail
            <input
              value={user?.username ?? ""}
              className="border border-gray-200 rounded px-3 py-2.5 text-sm normal-case font-medium bg-gray-50 text-gray-500"
              readOnly
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gray-50 border border-gray-200 rounded px-3 py-2.5">
              <span className="block text-[10px] font-black text-gray-400 uppercase">Perfil</span>
              <span className="text-sm font-bold text-gray-700">{user?.role === "admin" ? "Administrador" : "Secretaria"}</span>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded px-3 py-2.5">
              <span className="block text-[10px] font-black text-gray-400 uppercase">Status</span>
              <span className="text-sm font-bold text-green-700">Ativo</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="mt-auto bg-[#8B0000] hover:bg-[#6f0000] disabled:opacity-60 text-white rounded px-4 py-2.5 text-xs font-black uppercase tracking-wider"
          >
            {savingProfile ? "Salvando..." : "Salvar nome"}
          </button>
        </form>

        <form onSubmit={changePassword} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-5 flex flex-col gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-black text-gray-800">Alterar senha</h2>
            <p className="text-xs text-gray-500 font-medium">Informe sua senha atual antes de definir uma nova.</p>
          </div>

          <label className="flex flex-col gap-1 text-xs font-bold text-gray-600 uppercase">
            Senha atual
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="border border-gray-300 rounded px-3 py-2.5 text-sm normal-case font-medium outline-none focus:border-[#8B0000]"
              required
            />
          </label>

          <label className="flex flex-col gap-1 text-xs font-bold text-gray-600 uppercase">
            Nova senha
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="border border-gray-300 rounded px-3 py-2.5 text-sm normal-case font-medium outline-none focus:border-[#8B0000]"
              minLength={6}
              required
            />
          </label>

          <label className="flex flex-col gap-1 text-xs font-bold text-gray-600 uppercase">
            Confirmar nova senha
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="border border-gray-300 rounded px-3 py-2.5 text-sm normal-case font-medium outline-none focus:border-[#8B0000]"
              minLength={6}
              required
            />
          </label>

          <button
            type="submit"
            disabled={savingPassword}
            className="mt-auto bg-[#2E7D32] hover:bg-green-800 disabled:opacity-60 text-white rounded px-4 py-2.5 text-xs font-black uppercase tracking-wider"
          >
            {savingPassword ? "Alterando..." : "Alterar senha"}
          </button>
        </form>
      </div>
    </div>
  );
}
