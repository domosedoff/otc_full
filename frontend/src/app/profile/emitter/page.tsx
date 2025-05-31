// frontend/src/app/profile/emitter/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api, { setAuthToken } from "@/lib/api";
import { EmitterProfile, UpdateEmitterProfilePayload } from "@/types/emitter";
import { CurrentSubscription } from "@/types/subscription";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

export default function EmitterProfilePage() {
  const [profile, setProfile] = useState<EmitterProfile | null>(null);
  const [formData, setFormData] = useState<UpdateEmitterProfilePayload>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const accessToken = sessionStorage.getItem("accessToken");
      const userRole = sessionStorage.getItem("userRole");

      if (!accessToken || userRole !== "emitter") {
        router.push("/auth/login");
        return;
      }

      setAuthToken(accessToken);

      try {
        const response = await api.get<EmitterProfile>("/profile/emitter");
        setProfile(response.data);
        // Инициализируем formData текущими значениями профиля
        setFormData({
          name: response.data.name,
          email: response.data.email,
          inn: response.data.inn || "",
          ogrn_ogrnip: response.data.ogrn_ogrnip || "",
          legal_address: response.data.legal_address || "",
          actual_address: response.data.actual_address || "",
          phone: response.data.phone || "",
          website: response.data.website || "",
          description: response.data.description || "",
          logo_url: response.data.logo_url || "",
          ticker: response.data.ticker || "",
          market: response.data.market || "",
          industry: response.data.industry || "",
          market_cap: response.data.market_cap ?? undefined,
          stock_price: response.data.stock_price ?? undefined,
          trading_volume: response.data.trading_volume ?? undefined,
          has_dividends: response.data.has_dividends ?? false,
          rating: response.data.rating || "",
          company_status: response.data.company_status || "",
        });
      } catch (err: unknown) {
        console.error("Failed to fetch emitter profile:", err);
        if (
          axios.isAxiosError(err) &&
          err.response &&
          err.response.status === 401
        ) {
          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("userRole");
          router.push("/auth/login");
        } else {
          setError(
            "Не удалось загрузить профиль. Пожалуйста, попробуйте позже."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name } = e.target;
    let value: string | boolean | number | undefined;

    if (e.target instanceof HTMLInputElement) {
      if (e.target.type === "checkbox") {
        value = e.target.checked;
      } else if (e.target.type === "number") {
        value = e.target.value === "" ? undefined : parseFloat(e.target.value);
      } else {
        value = e.target.value;
      }
    } else {
      value = e.target.value;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setSubmitting(true);

    try {
      const payloadToSend: UpdateEmitterProfilePayload = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => {
          if (
            typeof value === "string" &&
            value.trim() === "" &&
            key !== "has_dividends"
          ) {
            return [key, undefined];
          }
          if (typeof value === "number" && isNaN(value)) {
            return [key, undefined];
          }
          return [key, value];
        })
      );

      const response = await api.put<EmitterProfile>(
        "/profile/emitter",
        payloadToSend
      );
      setProfile(response.data);
      setSuccessMessage("Профиль успешно обновлен!");
    } catch (err: unknown) {
      console.error("Failed to update profile:", err);
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
        setError("Не удалось обновить профиль. Пожалуйста, попробуйте позже.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitForReview = async () => {
    setError(null);
    setSuccessMessage(null);
    setSubmitting(true);

    try {
      await api.post("/profile/emitter/submit-for-review");
      setSuccessMessage("Профиль отправлен на модерацию!");
      setProfile((prev) => (prev ? { ...prev, status: "pending" } : null));
    } catch (err: unknown) {
      console.error("Failed to submit for review:", err);
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
          "Не удалось отправить профиль на модерацию. Пожалуйста, попробуйте позже."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Вспомогательная функция для форматирования даты
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("ru-RU", options);
  };

  // Вспомогательная функция для расчета оставшихся дней
  const getRemainingDays = (endDateString: string) => {
    const endDate = new Date(endDateString);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-128px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-128px)] text-red-600">
        Ошибка загрузки профиля.
      </div>
    );
  }

  const currentSubscription: CurrentSubscription | undefined =
    profile.subscription;
  const remainingDays = currentSubscription
    ? getRemainingDays(currentSubscription.endDate)
    : 0;
  const isSubscriptionExpiring =
    currentSubscription && remainingDays <= 7 && remainingDays > 0;
  const isSubscriptionExpired =
    currentSubscription &&
    remainingDays === 0 &&
    new Date(currentSubscription.endDate) < new Date();

  return (
    <section className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] py-8 md:py-10">
      <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Профиль Эмитента
        </h1>

        {error && (
          <p className="text-sm text-red-600 text-center bg-red-100 p-3 rounded-md">
            {error}
          </p>
        )}
        {successMessage && (
          <p className="text-sm text-green-600 text-center bg-green-100 p-3 rounded-md">
            {successMessage}
          </p>
        )}

        {/* Блок статуса профиля */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 p-4 bg-blue-50 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">
            Статус профиля:{" "}
            <span
              className={`font-bold ${
                profile.status === "approved"
                  ? "text-green-600"
                  : profile.status === "pending"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {profile.status === "pending"
                ? "На модерации"
                : profile.status === "approved"
                ? "Одобрен"
                : "Отклонен"}
            </span>
          </h2>
          {profile.status === "rejected" &&
            profile.rejection_reason && ( // ИСПРАВЛЕНИЕ: Имя поля изменено на rejection_reason
              <p className="text-sm text-red-600 italic mt-2 md:mt-0 md:ml-4">
                Причина отклонения: {profile.rejection_reason}
              </p>
            )}
          {profile.status !== "pending" && (
            <button
              onClick={handleSubmitForReview}
              disabled={submitting}
              className="mt-4 md:mt-0 md:ml-4 py-2 px-4 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
              {submitting ? "Отправка..." : "Отправить на модерацию"}
            </button>
          )}
        </div>

        {/* Блок информации о подписке */}
        <div
          className={`p-6 rounded-lg shadow-inner border ${
            isSubscriptionExpired
              ? "bg-red-50 border-red-200"
              : isSubscriptionExpiring
              ? "bg-orange-50 border-orange-200"
              : "bg-green-50 border-green-200"
          }`}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Информация о подписке
          </h2>
          {currentSubscription ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <p>
                <strong>Тариф:</strong>{" "}
                {currentSubscription.tariff?.name || "Неизвестно"}
              </p>
              <p>
                <strong>Стоимость:</strong> {currentSubscription.paymentAmount}{" "}
                руб.
              </p>
              <p>
                <strong>Дата начала:</strong>{" "}
                {formatDate(currentSubscription.startDate)}
              </p>
              <p>
                <strong>Дата окончания:</strong>{" "}
                {formatDate(currentSubscription.endDate)}
              </p>
              <p
                className={`md:col-span-2 font-bold ${
                  isSubscriptionExpired
                    ? "text-red-600"
                    : isSubscriptionExpiring
                    ? "text-orange-600"
                    : "text-green-600"
                }`}
              >
                <strong>Осталось дней:</strong> {remainingDays}
                {isSubscriptionExpired && " (Истекла)"}
                {isSubscriptionExpiring && " (Скоро истечет)"}
              </p>
              <p>
                <strong>Статус оплаты:</strong>{" "}
                {currentSubscription.paymentStatus}
              </p>
              <div className="md:col-span-2 mt-4">
                <Link
                  href="/subscriptions"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Управлять подпиской
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-xl font-semibold text-gray-800 mb-4">
                У вас нет активной подписки.
              </p>
              <Link
                href="/subscriptions"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Активировать подписку
              </Link>
            </div>
          )}
        </div>

        {/* Форма обновления профиля */}
        <form
          onSubmit={handleUpdateProfile}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-8"
        >
          {/* Основные данные компании */}
          <div className="md:col-span-2 text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
            Основные данные компании
          </div>
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
              value={formData.name || ""}
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
              value={formData.email || ""}
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
              value={formData.inn || ""}
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
              value={formData.ogrn_ogrnip || ""}
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
              value={formData.legal_address || ""}
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
              value={formData.actual_address || ""}
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
              value={formData.phone || ""}
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
              value={formData.website || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="md:col-span-2">
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
              value={formData.logo_url || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {formData.logo_url && (
              <div className="mt-2">
                <Image
                  src={formData.logo_url}
                  alt="Логотип компании"
                  width={100}
                  height={100}
                  className="rounded-md object-contain"
                />
              </div>
            )}
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
              value={formData.description || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Финансовые данные */}
          <div className="md:col-span-2 text-lg font-semibold text-gray-800 border-b pb-2 mb-4 mt-6">
            Финансовые данные
          </div>
          <div>
            <label
              htmlFor="ticker"
              className="block text-sm font-medium text-gray-700"
            >
              Тикер
            </label>
            <input
              id="ticker"
              name="ticker"
              type="text"
              value={formData.ticker || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="market"
              className="block text-sm font-medium text-gray-700"
            >
              Рынок
            </label>
            <input
              id="market"
              name="market"
              type="text"
              value={formData.market || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="industry"
              className="block text-sm font-medium text-gray-700"
            >
              Отрасль
            </label>
            <input
              id="industry"
              name="industry"
              type="text"
              value={formData.industry || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="market_cap"
              className="block text-sm font-medium text-gray-700"
            >
              Рыночная капитализация
            </label>
            <input
              id="market_cap"
              name="market_cap"
              type="number"
              value={formData.market_cap ?? ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="stock_price"
              className="block text-sm font-medium text-gray-700"
            >
              Цена акции
            </label>
            <input
              id="stock_price"
              name="stock_price"
              type="number"
              step="0.01"
              value={formData.stock_price ?? ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="trading_volume"
              className="block text-sm font-medium text-gray-700"
            >
              Объем торгов
            </label>
            <input
              id="trading_volume"
              name="trading_volume"
              type="number"
              value={formData.trading_volume ?? ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center">
            <input
              id="has_dividends"
              name="has_dividends"
              type="checkbox"
              checked={formData.has_dividends || false}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="has_dividends"
              className="ml-2 block text-sm font-medium text-gray-700"
            >
              Есть дивиденды
            </label>
          </div>
          <div>
            <label
              htmlFor="rating"
              className="block text-sm font-medium text-gray-700"
            >
              Рейтинг
            </label>
            <input
              id="rating"
              name="rating"
              type="text"
              value={formData.rating || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="company_status"
              className="block text-sm font-medium text-gray-700"
            >
              Статус компании
            </label>
            <input
              id="company_status"
              name="company_status"
              type="text"
              value={formData.company_status || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="md:col-span-2 mt-6">
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {submitting ? "Сохранение..." : "Сохранить изменения"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
