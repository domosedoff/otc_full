// frontend/src/app/admin/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react"; // Добавлен useRef
import { useRouter } from "next/navigation";
import Link from "next/link";
import api, { setAuthToken } from "@/lib/api";
import axios from "axios";

// Интерфейс для элемента списка эмитентов в админке
interface AdminEmitterListItem {
  emitent_id: string;
  name: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
  admin_comment?: string; // Комментарий администратора
}

// Интерфейс для ответа API со списком эмитентов для админки
interface AdminEmittersApiResponse {
  data: AdminEmitterListItem[];
  total: number;
  page: number;
  limit: number;
}

// Интерфейс для фильтров админки
interface AdminFilterParams {
  page?: number;
  limit?: number;
  status?: "pending" | "approved" | "rejected" | ""; // Добавляем пустую строку для "Все статусы"
  search?: string; // Для поиска по имени или email
}

export default function AdminPage() {
  const [emitters, setEmitters] = useState<AdminEmitterListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AdminFilterParams>({
    page: 1,
    limit: 10,
    status: "", // По умолчанию "Все статусы"
    search: "",
  });
  const [totalEmitters, setTotalEmitters] = useState(0);
  const router = useRouter();

  // НОВОЕ: Флаг для предотвращения множественных перенаправлений
  const isRedirecting = useRef(false);

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    const userRole = sessionStorage.getItem("userRole");

    // Если пользователь не админ или не авторизован
    if (!accessToken || userRole !== "admin") {
      // Проверяем, не происходит ли уже перенаправление
      if (!isRedirecting.current) {
        isRedirecting.current = true; // Устанавливаем флаг
        sessionStorage.removeItem("accessToken"); // Очищаем на всякий случай
        sessionStorage.removeItem("userRole");
        router.replace("/auth/admin/login"); // Используем replace, чтобы не засорять историю
      }
      setLoading(false); // Останавливаем загрузку, так как перенаправляем
      return; // Прерываем выполнение useEffect
    }

    // Если авторизован, устанавливаем токен для API
    setAuthToken(accessToken);

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            queryParams.append(key, String(value));
          }
        });

        const response = await api.get<AdminEmittersApiResponse>(
          `/admin/emitters?${queryParams.toString()}`
        );
        setEmitters(response.data.data);
        setTotalEmitters(response.data.total);
      } catch (err: unknown) {
        console.error("Failed to fetch admin emitters:", err);
        if (
          axios.isAxiosError(err) &&
          err.response &&
          err.response.status === 401
        ) {
          // Если получаем 401, это означает, что токен недействителен.
          // Очищаем токен и инициируем перенаправление через основной useEffect.
          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("userRole");
          // Не вызываем router.push здесь напрямую, чтобы избежать цикла.
          // Изменение sessionStorage инициирует повторный запуск useEffect,
          // который уже обработает перенаправление.
        } else {
          setError(
            "Не удалось загрузить список эмитентов. Пожалуйста, попробуйте позже."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    // Вызываем fetchData только если не происходит перенаправление
    if (!isRedirecting.current) {
      fetchData();
    }
  }, [filters, router]); // Зависимости: filters для данных, router для перенаправления

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1, // Сброс на первую страницу при изменении фильтра
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleResetFilters = () => {
    setFilters({ page: 1, limit: 10, status: "", search: "" });
  };

  const totalPages = Math.ceil(totalEmitters / (filters.limit || 10));

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

  return (
    <section className="flex flex-col items-center min-h-[calc(100vh-128px)] py-8 md:py-10">
      <div className="w-full max-w-6xl p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Админ-панель: Управление Эмитентами
        </h1>

        {/* Секция фильтров и поиска */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-inner border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Фильтры</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700"
              >
                Поиск по имени/email
              </label>
              <input
                type="text"
                id="search"
                name="search"
                value={filters.search || ""}
                onChange={handleFilterChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Название или Email"
              />
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Статус
              </label>
              <select
                id="status"
                name="status"
                value={filters.status || ""}
                onChange={handleFilterChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Все статусы</option>
                <option value="pending">На модерации</option>
                <option value="approved">Одобрен</option>
                <option value="rejected">Отклонен</option>
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

        {/* Таблица эмитентов */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Название компании
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Статус
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Дата регистрации
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Действия</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {emitters.map((emitter) => (
                <tr key={emitter.emitent_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {emitter.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {emitter.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(
                        emitter.status
                      )}`}
                    >
                      {emitter.status === "pending"
                        ? "На модерации"
                        : emitter.status === "approved"
                        ? "Одобрен"
                        : "Отклонен"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(emitter.created_at).toLocaleDateString("ru-RU")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/emitters/${emitter.emitent_id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Просмотр
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
              onChange={handleFilterChange}
              name="limit"
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
