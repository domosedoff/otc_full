// frontend/src/types/auth.ts

export interface RegisterEmitterPayload {
  name: string;
  email: string;
  password: string;
  inn: string; // Сделано обязательным
  ogrn_ogrnip: string; // Сделано обязательным
  legal_address: string; // Сделано обязательным
  actual_address: string; // Сделано обязательным
  phone: string; // Сделано обязательным
  website?: string; // Остается необязательным
  description: string; // Сделано обязательным
  logo_url?: string; // Остается необязательным
}

export interface EmitterAuthResponse {
  accessToken: string;
  emitter: {
    id: string;
    name: string;
    email: string;
    status: "pending" | "approved" | "rejected";
  };
}

export interface AdminAuthResponse {
  accessToken: string;
  admin: {
    id: string;
    username: string;
  };
}
