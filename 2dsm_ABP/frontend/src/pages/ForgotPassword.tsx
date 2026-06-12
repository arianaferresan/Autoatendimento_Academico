import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import AuthLayout from "../components/AuthLayout";

export default function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const { data } = await api.post("/auth/forgot-password", { username });
      setMessage(data.message ?? "Solicitacao registrada. A equipe administrativa fara a redefinicao da senha.");
      setUsername("");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Nao foi possivel solicitar a recuperacao.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Solicitar redefinição de senha"
      subtitle="Informe seu login institucional para registrar a solicitação."
      footer={<div className="text-center"><Link to="/login" className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-500 hover:text-[#8B0000] transition-colors">Voltar ao login</Link></div>}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
        <div>
          <label htmlFor="username" className="block text-[11px] font-black uppercase tracking-wider mb-1.5 text-white/90">
            Login institucional
          </label>
          <input
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Digite seu login institucional"
            autoComplete="username"
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
          {loading ? "Registrando..." : "Registrar solicitação"}
        </button>
      </form>
    </AuthLayout>
  );
}
