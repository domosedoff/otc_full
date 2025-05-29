// frontend/src/types/emitter.ts

// Вспомогательный тип для финансовых данных в профиле
export interface FinancialDataProfileInfo {
  ticker?: string | null;
  market?: string | null;
  industry?: string | null;
  market_cap?: number | null;
  stock_price?: number | null;
  trading_volume?: number | null;
  has_dividends?: boolean | null;
  rating?: string | null;
  company_status?: string | null;
}

// Соответствует EmitterProfileDto на бэкенде
export interface EmitterProfileDto {
  emitent_id: string;
  name: string;
  email: string;
  inn?: string | null;
  ogrn_ogrnip?: string | null;
  legal_address?: string | null;
  actual_address?: string | null;
  phone?: string | null;
  website?: string | null;
  description?: string | null;
  logo_url?: string | null;
  status: "pending" | "approved" | "rejected";
  rejection_reason?: string | null;
  created_at: Date;
  updated_at: Date;
  financialData?: FinancialDataProfileInfo;

  subscription?: {
    subscribe_id: string;
    tariff_name: string;
    start_date: Date;
    end_date: Date;
    payment_status: "active" | "disable";
    days_remaining: number;
    is_active: boolean;
  };
  analitics?: {
    page_views: number;
    external_link_clicks: number;
  };
}

// Соответствует UpdateEmitterProfileDto на бэкенде
export interface UpdateEmitterProfilePayload {
  name?: string;
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
  has_dividends?: boolean | null;
  rating?: string;
  company_status?: string;
}

// ИСПРАВЛЕНИЕ: PublicEmitterSummary - теперь интерфейс, расширяющий Pick
export interface PublicEmitterSummary
  extends Pick<
    EmitterProfileDto,
    "emitent_id" | "name" | "description" | "logo_url"
  > {
  // Поля из FinancialDataProfileInfo, которые будут отображаться в списке
  ticker?: string | null;
  market?: string | null;
  industry?: string | null;
  market_cap?: number | null;
  stock_price?: number | null;
  trading_volume?: number | null;
  has_dividends?: boolean | null;
  rating?: string | null;
  company_status?: string | null;
}
