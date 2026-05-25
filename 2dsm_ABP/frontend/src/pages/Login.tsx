import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
const logoFatec = '/logo-fatec.png';
const logoCps = '/logo-cps.png';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.BaseSyntheticEvent) {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', data.token);
      navigate('/admin');
    } catch {
      setErro('Usuário ou senha inválidos');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundImage: 'url(/background.png)',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center top',
    }}>
      <header style={{
  backgroundColor: '#ffffff',
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
    <button style={{ backgroundColor: '#8B0000', border: 'none', padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </button>
  </div>
</header>

      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 16px',
      }}>
        <h1 style={{ color: '#222', fontSize: '26px', fontWeight: 600, margin: '0 0 4px 0' }}>
          Área administrativa
        </h1>
        <p style={{ color: '#555', fontSize: '13px', margin: '0 0 24px 0' }}>
          Efetue o login para acessar a área administrativa
        </p>

        <div style={{
          backgroundColor: '#8B0000',
          borderRadius: '8px',
          padding: '28px 32px',
          width: '340px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label htmlFor="username" style={{ display: 'block', color: '#fff', fontSize: '13px', marginBottom: '6px' }}>Login:</label>
              <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite aqui seu login" autoComplete="username" required
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: 'none', fontSize: '14px', color: '#333', backgroundColor: '#fff', boxSizing: 'border-box', outline: 'none' }} />
            </div>
            <div>
              <label htmlFor="password" style={{ display: 'block', color: '#fff', fontSize: '13px', marginBottom: '6px' }}>Senha:</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite aqui sua senha" autoComplete="current-password" required
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: 'none', fontSize: '14px', color: '#333', backgroundColor: '#fff', boxSizing: 'border-box', outline: 'none' }} />
            </div>
            {erro && <p style={{ margin: 0, color: '#ffcdd2', fontSize: '13px', textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '4px', padding: '8px 12px' }}>{erro}</p>}
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '12px', backgroundColor: '#2E7D32', color: '#fff', fontSize: '15px', fontWeight: 600, border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Aguarde...' : 'Acessar'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}