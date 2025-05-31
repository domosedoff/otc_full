// frontend/src/app/screener/page.tsx
"use client";

import React, { useState, useEffect } from "react"; // Убрали useCallback из импортов
import api from "@/lib/api";
import { EmitterProfile } from "@/types/emitter";
import { EmitterFilterParams, EmittersApiResponse } from "@/types/screener";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

// Временные данные для выпадающих списков (в реальном проекте могут приходить с бэкенда)
const markets = ["OTCQX", "OTCQB", "Pink"];
const industries = [
  "Технологии",
  "Финансы",
  "Здравоохранение",
  "Энергетика",
  "Промышленность",
];
const companyStatuses = ["Активна", "Неактивна"];

export default function ScreenerPage() {
  const [emitters, setEmitters] = useState<EmitterProfile[]>([]);
  const [filters, setFilters] = useState<EmitterFilterParams>({
    page: 1,
    limit: 10,
  });
  const [totalEmitters, setTotalEmitters] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(true);

  // --- ИСПРАВЛЕНИЕ ЗДЕСЬ: Переместили fetchEmitters внутрь useEffect ---
  useEffect(() => {
    const fetchEmitters = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            queryParams.append(key, String(value));
          }
        });

        const response = await api.get<EmittersApiResponse>(
          `/emitters?${queryParams.toString()}`
        );
        setEmitters(response.data.data);
        setTotalEmitters(response.data.total);
      } catch (err: unknown) {
        console.error("Failed to fetch emitters:", err);
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
            "Не удалось загрузить список эмитентов. Пожалуйста, попробуйте позже."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmitters();
  }, [filters]); // useEffect теперь зависит только от объекта filters
  // --- КОНЕЦ ИСПРАВЛЕНИЯ ---

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name } = e.target;
    let newValue: string | number | boolean | undefined;

    if (e.target instanceof HTMLInputElement) {
      if (e.target.type === "checkbox") {
        newValue = e.target.checked;
      } else if (e.target.type === "number") {
        newValue =
          e.target.value === "" ? undefined : parseFloat(e.target.value);
      } else {
        newValue = e.target.value === "" ? undefined : e.target.value;
      }
    } else {
      newValue = e.target.value === "" ? undefined : e.target.value;
    }

    setFilters((prev) => ({
      ...prev,
      [name]: newValue,
      page: 1,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      limit: parseInt(e.target.value),
      page: 1,
    }));
  };

  const handleResetFilters = () => {
    setFilters({ page: 1, limit: 10 });
    setShowFilters(true);
  };

  const toggleFiltersVisibility = () => {
    setShowFilters((prev) => !prev);
  };

  const totalPages = Math.ceil(totalEmitters / (filters.limit || 10));

  return (
    <section className="flex flex-col items-center min-h-[calc(100vh-128px)] py-8 md:py-10">
      <div className="w-full max-w-6xl p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Скринер внебиржевых активов
        </h1>

        {error && (
          <p className="text-sm text-red-600 text-center bg-red-100 p-3 rounded-md">
            {error}
          </p>
        )}

        {/* Секция фильтров */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-inner border border-gray-200 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Фильтры</h2>
            <button
              onClick={toggleFiltersVisibility}
              className="py-1 px-3 text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none"
            >
              {showFilters ? "Скрыть фильтры" : "Показать фильтры"}
            </button>
          </div>
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              showFilters ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Текстовые поля */}
              <div>
                <label
                  htmlFor="ticker"
                  className="block text-sm font-medium text-gray-700"
                >
                  Тикер
                </label>
                <input
                  type="text"
                  id="ticker"
                  name="ticker"
                  value={filters.ticker || ""}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Название компании
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={filters.name || ""}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* Выпадающие списки */}
              <div>
                <label
                  htmlFor="market"
                  className="block text-sm font-medium text-gray-700"
                >
                  Рынок
                </label>
                <select
                  id="market"
                  name="market"
                  value={filters.market || ""}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Все рынки</option>
                  {markets.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="industry"
                  className="block text-sm font-medium text-gray-700"
                >
                  Отрасль
                </label>
                <select
                  id="industry"
                  name="industry"
                  value={filters.industry || ""}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Все отрасли</option>
                  {industries.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>

              {/* Поля для диапазонов (мин/макс) */}
              <div>
                <label
                  htmlFor="min_market_cap"
                  className="block text-sm font-medium text-gray-700"
                >
                  Капитализация (мин)
                </label>
                <input
                  type="number"
                  id="min_market_cap"
                  name="min_market_cap"
                  value={filters.min_market_cap ?? ""}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="max_market_cap"
                  className="block text-sm font-medium text-gray-700"
                >
                  Капитализация (макс)
                </label>
                <input
                  type="number"
                  id="max_market_cap"
                  name="max_market_cap"
                  value={filters.max_market_cap ?? ""}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="min_stock_price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Цена акции (мин)
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="min_stock_price"
                  name="min_stock_price"
                  value={filters.min_stock_price ?? ""}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="max_stock_price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Цена акции (макс)
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="max_stock_price"
                  name="max_stock_price"
                  value={filters.max_stock_price ?? ""}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="min_trading_volume"
                  className="block text-sm font-medium text-gray-700"
                >
                  Объем торгов (мин)
                </label>
                <input
                  type="number"
                  id="min_trading_volume"
                  name="min_trading_volume"
                  value={filters.min_trading_volume ?? ""}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="max_trading_volume"
                  className="block text-sm font-medium text-gray-700"
                >
                  Объем торгов (макс)
                </label>
                <input
                  type="number"
                  id="max_trading_volume"
                  name="max_trading_volume"
                  value={filters.max_trading_volume ?? ""}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="min_rating"
                  className="block text-sm font-medium text-gray-700"
                >
                  Рейтинг (мин)
                </label>
                <input
                  type="number"
                  step="0.1"
                  id="min_rating"
                  name="min_rating"
                  value={filters.min_rating ?? ""}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="max_rating"
                  className="block text-sm font-medium text-gray-700"
                >
                  Рейтинг (макс)
                </label>
                <input
                  type="number"
                  step="0.1"
                  id="max_rating"
                  name="max_rating"
                  value={filters.max_rating ?? ""}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* Чекбоксы и другие выпадающие списки */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="has_dividends"
                  name="has_dividends"
                  checked={filters.has_dividends || false}
                  onChange={handleFilterChange}
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
                  htmlFor="company_status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Статус компании
                </label>
                <select
                  id="company_status"
                  name="company_status"
                  value={filters.company_status || ""}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Все статусы</option>
                  {companyStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleResetFilters}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Сбросить фильтры
              </button>
            </div>
          </div>
        </div>

        {/* Список эмитентов */}
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : emitters.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            По вашему запросу ничего не найдено. Попробуйте изменить параметры
            фильтрации.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emitters.map((emitter, index) => (
              <div
                key={emitter.id || `emitter-${index}`}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
              >
                <div className="flex items-center mb-4">
                  {emitter.logo_url && (
                    <Image
                      src={emitter.logo_url}
                      alt={`${emitter.name} logo`}
                      width={64}
                      height={64}
                      className="rounded-full object-cover mr-4"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {emitter.name}
                    </h3>
                    <p className="text-sm text-gray-600">{emitter.ticker}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Отрасль:</span>{" "}
                  {emitter.industry || "Не указано"}
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Рынок:</span>{" "}
                  {emitter.market || "Не указано"}
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Капитализация:</span>{" "}
                  {emitter.market_cap
                    ? `${emitter.market_cap.toLocaleString()} руб.`
                    : "Не указано"}
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Цена акции:</span>{" "}
                  {emitter.stock_price
                    ? `${emitter.stock_price.toLocaleString()} руб.`
                    : "Не указано"}
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Дивиденды:</span>{" "}
                  {emitter.has_dividends ? "Есть" : "Нет"}
                </p>
                <Link
                  href={`/emitters/${emitter.id}`}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Подробнее
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Пагинация */}
        {totalEmitters > 0 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={() => handlePageChange(filters.page! - 1)}
              disabled={filters.page === 1 || loading}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Предыдущая
            </button>
            <span className="text-gray-700">
              Страница {filters.page} из {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(filters.page! + 1)}
              disabled={filters.page === totalPages || loading}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Следующая
            </button>
            <select
              value={filters.limit}
              onChange={handleLimitChange}
              className="ml-4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value={5}>5 на стр.</option>
              <option value={10}>10 на стр.</option>
              <option value={20}>20 на стр.</option>
            </select>
          </div>
        )}
      </div>
    </section>
  );
}
