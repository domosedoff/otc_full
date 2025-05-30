// frontend/src/components/common/Header.tsx
"use client";

import React from "react";
import Link from "next/link";
// import { useRouter } from 'next/navigation'; // <-- ИСПРАВЛЕНИЕ: Убран импорт useRouter

export function Header() {
  // const router = useRouter(); // <-- ИСПРАВЛЕНИЕ: Убрана инициализация router
  const isLoggedIn = false; // Заглушка, позже будем брать из состояния
  const userName = "Имя Эмитента"; // Заглушка

  const handleLogout = () => {
    alert("Выход из системы");
  };

  return (
    <header className="bg-gray-100 shadow-md">
      <nav className="container mx-auto max-w-7xl px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-800">
          OTC Marketplace
        </Link>
        <div className="hidden sm:flex space-x-4">
          <Link href="/" className="text-gray-600 hover:text-blue-600">
            Главная
          </Link>
          <Link href="/screener" className="text-gray-600 hover:text-blue-600">
            Скринер
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-blue-600">
            О сервисе
          </Link>
          <Link href="/info" className="text-gray-600 hover:text-blue-600">
            Полезная инфа
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <span className="text-gray-700">{userName}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Выход
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Я эмитент
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
