// frontend/src/app/admin/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Spinner,
  Tooltip,
  Input,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import api, { setAuthToken } from "@/lib/api";
import axios from "axios";
// import { AdminAuthResponse } from '@/types/auth'; // <-- УБРАН неиспользуемый импорт
// import { EmitterProfileDto } from '@/types/emitter'; // <-- УБРАН неиспользуемый импорт
import { GetEmittersFilterDto } from "@/types/admin";
import { Pagination } from "@heroui/react";

interface AdminEmitterListItem {
  emitent_id: string;
  name: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [emitters, setEmitters] = useState<AdminEmitterListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [filterStatus, setFilterStatus] = useState<string>("");

  // Оборачиваем fetchEmitters в useCallback, чтобы он не менялся при каждом рендере
  // и не вызывал бесконечный цикл useEffect
  const fetchEmitters = React.useCallback(async () => {
    // <-- ИСПРАВЛЕНИЕ: Обернуто в useCallback
    const token = sessionStorage.getItem("accessToken");
    const userRole = sessionStorage.getItem("userRole");

    if (!token || userRole !== "admin") {
      router.push("/auth/admin/login");
      return;
    }
    setAuthToken(token);

    try {
      const params: GetEmittersFilterDto = { page, limit };
      if (filterStatus) {
        params.status = filterStatus as "pending" | "approved" | "rejected";
      }

      const response = await api.get<{
        data: AdminEmitterListItem[];
        total: number;
        page: number;
        limit: number;
      }>("/admin/emitters", { params });
      setEmitters(response.data.data);
      setTotal(response.data.total);
      setPage(response.data.page);
      setLimit(response.data.limit);
    } catch (err: unknown) {
      console.error("Failed to fetch emitters for admin:", err);
      if (
        axios.isAxiosError(err) &&
        err.response &&
        err.response.status === 401
      ) {
        router.push("/auth/admin/login");
      } else {
        setError(
          "Не удалось загрузить список эмитентов. Пожалуйста, попробуйте позже."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [page, limit, filterStatus, router]); // <-- ИСПРАВЛЕНИЕ: Добавлены зависимости для useCallback

  useEffect(() => {
    fetchEmitters();
  }, [fetchEmitters]); // <-- ИСПРАВЛЕНИЕ: Зависимость теперь fetchEmitters

  const handleStatusChange = async (
    id: string,
    newStatus: "approved" | "rejected",
    reason?: string
  ) => {
    setError(null);
    try {
      await api.patch(`/admin/emitters/${id}/status`, {
        status: newStatus,
        reason,
      });
      fetchEmitters();
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
        setError(
          Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage
        );
      } else {
        setError(
          "Не удалось обновить статус эмитента. Пожалуйста, попробуйте позже."
        );
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("userRole");
    setAuthToken(null);
    router.push("/auth/admin/login");
  };

  if (loading) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 h-full">
        <Spinner label="Загрузка списка эмитентов..." color="primary" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 h-full">
        <p className="text-danger text-lg">{error}</p>
        <Button onClick={handleLogout} color="warning">
          Выйти
        </Button>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="flex justify-between w-full max-w-4xl mb-4">
        <h1 className="text-3xl font-bold">Админ-панель</h1>
        <Button onClick={handleLogout} color="danger">
          Выйти
        </Button>
      </div>

      {error && <p className="text-danger text-sm mb-4">{error}</p>}

      {/* Фильтры */}
      <div className="flex gap-4 mb-4">
        <Input
          label="Фильтр по статусу"
          placeholder="pending, approved, rejected"
          value={filterStatus}
          onValueChange={setFilterStatus}
        />
        <Button onClick={() => setFilterStatus("")} variant="flat">
          Сбросить фильтр
        </Button>
      </div>

      <Table
        aria-label="Таблица эмитентов"
        selectionMode="single"
        className="max-w-4xl"
      >
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Название</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Статус</TableColumn>
          <TableColumn>Действия</TableColumn>
        </TableHeader>
        <TableBody emptyContent="Эмитенты не найдены.">
          {emitters.map((emitter) => (
            <TableRow key={emitter.emitent_id}>
              <TableCell>{emitter.emitent_id.substring(0, 8)}...</TableCell>
              <TableCell>{emitter.name}</TableCell>
              <TableCell>{emitter.email}</TableCell>
              <TableCell>
                <Chip
                  color={
                    emitter.status === "approved"
                      ? "success"
                      : emitter.status === "pending"
                      ? "warning"
                      : "danger"
                  }
                  variant="flat"
                >
                  {emitter.status}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="relative flex items-center gap-2">
                  {emitter.status !== "approved" && (
                    <Tooltip content="Утвердить">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onClick={() =>
                          handleStatusChange(emitter.emitent_id, "approved")
                        }
                      >
                        {/* Иконка утверждения */}✅
                      </Button>
                    </Tooltip>
                  )}
                  {emitter.status !== "rejected" && (
                    <Tooltip content="Отклонить">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onClick={() => {
                          const reason = prompt("Введите причину отклонения:");
                          if (reason !== null) {
                            handleStatusChange(
                              emitter.emitent_id,
                              "rejected",
                              reason
                            );
                          }
                        }}
                      >
                        {/* Иконка отклонения */}❌
                      </Button>
                    </Tooltip>
                  )}
                  <Tooltip content="Посмотреть детали">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onClick={() =>
                        router.push(`/admin/emitters/${emitter.emitent_id}`)
                      }
                    >
                      {/* Иконка деталей */}
                      👁️
                    </Button>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex w-full justify-center mt-4">
        <Pagination
          total={Math.ceil(total / limit)}
          initialPage={page}
          onChange={setPage}
        />
      </div>
    </section>
  );
}
