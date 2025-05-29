// frontend/src/app/emitters/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Card,
  CardHeader,
  CardBody,
  Spinner,
  Divider,
  Image as HeroUIImage,
} from "@heroui/react"; // <-- ИСПРАВЛЕНИЕ: Убраны Textarea, Chip, Link. Image переименован
// import Image from 'next/image'; // <-- ИСПРАВЛЕНИЕ: Убран импорт next/image
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import axios from "axios";
import { EmitterProfileDto } from "@/types/emitter";
import { TrackInvestorInterestPayload } from "@/types/investor";

interface EmitterDetailsPageProps {
  params: { id: string };
}

export default function PublicEmitterDetailsPage({
  params,
}: EmitterDetailsPageProps) {
  const { id } = params;
  const router = useRouter();
  const [emitter, setEmitter] = useState<EmitterProfileDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interestFormData, setInterestFormData] =
    useState<TrackInvestorInterestPayload>({
      name: "",
      email: "",
      phone: "",
    });
  const [interestLoading, setInterestLoading] = useState(false);
  const [interestSuccess, setInterestSuccess] = useState<string | null>(null);
  const [interestError, setInterestError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmitterDetails = async () => {
      try {
        const response = await api.get<{ emitter: EmitterProfileDto }>(
          `/emitters/${id}`
        );
        setEmitter(response.data.emitter);
      } catch (err: unknown) {
        console.error("Failed to fetch public emitter details:", err);
        if (
          axios.isAxiosError(err) &&
          err.response &&
          err.response.status === 404
        ) {
          setError("Эмитент не найден или не утвержден.");
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
  }, [id]);

  const handleInterestChange = (
    value: string,
    field: keyof TrackInvestorInterestPayload
  ) => {
    setInterestFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTrackInterest = async (e: React.FormEvent) => {
    e.preventDefault();
    setInterestLoading(true);
    setInterestError(null);
    setInterestSuccess(null);

    try {
      const payload: TrackInvestorInterestPayload = {
        ...interestFormData,
        phone: interestFormData.phone || undefined,
      };
      const response = await api.post<{ message: string }>(
        `/emitters/${id}/track-interest`,
        payload
      );
      setInterestSuccess(response.data.message);
      setInterestFormData({ name: "", email: "", phone: "" });
    } catch (err: unknown) {
      console.error("Failed to track investor interest:", err);
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
          "Не удалось зафиксировать интерес. Пожалуйста, попробуйте позже."
        );
      }
    } finally {
      setInterestLoading(false);
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
        <Button onClick={() => router.push("/screener")} color="warning">
          Назад к скринеру
        </Button>
      </section>
    );
  }

  if (!emitter) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 h-full">
        <p className="text-warning text-lg">Эмитент не найден.</p>
        <Button onClick={() => router.push("/screener")} color="warning">
          Назад к скринеру
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
          {emitter.financialData?.ticker && (
            <p className="text-lg text-default-500">
              Тикер: {emitter.financialData.ticker}
            </p>
          )}
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Название компании" isReadOnly value={emitter.name} />
            <Input
              label="Описание"
              isReadOnly
              value={emitter.description || "Не указано"}
            />
            <Input
              label="Рынок"
              isReadOnly
              value={emitter.financialData?.market || "Не указан"}
            />
            <Input
              label="Отрасль"
              isReadOnly
              value={emitter.financialData?.industry || "Не указан"}
            />
            <Input
              label="Рыночная капитализация"
              isReadOnly
              value={
                emitter.financialData?.market_cap?.toLocaleString() ||
                "Не указана"
              }
            />
            <Input
              label="Цена акции"
              isReadOnly
              value={emitter.financialData?.stock_price || "Не указана"}
            />
            <Input
              label="Объем торгов"
              isReadOnly
              value={
                emitter.financialData?.trading_volume?.toLocaleString() ||
                "Не указан"
              }
            />
            <Input
              label="Дивиденды"
              isReadOnly
              value={emitter.financialData?.has_dividends ? "Да" : "Нет"}
            />
            <Input
              label="Рейтинг"
              isReadOnly
              value={emitter.financialData?.rating || "Не указан"}
            />
            <Input
              label="Публичный статус"
              isReadOnly
              value={emitter.financialData?.company_status || "Не указан"}
            />
            {emitter.logo_url && (
              <div className="col-span-1 md:col-span-2 flex justify-center">
                <HeroUIImage
                  src={emitter.logo_url}
                  alt="Логотип компании"
                  width={100}
                  height={100}
                  radius="sm"
                />{" "}
                {/* <-- ИСПРАВЛЕНИЕ: HeroUI Image */}
              </div>
            )}
          </div>

          <Divider className="my-8" />

          {/* Форма для сбора интереса инвестора */}
          <h2 className="text-xl font-bold mb-4">Заинтересованы в эмитенте?</h2>
          <p className="text-default-500 mb-4">
            Оставьте свои данные, чтобы получить больше информации или перейти
            на площадку размещения.
          </p>
          <form
            onSubmit={handleTrackInterest}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Input
              isRequired
              label="Ваше имя"
              placeholder="Введите ваше имя"
              value={interestFormData.name}
              onValueChange={(val) => handleInterestChange(val, "name")}
            />
            <Input
              isRequired
              label="Ваш Email"
              placeholder="Введите ваш email"
              type="email"
              value={interestFormData.email}
              onValueChange={(val) => handleInterestChange(val, "email")}
            />
            <Input
              label="Ваш телефон"
              placeholder="Введите ваш телефон (необязательно)"
              type="tel"
              value={interestFormData.phone}
              onValueChange={(val) => handleInterestChange(val, "phone")}
            />
            {interestError && (
              <p className="text-danger text-sm col-span-full">
                {interestError}
              </p>
            )}
            {interestSuccess && (
              <p className="text-success text-sm col-span-full">
                {interestSuccess}
              </p>
            )}
            <Button
              type="submit"
              color="primary"
              isLoading={interestLoading}
              className="col-span-full"
            >
              Получить информацию и перейти на площадку
            </Button>
          </form>
        </CardBody>
      </Card>
    </section>
  );
}
