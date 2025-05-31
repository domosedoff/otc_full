// frontend/src/types/screener.ts

// Интерфейс для параметров фильтрации эмитентов
export interface EmitterFilterParams {
  ticker?: string;
  name?: string; // Название компании
  market?: string;
  industry?: string;
  min_market_cap?: number;
  max_market_cap?: number;
  min_stock_price?: number;
  max_stock_price?: number;
  min_trading_volume?: number;
  max_trading_volume?: number;
  has_dividends?: boolean;
  min_rating?: number;
  max_rating?: number;
  company_status?: string; // 'Активна', 'Неактивна'
  page?: number; // Номер текущей страницы для пагинации
  limit?: number; // Количество элементов на странице для пагинации
}

// Интерфейс для ответа API со списком эмитентов
// Предполагаем, что бэкенд возвращает объект с данными, общим количеством, текущей страницей и лимитом
import { EmitterProfile } from "./emitter"; // Импортируем EmitterProfile из emitter.ts

export interface EmittersApiResponse {
  data: EmitterProfile[]; // Массив эмитентов
  total: number; // Общее количество эмитентов, соответствующих фильтрам
  page: number; // Текущая страница
  limit: number; // Лимит на странице
}
