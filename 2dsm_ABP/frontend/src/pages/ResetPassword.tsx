import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import AuthLayout from "../components/AuthLayout";

export default function ResetPassword() {
  const navigate = useNavigate();
  const token = useMemo(() => new URLSearchParams(window.location.search).get("token") ?? "", []);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("A confirmacao deve ser igual a nova senha.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post("/auth/reset-password", { token, password });
      setMessage(data.message ?? "Senha redefinida com sucesso.");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => navigate("/login"), 1600);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Nao foi possivel redefinir a senha.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Redefinir senha"
      subtitle="Defina uma nova senha de acesso."
      footer={<div className="text-center"><Link to="/login" className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-500 hover:text-[#8B0000] transition-colors">Voltar ao login</Link></div>}
    >
      {!token ? (
        <div className="flex flex-col gap-4">
          <p className="m-0 rounded-lg bg-black/20 px-3 py-2 text-center text-[13px] font-semibold text-red-100">
            Link inválido. Registre uma nova solicitação de redefinição.
          </p>
          <Link to="/forgot-password" className="text-center text-[10px] sm:text-xs font-black uppercase tracking-widest text-white/90 underline decoration-white/40 underline-offset-4">
            Registrar nova solicitação
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
          <div>
            <label htmlFor="password" className="block text-[11px] font-black uppercase tracking-wider mb-1.5 text-white/90">
              Nova senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              required
              className="w-full rounded-lg border-0 px-3 py-2.5 text-[14px] text-gray-800 outline-none bg-white placeholder:text-gray-400"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-[11px] font-black uppercase tracking-wider mb-1.5 text-white/90">
              Confirmar senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              minLength={6}
              required
              className="w-full rounded-lg border-0 px-3 py-2.5 text-[14px] text-gray-800 outline-none bg-white placeholder:text-gray-400"
            />
          </div>

          {message && <p className="m-0 rounded-lg bg-black/20 px-3 py-2 text-center text-[13px] font-semibold text-green-100">{message}</p>}
          {error && <p className="m-0 rounded-lg bg-black/20 px-3 py-2 text-center text-[13px] font-semibold text-red-100">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#2E7D32] py-2.5 text-[13px] font-black uppercase tracking-widest text-white disabled:opacity-60"
          >
            {loading ? "Salvando..." : "Redefinir senha"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
