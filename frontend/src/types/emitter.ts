// frontend/src/types/emitter.ts
import { CurrentSubscription } from "./subscription";

export interface EmitterProfile {
  id: string;
  name: string;
  email: string;
  inn?: string;
  ogrn_ogrnip?: string;
  legal_address?: string;
  actual_address?: string;
  phone?: string;
  website?: string;
  description?: string;
  logo_url?: string;
  status: "pending" | "approved" | "rejected"; // Статус модерации
  rejection_reason?: string; // ИСПРАВЛЕНИЕ: Имя поля изменено на rejection_reason
  createdAt: string;
  updatedAt: string;

  // Новые поля для финансовых данных
  ticker?: string;
  market?: string;
  industry?: string;
  market_cap?: number;
  stock_price?: number;
  trading_volume?: number;
  has_dividends?: boolean;
  rating?: string;
  company_status?: string;

  // Добавлено: информация о текущей подписке
  subscription?: CurrentSubscription;
}

// Интерфейс для данных, отправляемых при обновлении профиля
export interface UpdateEmitterProfilePayload {
  name?: string;
  email?: string;
  inn?: string;
  ogrn_ogrnip?: string;
  legal_address?: string;
  actual_address?: string;
  phone?: string;
  website?: string;
  description?: string;
  logo_url?: string;
  ticker?: string;
  market?: string;
  industry?: string;
  market_cap?: number;
  stock_price?: number;
  trading_volume?: number;
  has_dividends?: boolean;
  rating?: string;
  company_status?: string;
}
