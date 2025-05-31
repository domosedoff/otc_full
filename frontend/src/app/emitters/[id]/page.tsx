// frontend/src/app/emitters/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
// import { useRouter } from 'next/navigation'; // УДАЛЕНО: useRouter больше не нужен
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";
import { EmitterProfile } from "@/types/emitter";
import { TrackInterestPayload, TrackInterestResponse } from "@/types/investor";
import axios from "axios";

interface EmitterDetailsPageProps {
  params: { id: string };
}

export default function PublicEmitterDetailsPage({
  params,
}: EmitterDetailsPageProps) {
  const { id } = params;
  // const router = useRouter(); // УДАЛЕНО: useRouter больше не нужен

  const [emitter, setEmitter] = useState<EmitterProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Состояния для формы интереса инвестора
  const [investorFormData, setInvestorFormData] =
    useState<TrackInterestPayload>({
      name: "",
      email: "",
      phone: "",
    });
  const [investorFormSubmitting, setInvestorFormSubmitting] = useState(false);
  const [investorFormSuccess, setInvestorFormSuccess] = useState<string | null>(
    null
  );
  const [investorFormError, setInvestorFormError] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchEmitterDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<EmitterProfile>(`/emitters/${id}`);
        setEmitter(response.data);
      } catch (err: unknown) {
        console.error("Failed to fetch emitter details:", err);
        if (
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

    if (id) {
      fetchEmitterDetails();
    }
  }, [id]);

  const handleInvestorFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInvestorFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTrackInterest = async (e: React.FormEvent) => {
    e.preventDefault();
    setInvestorFormError(null);
    setInvestorFormSuccess(null);
    setInvestorFormSubmitting(true);

    try {
      const payload: TrackInterestPayload = {
        ...investorFormData,
        origin_url: window.location.href,
      };

      const response = await api.post<TrackInterestResponse>(
        `/emitters/${id}/track-interest`,
        payload
      );
      setInvestorFormSuccess(
        response.data.message ||
          "Ваш интерес зафиксирован! Эмитент свяжется с вами."
      );
      setInvestorFormData({ name: "", email: "", phone: "" });
    } catch (err: unknown) {
      console.error("Failed to track interest:", err);
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
        setInvestorFormError(
          Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage
        );
      } else {
        setInvestorFormError(
          "Произошла ошибка при фиксации интереса. Пожалуйста, попробуйте позже."
        );
      }
    } finally {
      setInvestorFormSubmitting(false);
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
          {emitter.name}
        </h1>

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
                {emitter.name} ({emitter.ticker || "N/A"})
              </h2>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Отрасль:</span>{" "}
                {emitter.industry || "Не указано"}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Рынок:</span>{" "}
                {emitter.market || "Не указано"}
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
                <strong>Статус компании:</strong>{" "}
                {emitter.company_status || "Не указано"}
              </p>
            </div>
          </div>
        </div>

        {/* Форма для сбора данных инвестора */}
        <div className="bg-blue-50 p-6 rounded-lg shadow-inner border border-blue-200 mt-8">
          <h2 className="text-2xl font-bold text-blue-800 text-center mb-6">
            Заинтересованы в этом эмитенте?
          </h2>
          <p className="text-gray-700 text-center mb-6">
            Оставьте свои контактные данные, и эмитент свяжется с вами для
            предоставления дополнительной информации.
          </p>
          <form
            onSubmit={handleTrackInterest}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"
          >
            <div>
              <label
                htmlFor="investorName"
                className="block text-sm font-medium text-gray-700"
              >
                Ваше имя
              </label>
              <input
                type="text"
                id="investorName"
                name="name"
                required
                value={investorFormData.name}
                onChange={handleInvestorFormChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="investorEmail"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="investorEmail"
                name="email"
                required
                value={investorFormData.email}
                onChange={handleInvestorFormChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="investorPhone"
                className="block text-sm font-medium text-gray-700"
              >
                Телефон
              </label>
              <input
                type="tel"
                id="investorPhone"
                name="phone"
                required
                value={investorFormData.phone}
                onChange={handleInvestorFormChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {investorFormError && (
              <p className="md:col-span-2 text-sm text-red-600 text-center bg-red-100 p-3 rounded-md">
                {investorFormError}
              </p>
            )}
            {investorFormSuccess && (
              <p className="md:col-span-2 text-sm text-green-600 text-center bg-green-100 p-3 rounded-md">
                {investorFormSuccess}
              </p>
            )}

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={investorFormSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {investorFormSubmitting ? "Отправка..." : "Отправить запрос"}
              </button>
            </div>
          </form>
        </div>

        {/* Кнопка "Назад к скринеру" */}
        <div className="mt-8 text-center">
          <Link
            href="/screener"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ← Назад к скринеру
          </Link>
        </div>
      </div>
    </section>
  );
}
