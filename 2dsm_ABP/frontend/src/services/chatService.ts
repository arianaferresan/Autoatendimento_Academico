import type { ApiNodeResponse } from '../types/chat';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

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

// Nós raiz (cursos) — GET /api/public/options/root
export function fetchRootNodes(): Promise<ApiNodeResponse> {
  return apiFetch<ApiNodeResponse>('/api/public/options/root');
}

// Filhos de um nó — GET /api/public/options/:id
export function fetchNodeOptions(nodeId: number): Promise<ApiNodeResponse> {
  return apiFetch<ApiNodeResponse>(`/api/public/options/${nodeId}`);
}

// Envio de dúvida
export interface DoubtPayload {
  email:    string;
  doubt:    string;
  userType: string;
}
export async function submitDoubt(payload: DoubtPayload): Promise<void> {
  const res = await fetch(`${API_BASE}/api/public/doubt`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
}

// Envio de avaliação
export interface RatingPayload {
  rating:   string;
  userType: string;
}
export async function submitRating(payload: RatingPayload): Promise<void> {
  const res = await fetch(`${API_BASE}/api/public/rating`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
}