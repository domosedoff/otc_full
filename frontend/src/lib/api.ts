// frontend/src/lib/api.ts
import axios from "axios"; // Используем axios для HTTP-запросов

// Базовый URL для твоего бэкенд-API
// Убедись, что этот URL соответствует порту, на котором запущен твой бэкенд
const API_BASE_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Функция для добавления токена авторизации к запросам
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export default api;
