// frontend/src/app/auth/register/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api, { setAuthToken } from "@/lib/api";
import { RegisterEmitterPayload, EmitterAuthResponse } from "@/types/auth";
import axios from "axios";

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterEmitterPayload>({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // <-- ИСПРАВЛЕНИЕ ЗДЕСЬ
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: RegisterEmitterPayload = {
        ...formData,
        inn: formData.inn || undefined,
        ogrn_ogrnip: formData.ogrn_ogrnip || undefined,
        legal_address: formData.legal_address || undefined,
        actual_address: formData.actual_address || undefined,
        phone: formData.phone || undefined,
        website: formData.website || undefined,
        description: formData.description || undefined,
        logo_url: formData.logo_url || undefined,
      };

      const response = await api.post<EmitterAuthResponse>(
        "/auth/emitter/register",
        payload
      );

      sessionStorage.setItem("accessToken", response.data.accessToken);
      sessionStorage.setItem("userRole", "emitter");
      setAuthToken(response.data.accessToken);

      router.push("/profile/emitter");
    } catch (err: unknown) {
      console.error("Registration error:", err);
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
        setError(
          "Произошла ошибка при регистрации. Пожалуйста, попробуйте позже."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] py-8 md:py-10">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Регистрация Эмитента
        </h1>
        <form
          onSubmit={handleRegister}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Название компании
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="inn"
              className="block text-sm font-medium text-gray-700"
            >
              ИНН
            </label>
            <input
              id="inn"
              name="inn"
              type="text"
              value={formData.inn}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="ogrn_ogrnip"
              className="block text-sm font-medium text-gray-700"
            >
              ОГРН/ОГРНИП
            </label>
            <input
              id="ogrn_ogrnip"
              name="ogrn_ogrnip"
              type="text"
              value={formData.ogrn_ogrnip}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="legal_address"
              className="block text-sm font-medium text-gray-700"
            >
              Юридический адрес
            </label>
            <input
              id="legal_address"
              name="legal_address"
              type="text"
              value={formData.legal_address}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="actual_address"
              className="block text-sm font-medium text-gray-700"
            >
              Фактический адрес
            </label>
            <input
              id="actual_address"
              name="actual_address"
              type="text"
              value={formData.actual_address}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Телефон
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="website"
              className="block text-sm font-medium text-gray-700"
            >
              Веб-сайт
            </label>
            <input
              id="website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="logo_url"
              className="block text-sm font-medium text-gray-700"
            >
              URL логотипа
            </label>
            <input
              id="logo_url"
              name="logo_url"
              type="url"
              value={formData.logo_url}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Описание компании
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {error && (
            <p className="md:col-span-2 text-sm text-red-600">{error}</p>
          )}

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Регистрация..." : "Зарегистрироваться"}
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Уже есть аккаунт?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Войти
          </Link>
        </p>
      </div>
    </section>
  );
}
