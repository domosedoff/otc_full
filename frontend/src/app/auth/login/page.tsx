// frontend/src/app/auth/login/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api, { setAuthToken } from "@/lib/api";
import { EmitterAuthResponse, AdminAuthResponse } from "@/types/auth";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Попытка входа как эмитент
      const emitterResponse = await api.post<EmitterAuthResponse>(
        "/auth/emitter/login",
        { email, password }
      );
      sessionStorage.setItem("accessToken", emitterResponse.data.accessToken);
      sessionStorage.setItem("userRole", "emitter");
      sessionStorage.setItem("emitterName", emitterResponse.data.emitter.name); // ДОБАВЬ ЭТУ СТРОКУ
      setAuthToken(emitterResponse.data.accessToken);
      router.push("/profile/emitter");
      return; // Выходим, если вход как эмитент успешен
    } catch (emitterErr: unknown) {
      // Если вход как эмитент не удался, пробуем войти как админ
      console.warn("Emitter login failed, attempting admin login:", emitterErr);
      try {
        const adminResponse = await api.post<AdminAuthResponse>(
          "/auth/admin/login",
          { username: email, password }
        ); // Для админа используется username
        sessionStorage.setItem("accessToken", adminResponse.data.accessToken);
        sessionStorage.setItem("userRole", "admin");
        setAuthToken(adminResponse.data.accessToken);
        router.push("/admin");
        return; // Выходим, если вход как админ успешен
      } catch (adminErr: unknown) {
        console.error("Admin login failed:", adminErr);
        if (
          axios.isAxiosError(adminErr) &&
          adminErr.response &&
          adminErr.response.data &&
          typeof adminErr.response.data === "object" &&
          "message" in adminErr.response.data
        ) {
          const errorMessage = (
            adminErr.response.data as { message: string | string[] }
          ).message;
          setError(
            Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage
          );
        } else {
          setError(
            "Неверный Email/Логин или пароль. Пожалуйста, попробуйте снова."
          );
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] py-8 md:py-10">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">Вход</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email или Логин
            </label>
            <input
              id="email"
              name="email"
              type="text" // Изменено на 'text' для универсальности (email/username)
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              autoComplete="username" // Указываем, что это поле для имени пользователя/логина
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
              autoComplete="current-password" // Указываем, что это текущий пароль
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
          Нет аккаунта?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Зарегистрироваться как эмитент
          </Link>
        </p>
      </div>
    </section>
  );
}
