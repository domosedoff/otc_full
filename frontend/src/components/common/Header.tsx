// frontend/src/components/common/Header.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation"; // Импортируем useRouter и usePathname
import api from "@/lib/api";

export function Header() {
  const router = useRouter();
  const pathname = usePathname(); // Инициализируем usePathname

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const updateAuthStatus = () => {
      const token = sessionStorage.getItem("accessToken");
      const role = sessionStorage.getItem("userRole");
      const name = sessionStorage.getItem("emitterName");

      setIsLoggedIn(!!token);
      setUserRole(role);
      setUserName(name);
    };

    // Обновляем статус при монтировании компонента и при изменении pathname
    updateAuthStatus();

    // Добавляем слушатель для события storage, чтобы реагировать на изменения в sessionStorage
    window.addEventListener("storage", updateAuthStatus);

    return () => {
      window.removeEventListener("storage", updateAuthStatus);
    };
  }, [pathname]); // НОВОЕ ИСПРАВЛЕНИЕ: Добавили pathname в массив зависимостей

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("emitterName");
    api.defaults.headers.common["Authorization"] = "";
    setIsLoggedIn(false);
    setUserRole(null);
    setUserName(null);
    router.push("/");
  };

  return (
    <header className="bg-gray-100 shadow-md fixed top-0 left-0 w-full z-50">
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
              {userRole === "emitter" && (
                <>
                  <span className="text-gray-700 font-medium">
                    {userName || "Эмитент"}
                  </span>
                  <Link
                    href="/profile/emitter"
                    className="px-3 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-100"
                  >
                    Мой профиль
                  </Link>
                </>
              )}
              {userRole === "admin" && (
                <>
                  <span className="text-gray-700 font-medium">
                    Админ-панель
                  </span>
                  <Link
                    href="/admin"
                    className="px-3 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-100"
                  >
                    Панель
                  </Link>
                </>
              )}
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
