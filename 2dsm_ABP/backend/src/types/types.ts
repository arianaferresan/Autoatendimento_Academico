export type UserRole = 'admin' | 'secretaria';

export interface JwtPayload {
  id: number;
  username: string;
  role: UserRole;
  name: string;
}

export interface UserRow {
  id: number;
  username: string;
  password_hash: string;
  role: UserRole;
  name: string;
  active: boolean;
  created_at: Date;
}
