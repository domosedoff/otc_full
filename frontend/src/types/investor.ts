// frontend/src/types/investor.ts

// Интерфейс для данных, отправляемых при фиксации интереса инвестора
export interface TrackInterestPayload {
  name: string;
  email: string;
  phone: string;
  origin_url?: string; // Добавлено поле origin_url согласно отложенным задачам
}

// Интерфейс для ответа после фиксации интереса инвестора
export interface TrackInterestResponse {
  message: string;
  investor: {
    id: string;
    name: string;
    email: string;
    phone: string;
    origin_url?: string;
    createdAt: string;
  };
}
