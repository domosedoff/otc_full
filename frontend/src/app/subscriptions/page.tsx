// frontend/src/app/subscriptions/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api, { setAuthToken } from "@/lib/api";
import axios from "axios";
import { EmitterProfile } from "@/types/emitter";
import {
  Tariff,
  CurrentSubscription,
  ActivateSubscriptionResponse,
} from "@/types/subscription";

export default function SubscriptionsPage() {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [currentSubscription, setCurrentSubscription] =
    useState<CurrentSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      const accessToken = sessionStorage.getItem("accessToken");
      const userRole = sessionStorage.getItem("userRole");

      if (!accessToken || userRole !== "emitter") {
        router.push("/auth/login");
        return;
      }

      setAuthToken(accessToken);
      setError(null);
      setSuccessMessage(null);

      try {
        // Запрос тарифов
        // Ожидаем, что бэкенд может вернуть либо Tariff[], либо один Tariff объект
        const tariffsResponse = await api.get<Tariff[] | Tariff>(
          "/subscriptions/tariffs"
        );

        // --- ИСПРАВЛЕНИЕ ЗДЕСЬ ---
        if (Array.isArray(tariffsResponse.data)) {
          setTariffs(tariffsResponse.data);
        } else if (tariffsResponse.data) {
          // Если это один объект тарифа, оборачиваем его в массив
          setTariffs([tariffsResponse.data]);
        } else {
          setTariffs([]); // Если данных нет, устанавливаем пустой массив
        }
        // --- КОНЕЦ ИСПРАВЛЕНИЯ ---

        // Запрос текущей подписки эмитента через профиль
        const profileResponse = await api.get<EmitterProfile>(
          "/profile/emitter"
        );
        if (profileResponse.data && profileResponse.data.subscription) {
          setCurrentSubscription(profileResponse.data.subscription);
        }
      } catch (err: unknown) {
        console.error("Failed to fetch subscription data:", err);
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
            "Не удалось загрузить данные о подписках. Пожалуйста, попробуйте позже."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [router]);

  const handleActivateSubscription = async (tariffId: string) => {
    setError(null);
    setSuccessMessage(null);
    setSubmitting(true);

    try {
      const response = await api.post<ActivateSubscriptionResponse>(
        "/subscriptions/activate",
        { tariffId }
      );
      setSuccessMessage(
        response.data.message || "Подписка успешно активирована!"
      );

      // После активации повторно запрашиваем данные профиля, чтобы обновить информацию о текущей подписке
      const profileResponse = await api.get<EmitterProfile>("/profile/emitter");
      if (profileResponse.data && profileResponse.data.subscription) {
        setCurrentSubscription(profileResponse.data.subscription);
      }
    } catch (err: unknown) {
      console.error("Failed to activate subscription:", err);
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
          "Не удалось активировать подписку. Пожалуйста, попробуйте позже."
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

  return (
    <section className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] py-8 md:py-10">
      <div className="w-full max-w-3xl p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Управление Подпиской
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

        {currentSubscription ? (
          <div className="bg-blue-50 p-6 rounded-lg shadow-inner border border-blue-200">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">
              Ваша текущая подписка
            </h2>
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
                className={`md:col-span-2 ${
                  getRemainingDays(currentSubscription.endDate) <= 7
                    ? "text-red-600 font-bold"
                    : ""
                }`}
              >
                <strong>Осталось дней:</strong>{" "}
                {getRemainingDays(currentSubscription.endDate)}
              </p>
              <p>
                <strong>Статус оплаты:</strong>{" "}
                {currentSubscription.paymentStatus}
              </p>
            </div>
            {getRemainingDays(currentSubscription.endDate) <= 7 && (
              <p className="mt-4 text-orange-600 text-center font-medium">
                Срок действия вашей подписки истекает! Пожалуйста, продлите её.
              </p>
            )}
          </div>
        ) : (
          <div className="bg-yellow-50 p-6 rounded-lg shadow-inner border border-yellow-200 text-center">
            <p className="text-xl font-semibold text-yellow-800">
              У вас пока нет активной подписки.
            </p>
            <p className="text-gray-600 mt-2">
              Выберите тариф ниже, чтобы начать.
            </p>
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-900 text-center mt-8 mb-6">
          Доступные тарифы
        </h2>

        {tariffs.length === 0 && !loading && (
          <p className="text-center text-gray-600">Тарифы пока не доступны.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tariffs.map((tariff) => (
            <div
              key={tariff.id}
              className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {tariff.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {tariff.description}
                </p>
                <p className="text-3xl font-bold text-blue-600 mb-4">
                  {tariff.price} руб.
                  <span className="text-base font-normal text-gray-500">
                    /{tariff.duration_days} дней
                  </span>
                </p>
              </div>
              <button
                onClick={() => handleActivateSubscription(tariff.id)}
                disabled={submitting}
                className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 mt-4"
              >
                {submitting ? "Активация..." : "Активировать подписку"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
