// frontend/src/app/admin/emitters/[id]/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import api, { setAuthToken } from "@/lib/api";
import axios from "axios";
import { EmitterProfile } from "@/types/emitter"; // Используем EmitterProfile для данных эмитента

interface AdminEmitterDetailsPageProps {
  params: { id: string };
}

export default function AdminEmitterDetailsPage({
  params,
}: AdminEmitterDetailsPageProps) {
  const { id } = params;
  const router = useRouter();

  const [emitter, setEmitter] = useState<EmitterProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionInput, setShowRejectionInput] = useState(false);

  const isRedirecting = useRef(false); // Флаг для предотвращения множественных перенаправлений

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    const userRole = sessionStorage.getItem("userRole");

    if (!accessToken || userRole !== "admin") {
      if (!isRedirecting.current) {
        isRedirecting.current = true;
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("userRole");
        router.replace("/auth/admin/login");
      }
      setLoading(false);
      return;
    }

    setAuthToken(accessToken);

    const fetchEmitterDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<EmitterProfile>(`/admin/emitters/${id}`);
        setEmitter(response.data);
      } catch (err: unknown) {
        console.error("Failed to fetch emitter details:", err);
        if (
          axios.isAxiosError(err) &&
          err.response &&
          err.response.status === 401
        ) {
          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("userRole");
          router.replace("/auth/admin/login");
        } else if (
          axios.isAxiosError(err) &&
          err.response &&
          err.response.status === 404
        ) {
          setError("Эмитент не найден.");
        } else {
          setError(
            "Не удалось загрузить информацию об эмитенте. Пожалуйста, попробуйте позже."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (id && !isRedirecting.current) {
      fetchEmitterDetails();
    }
  }, [id, router]);

  const handleUpdateStatus = async (status: "approved" | "rejected") => {
    setActionError(null);
    setActionSuccess(null);
    setSubmitting(true);

    if (status === "rejected" && !rejectionReason.trim()) {
      setActionError("Пожалуйста, укажите причину отклонения.");
      setSubmitting(false);
      return;
    }

    try {
      const payload: { status: string; reason?: string } = { status };
      if (status === "rejected") {
        payload.reason = rejectionReason.trim();
      }

      const response = await api.patch<EmitterProfile>(
        `/admin/emitters/${id}/status`,
        payload
      );
      setEmitter(response.data); // Обновляем статус локально
      setActionSuccess(
        `Статус эмитента успешно обновлен на "${
          status === "approved" ? "Одобрен" : "Отклонен"
        }".`
      );
      setShowRejectionInput(false); // Скрываем поле причины
      setRejectionReason(""); // Очищаем причину
    } catch (err: unknown) {
      console.error("Failed to update emitter status:", err);
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
        setActionError(
          Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage
        );
      } else {
        setActionError(
          "Не удалось обновить статус. Пожалуйста, попробуйте позже."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusClasses = (status: "pending" | "approved" | "rejected") => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-128px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-128px)] text-red-600 text-lg">
        {error}
      </div>
    );
  }

  if (!emitter) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-128px)] text-gray-600 text-lg">
        Данные эмитента не найдены.
      </div>
    );
  }

  const logoSrc =
    emitter.logo_url && emitter.logo_url.startsWith("http")
      ? emitter.logo_url
      : "/placeholder-logo.png";

  return (
    <section className="flex flex-col items-center min-h-[calc(100vh-128px)] py-8 md:py-10">
      <div className="w-full max-w-4xl p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Детали Эмитента (Админ)
        </h1>

        {actionError && (
          <p className="text-sm text-red-600 text-center bg-red-100 p-3 rounded-md">
            {actionError}
          </p>
        )}
        {actionSuccess && (
          <p className="text-sm text-green-600 text-center bg-green-100 p-3 rounded-md">
            {actionSuccess}
          </p>
        )}

        {/* Основная информация об эмитенте */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-inner border border-gray-200">
          <div className="flex flex-col md:flex-row items-center md:items-start mb-6">
            <Image
              src={logoSrc}
              alt={`${emitter.name} logo`}
              width={128}
              height={128}
              className="rounded-full object-cover mb-4 md:mb-0 md:mr-6 border border-gray-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder-logo.png";
              }}
            />
            <div className="text-center md:text-left flex-grow">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {emitter.name}
              </h2>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Email:</span> {emitter.email}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">ИНН:</span>{" "}
                {emitter.inn || "Не указано"}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">ОГРН/ОГРНИП:</span>{" "}
                {emitter.ogrn_ogrnip || "Не указано"}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Юридический адрес:</span>{" "}
                {emitter.legal_address || "Не указано"}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Фактический адрес:</span>{" "}
                {emitter.actual_address || "Не указано"}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Телефон:</span>{" "}
                {emitter.phone || "Не указано"}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Веб-сайт:</span>{" "}
                {emitter.website ? (
                  <a
                    href={emitter.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {emitter.website}
                  </a>
                ) : (
                  "Не указано"
                )}
              </p>
              <p className="text-gray-700 mt-4">
                {emitter.description || "Описание отсутствует."}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Финансовые показатели
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
              <p>
                <strong>Тикер:</strong> {emitter.ticker || "Не указано"}
              </p>
              <p>
                <strong>Рынок:</strong> {emitter.market || "Не указано"}
              </p>
              <p>
                <strong>Отрасль:</strong> {emitter.industry || "Не указано"}
              </p>
              <p>
                <strong>Капитализация:</strong>{" "}
                {emitter.market_cap
                  ? `${emitter.market_cap.toLocaleString()} руб.`
                  : "Не указано"}
              </p>
              <p>
                <strong>Цена акции:</strong>{" "}
                {emitter.stock_price
                  ? `${emitter.stock_price.toLocaleString()} руб.`
                  : "Не указано"}
              </p>
              <p>
                <strong>Объем торгов:</strong>{" "}
                {emitter.trading_volume
                  ? `${emitter.trading_volume.toLocaleString()}`
                  : "Не указано"}
              </p>
              <p>
                <strong>Дивиденды:</strong>{" "}
                {emitter.has_dividends ? "Есть" : "Нет"}
              </p>
              <p>
                <strong>Рейтинг:</strong> {emitter.rating || "Не указано"}
              </p>
              <p>
                <strong>Статус компании (внутр.):</strong>{" "}
                {emitter.company_status || "Не указано"}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Статус модерации
            </h3>
            <p className="text-gray-700 mb-2">
              Текущий статус:{" "}
              <span
                className={`px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusClasses(
                  emitter.status
                )}`}
              >
                {emitter.status === "pending"
                  ? "На модерации"
                  : emitter.status === "approved"
                  ? "Одобрен"
                  : "Отклонен"}
              </span>
            </p>
            {emitter.rejection_reason && ( // ИСПРАВЛЕНИЕ: Имя поля изменено на rejection_reason
              <p className="text-gray-700 mb-2">
                Причина отклонения:{" "}
                <span className="italic">{emitter.rejection_reason}</span>
              </p>
            )}

            <div className="mt-4 flex space-x-4">
              {emitter.status !== "approved" && (
                <button
                  onClick={() => handleUpdateStatus("approved")}
                  disabled={submitting}
                  className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {submitting ? "Одобрение..." : "Одобрить"}
                </button>
              )}
              {emitter.status !== "rejected" && (
                <button
                  onClick={() => setShowRejectionInput(true)}
                  disabled={submitting}
                  className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  Отклонить
                </button>
              )}
            </div>

            {showRejectionInput && (
              <div className="mt-4">
                <label
                  htmlFor="rejectionReason"
                  className="block text-sm font-medium text-gray-700"
                >
                  Причина отклонения
                </label>
                <textarea
                  id="rejectionReason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Опишите причину отклонения..."
                />
                <button
                  onClick={() => handleUpdateStatus("rejected")}
                  disabled={submitting || !rejectionReason.trim()}
                  className="mt-2 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {submitting ? "Отклонение..." : "Подтвердить отклонение"}
                </button>
                <button
                  onClick={() => {
                    setShowRejectionInput(false);
                    setRejectionReason("");
                  }}
                  className="mt-2 w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Отмена
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Кнопка "Назад к админ-панели" */}
        <div className="mt-8 text-center">
          <Link
            href="/admin"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ← Назад к админ-панели
          </Link>
        </div>
      </div>
    </section>
  );
}
