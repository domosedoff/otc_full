// frontend/src/app/admin/emitters/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Card,
  CardHeader,
  CardBody,
  Textarea,
  Spinner,
  Chip,
  Divider,
  Tooltip,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import api, { setAuthToken } from "@/lib/api";
import axios from "axios";
import { EmitterProfileDto } from "@/types/emitter";

interface EmitterDetailsPageProps {
  params: { id: string };
}

// ИСПРАВЛЕНИЕ: Убираем 'async' из функции компонента
export default function EmitterDetailsPage({
  params,
}: EmitterDetailsPageProps) {
  const { id } = params; // <-- ИСПРАВЛЕНИЕ: Доступ к id теперь корректен
  const router = useRouter();
  const [emitter, setEmitter] = useState<EmitterProfileDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmitterDetails = async () => {
      const token = sessionStorage.getItem("accessToken");
      const userRole = sessionStorage.getItem("userRole");

      if (!token || userRole !== "admin") {
        router.push("/auth/admin/login");
        return;
      }
      setAuthToken(token);

      try {
        const response = await api.get<EmitterProfileDto>(
          `/admin/emitters/${id}`
        );
        setEmitter(response.data);
      } catch (err: unknown) {
        console.error("Failed to fetch emitter details for admin:", err);
        if (
          axios.isAxiosError(err) &&
          err.response &&
          err.response.status === 401
        ) {
          router.push("/auth/admin/login");
        } else {
          setError(
            "Не удалось загрузить детали эмитента. Пожалуйста, попробуйте позже."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEmitterDetails();
    }
  }, [id, router]);

  const handleStatusChange = async (
    newStatus: "approved" | "rejected",
    reason?: string
  ) => {
    setError(null);
    try {
      const response = await api.patch<EmitterProfileDto>(
        `/admin/emitters/${id}/status`,
        { status: newStatus, reason }
      );
      setEmitter(response.data);
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

  if (loading) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 h-full">
        <Spinner label="Загрузка деталей эмитента..." color="primary" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 h-full">
        <p className="text-danger text-lg">{error}</p>
        <Button onClick={() => router.push("/admin")} color="warning">
          Назад к списку
        </Button>
      </section>
    );
  }

  if (!emitter) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 h-full">
        <p className="text-warning text-lg">Эмитент не найден.</p>
        <Button onClick={() => router.push("/admin")} color="warning">
          Назад к списку
        </Button>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <Card className="max-w-4xl w-full">
        <CardHeader className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold">
            Детали Эмитента: {emitter.name}
          </h1>
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
            Статус: {emitter.status === "pending" && "На модерации"}
            {emitter.status === "approved" && "Утвержден"}
            {emitter.status === "rejected" && "Отклонен"}
          </Chip>
          {emitter.rejection_reason && emitter.status === "rejected" && (
            <p className="text-danger text-sm mt-2">
              Причина отклонения: {emitter.rejection_reason}
            </p>
          )}
          {error && <p className="text-danger text-sm mt-2">{error}</p>}
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Email" isReadOnly value={emitter.email} />
            <Input label="ИНН" isReadOnly value={emitter.inn || "Не указан"} />
            <Input
              label="ОГРН/ОГРНИП"
              isReadOnly
              value={emitter.ogrn_ogrnip || "Не указан"}
            />
            <Input
              label="Юридический адрес"
              isReadOnly
              value={emitter.legal_address || "Не указан"}
            />
            <Input
              label="Фактический адрес"
              isReadOnly
              value={emitter.actual_address || "Не указан"}
            />
            <Input
              label="Телефон"
              isReadOnly
              value={emitter.phone || "Не указан"}
            />
            <Input
              label="Веб-сайт"
              isReadOnly
              value={emitter.website || "Не указан"}
            />
            <Input
              label="URL логотипа"
              isReadOnly
              value={emitter.logo_url || "Не указан"}
            />
            <Textarea
              label="Описание компании"
              isReadOnly
              value={emitter.description || "Не указано"}
              className="col-span-1 md:col-span-2"
            />
          </div>

          <Divider className="my-8" />

          {/* Кнопки действий */}
          <div className="flex justify-center gap-4">
            {emitter.status !== "approved" && (
              <Tooltip content="Утвердить">
                <Button
                  onClick={() => handleStatusChange("approved")}
                  color="success"
                >
                  Утвердить
                </Button>
              </Tooltip>
            )}
            {emitter.status !== "rejected" && (
              <Tooltip content="Отклонить">
                <Button
                  onClick={() => {
                    const reason = prompt("Введите причину отклонения:");
                    if (reason !== null) {
                      handleStatusChange("rejected", reason);
                    }
                  }}
                  color="danger"
                >
                  Отклонить
                </Button>
              </Tooltip>
            )}
            <Button onClick={() => router.push("/admin")} variant="flat">
              Назад к списку
            </Button>
          </div>
        </CardBody>
      </Card>
    </section>
  );
}
