import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import AuthLayout from '../components/AuthLayout';

const rememberedLoginKey = 'adminRememberedLogin';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberLogin, setRememberLogin] = useState(false);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedLogin = localStorage.getItem(rememberedLoginKey);
    if (savedLogin) {
      setUsername(savedLogin);
      setRememberLogin(true);
    }
  }, []);

  async function handleSubmit(e: React.BaseSyntheticEvent) {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { username, password });
      if (rememberLogin) {
        localStorage.setItem(rememberedLoginKey, username);
      } else {
        localStorage.removeItem(rememberedLoginKey);
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/admin');
    } catch {
      setErro('Usuário ou senha inválidos');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title={<>Bem-vindo à<br />Área Administrativa</>}
      subtitle="Efetue o login para acessar a área administrativa."
      footer={(
        <div className="text-center">
          <Link to="/" className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-500 hover:text-[#8B0000] transition-colors">
            Voltar para a área pública
          </Link>
        </div>
      )}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="username" className="block text-[11px] font-black uppercase tracking-wider mb-1.5 text-white/90">Login</label>
          <div className="group flex h-11 items-center gap-2 rounded-lg bg-white px-3 ring-1 ring-white/20 transition focus-within:ring-2 focus-within:ring-white/80">
            <span className="text-[#8B0000]/70 transition group-focus-within:text-[#8B0000]">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 21a8 8 0 0 0-16 0" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite aqui seu login"
              autoComplete="username"
              required
              className="h-full min-w-0 flex-1 border-0 bg-transparent text-[14px] font-medium text-gray-800 outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-[11px] font-black uppercase tracking-wider mb-1.5 text-white/90">Senha</label>
          <div className="group flex h-11 items-center gap-2 rounded-lg bg-white px-3 ring-1 ring-white/20 transition focus-within:ring-2 focus-within:ring-white/80">
            <span className="text-[#8B0000]/70 transition group-focus-within:text-[#8B0000]">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
            </span>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite aqui sua senha"
              autoComplete="current-password"
              required
              className="h-full min-w-0 flex-1 border-0 bg-transparent text-[14px] font-medium text-gray-800 outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 text-[12px] font-bold text-white/85 sm:flex-row sm:items-center sm:justify-between">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={rememberLogin}
              onChange={(e) => setRememberLogin(e.target.checked)}
              className="h-4 w-4 rounded border-white/40 accent-[#2E7D32]"
            />
            Lembrar meu login
          </label>
          <Link to="/forgot-password" className="inline-flex items-center gap-1 text-white/90 underline decoration-white/25 underline-offset-4 transition hover:text-white hover:decoration-white">
            Esqueci minha senha
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {erro && <p className="m-0 rounded-lg bg-black/20 px-3 py-2 text-center text-[13px] font-semibold text-red-100">{erro}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#2E7D32] py-3 text-[13px] font-black uppercase tracking-widest text-white shadow-sm transition hover:bg-[#256b29] disabled:opacity-60"
        >
          {loading ? 'Aguarde...' : 'Acessar'}
        </button>
      </form>
    </AuthLayout>
  );
}
