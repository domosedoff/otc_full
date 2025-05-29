// frontend/src/types/auth.ts
// Соответствует RegisterEmitterDto на бэкенде
export interface RegisterEmitterPayload {
  name: string;
  email: string;
  password: string;
  inn?: string;
  ogrn_ogrnip?: string;
  legal_address?: string;
  actual_address?: string;
  phone?: string;
  website?: string;
  description?: string;
  logo_url?: string;
}

// Соответствует LoginEmitterDto на бэкенде
export interface LoginEmitterPayload {
  email: string;
  password: string;
}

// Соответствует LoginAdminDto на бэкенде
export interface LoginAdminPayload {
  username?: string;
  email?: string;
  password: string;
}

// Соответствует EmitterAuthResponseDto на бэкенде (частично)
export interface EmitterAuthResponse {
  message: string;
  accessToken: string;
  emitter: {
    emitent_id: string;
    name: string;
    email: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
}

// Соответствует AdminAuthResponseDto на бэкенде (частично)
export interface AdminAuthResponse {
  message: string;
  accessToken: string;
  admin: {
    admin_id: string;
    username: string;
    email?: string | null;
    role: string;
    created_at: string;
    updated_at: string;
  };
}
