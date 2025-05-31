// frontend/src/types/subscription.ts

export interface Tariff {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_days: number;
}

export interface CurrentSubscription {
  id: string;
  tariff: Tariff; // Включаем информацию о тарифе
  startDate: string;
  endDate: string;
  paymentStatus: string;
  paymentAmount: number;
}

export interface ActivateSubscriptionResponse {
  message: string;
  subscription: CurrentSubscription;
}
