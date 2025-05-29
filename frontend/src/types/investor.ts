// frontend/src/types/investor.ts

// Соответствует TrackInvestorInterestDto на бэкенде
export interface TrackInvestorInterestPayload {
  name: string;
  email: string;
  phone?: string;
}
