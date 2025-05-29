// frontend/src/types/admin.ts

// Определяем допустимые значения для сортировки (должны совпадать с бэкендом)
type SortByField =
  | "market_cap"
  | "stock_price"
  | "trading_volume"
  | "name"
  | "created_at";
type SortOrder = "ASC" | "DESC";

// Соответствует GetEmittersFilterDto на бэкенде
export interface GetEmittersFilterDto {
  status?: "pending" | "approved" | "rejected";
  page?: number;
  limit?: number;
  sortBy?: SortByField; // <-- ИСПРАВЛЕНИЕ: Добавлено
  order?: SortOrder; // <-- ИСПРАВЛЕНИЕ: Добавлено
  ticker?: string;
  company_name?: string;
  market?: string;
  industry?: string;
  min_market_cap?: number;
  max_market_cap?: number;
  min_stock_price?: number;
  max_stock_price?: number;
  min_trading_volume?: number;
  max_trading_volume?: number;
  has_dividends?: boolean;
  rating?: string;
}
