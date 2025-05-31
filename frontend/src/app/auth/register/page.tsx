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
    inn: "",
    ogrn_ogrnip: "",
    legal_address: "",
    actual_address: "",
    phone: "",
    website: "",
    description: "",
    logo_url: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // --- НОВАЯ ВАЛИДАЦИЯ ---
    const requiredFields: (keyof RegisterEmitterPayload)[] = [
      "name",
      "email",
      "password",
      "inn",
      "ogrn_ogrnip",
      "legal_address",
      "actual_address",
      "phone",
      "description",
    ];

    for (const field of requiredFields) {
      if (
        !formData[field] ||
        (typeof formData[field] === "string" &&
          !(formData[field] as string).trim())
      ) {
        setError(
          "Пожалуйста, заполните все обязательные поля, отмеченные звездочкой."
        );
        setLoading(false);
        return; // Прерываем выполнение, если поле не заполнено
      }
    }
    // --- КОНЕЦ НОВОЙ ВАЛИДАЦИИ ---

    try {
      const payload: RegisterEmitterPayload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        inn: formData.inn,
        ogrn_ogrnip: formData.ogrn_ogrnip,
        legal_address: formData.legal_address,
        actual_address: formData.actual_address,
        phone: formData.phone,
        description: formData.description,
        website: formData.website || undefined,
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
          noValidate
          className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Название компании<span className="ml-1 text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              autoComplete="organization"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email<span className="ml-1 text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              autoComplete="email"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Пароль<span className="ml-1 text-red-500">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              autoComplete="new-password"
            />
          </div>
          <div>
            <label
              htmlFor="inn"
              className="block text-sm font-medium text-gray-700"
            >
              ИНН<span className="ml-1 text-red-500">*</span>
            </label>
            <input
              id="inn"
              name="inn"
              type="text"
              required
              value={formData.inn}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              autoComplete="off"
            />
          </div>
          <div>
            <label
              htmlFor="ogrn_ogrnip"
              className="block text-sm font-medium text-gray-700"
            >
              ОГРН/ОГРНИП<span className="ml-1 text-red-500">*</span>
            </label>
            <input
              id="ogrn_ogrnip"
              name="ogrn_ogrnip"
              type="text"
              required
              value={formData.ogrn_ogrnip}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              autoComplete="off"
            />
          </div>
          <div>
            <label
              htmlFor="legal_address"
              className="block text-sm font-medium text-gray-700"
            >
              Юридический адрес<span className="ml-1 text-red-500">*</span>
            </label>
            <input
              id="legal_address"
              name="legal_address"
              type="text"
              required
              value={formData.legal_address}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              autoComplete="street-address"
            />
          </div>
          <div>
            <label
              htmlFor="actual_address"
              className="block text-sm font-medium text-gray-700"
            >
              Фактический адрес<span className="ml-1 text-red-500">*</span>
            </label>
            <input
              id="actual_address"
              name="actual_address"
              type="text"
              required
              value={formData.actual_address}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              autoComplete="street-address"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Телефон<span className="ml-1 text-red-500">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              autoComplete="tel"
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
              autoComplete="url"
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
              autoComplete="off"
            />
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Описание компании<span className="ml-1 text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              required
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {error && (
            <p className="md:col-span-2 text-sm text-red-600 text-center bg-red-100 p-3 rounded-md">
              {error}
            </p>
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
