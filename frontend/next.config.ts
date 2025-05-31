// frontend/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http", // Разрешаем HTTP
        hostname: "localhost", // Разрешаем localhost для локальных тестов
        port: "3000", // Порт бэкенда, если логотипы отдаются с него
        pathname: "**", // Разрешаем любые пути
      },
      {
        protocol: "https", // Разрешаем HTTPS
        hostname: "company.com", // Замени на реальный домен, с которого загружаются логотипы
        port: "", // Оставьте пустым, если стандартные порты (80/443)
        pathname: "**",
      },
      {
        protocol: "https", // Разрешаем HTTPS
        hostname: "example.com", // Добавь другие домены, если используешь CDN или другие источники
        port: "",
        pathname: "**",
      },
      // Добавь другие домены, если у тебя есть другие источники логотипов
    ],
  },
};

module.exports = nextConfig;
