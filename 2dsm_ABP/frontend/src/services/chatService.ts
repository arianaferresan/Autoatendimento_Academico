import type { ApiNodeResponse } from '../types/chat';

const API_BASE = '';

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export function fetchRootNodes(): Promise<ApiNodeResponse> {
  return apiFetch<ApiNodeResponse>('/api/options');
}

export function fetchNodeOptions(nodeId: number): Promise<ApiNodeResponse> {
  return apiFetch<ApiNodeResponse>(`/api/options/${nodeId}`);
}

/**
 * Busca os nós raiz e retorna o id do nó destinado a externos
 * (qualquer nó cujo título contenha "não sou aluno", case-insensitive).
 * Retorna null se não encontrar.
 */
export async function fetchExternoNodeId(): Promise<number | null> {
  const response = await fetchRootNodes();
  if (response.type !== 'menu') return null;
  const found = response.options.find((o) =>
    o.title.toLowerCase().includes('não sou aluno'),
  );
  return found?.id ?? null;
}

export interface DoubtPayload {
  email: string;
  doubt: string;
  userType: string;
}

export async function submitDoubt(payload: DoubtPayload): Promise<void> {
  const res = await fetch(`${API_BASE}/api/perguntas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: payload.email, message: payload.doubt }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
}

export interface RatingPayload {
  rating: string;
  userType: string;
}

export async function submitRating(_payload: RatingPayload): Promise<void> {
  // Ainda não existe rota de avaliação no backend.
  // Por enquanto só evita quebrar o front.
  return Promise.resolve();
}