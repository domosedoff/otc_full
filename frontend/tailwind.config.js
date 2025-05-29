// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
import { heroui } from "@heroui/react"; // <-- ИСПРАВЛЕНИЕ: ИМПОРТ ИЗ @heroui/react

export const content = [
  "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}", // <-- ИСПРАВЛЕНИЕ: ПУТЬ К КОМПОНЕНТАМ HEROUi
];
export const theme = {
  extend: {
    // Здесь могут быть твои кастомные стили Tailwind
  },
};
export const darkMode = "class";
export const plugins = [heroui()];
