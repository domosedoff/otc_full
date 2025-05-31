// frontend/src/app/auth/admin/login/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api, { setAuthToken } from "@/lib/api";
import { AdminAuthResponse } from "@/types/auth"; // Используем AdminAuthResponse
import axios from "axios";

export default function AdminLoginPage() {
  const [username, setUsername] = useState(""); // Для админа используем username
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post<AdminAuthResponse>("/auth/admin/login", {
        username,
        password,
      });

      sessionStorage.setItem("accessToken", response.data.accessToken);
      sessionStorage.setItem("userRole", "admin");
      // Для админа имя компании не требуется, но можно сохранить username, если нужно
      sessionStorage.setItem("adminUsername", response.data.admin.username);
      setAuthToken(response.data.accessToken);

      router.push("/admin"); // Перенаправляем на админ-панель
    } catch (err: unknown) {
      console.error("Admin login error:", err);
      if (
        axios.isAxiosError(err) &&
        err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data
      ) {
        const errorMessage = (
          err.response.data as { message: string | string[] }
        ).message;
        setError(
          Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage
        );
      } else {
        setError("Неверный логин или пароль. Пожалуйста, попробуйте снова.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] py-8 md:py-10">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Вход для Администраторов
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Логин
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              autoComplete="username"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Пароль
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center bg-red-100 p-3 rounded-md">
              {error}
            </p>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Вход..." : "Войти"}
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          <Link
            href="/auth/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Вход для Эмитентов
          </Link>
        </p>
      </div>
    </section>
  );
}
