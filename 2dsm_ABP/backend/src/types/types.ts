export type UserRole = 'admin' | 'secretaria';

export interface JwtPayload {
  id: number;
  username: string;
  role: UserRole;
  name: string;
  mustChangePassword?: boolean;
}

export interface UserRow {
  id: number;
  username: string;
  password_hash: string;
  role: UserRole;
  name: string;
  active: boolean;
  troca_senha_obrigatoria: boolean;
  created_at: Date;
}

export interface PasswordResetTokenRow {
  id: number;
  user_id: number;
  token_hash: string;
  expires_at: Date;
  used_at: Date | null;
  created_at: Date;
}

export type PasswordResetRequestStatus = 'pendente' | 'atendida' | 'cancelada';

export interface PasswordResetRequestRow {
  id: number;
  login_institucional: string;
  usuario_id: number | null;
  status: PasswordResetRequestStatus;
  data_solicitacao: Date;
  data_atendimento: Date | null;
  admin_responsavel_id: number | null;
  observacao: string | null;
  user_name?: string | null;
  user_active?: boolean | null;
  admin_name?: string | null;
}
