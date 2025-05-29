// frontend/src/app/profile/emitter/page.tsx
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
  Link,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import api, { setAuthToken } from "@/lib/api";
import {
  EmitterProfileDto,
  UpdateEmitterProfilePayload,
} from "@/types/emitter";
import axios from "axios";

export default function EmitterProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<EmitterProfileDto | null>(null);
  const [formData, setFormData] = useState<UpdateEmitterProfilePayload>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        router.push("/auth/login");
        return;
      }
      setAuthToken(token);

      try {
        const response = await api.get<EmitterProfileDto>("/profile/emitter");
        setProfile(response.data);
        // Заполняем форму текущими данными профиля
        setFormData({
          name: response.data.name,
          inn: response.data.inn || undefined,
          ogrn_ogrnip: response.data.ogrn_ogrnip || undefined,
          legal_address: response.data.legal_address || undefined,
          actual_address: response.data.actual_address || undefined,
          phone: response.data.phone || undefined,
          website: response.data.website || undefined,
          description: response.data.description || undefined,
          logo_url: response.data.logo_url || undefined,
          // Финансовые данные теперь читаются из profile.financialData
          ticker: response.data.financialData?.ticker || undefined,
          market: response.data.financialData?.market || undefined,
          industry: response.data.financialData?.industry || undefined,
          market_cap: response.data.financialData?.market_cap || undefined,
          stock_price: response.data.financialData?.stock_price || undefined,
          trading_volume:
            response.data.financialData?.trading_volume || undefined,
          has_dividends: response.data.financialData?.has_dividends,
          rating: response.data.financialData?.rating || undefined,
          company_status:
            response.data.financialData?.company_status || undefined,
        });
      } catch (err: unknown) {
        console.error("Failed to fetch profile:", err);
        if (
          axios.isAxiosError(err) &&
          err.response &&
          err.response.status === 401
        ) {
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
    value: string | number | boolean,
    field: keyof UpdateEmitterProfilePayload
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const payload: UpdateEmitterProfilePayload = {
        ...formData,
        inn: formData.inn || undefined,
        ogrn_ogrnip: formData.ogrn_ogrnip || undefined,
        legal_address: formData.legal_address || undefined,
        actual_address: formData.actual_address || undefined,
        phone: formData.phone || undefined,
        website: formData.website || undefined,
        description: formData.description || undefined,
        logo_url: formData.logo_url || undefined,
        ticker: formData.ticker || undefined,
        market: formData.market || undefined,
        industry: formData.industry || undefined,
        market_cap: formData.market_cap || undefined,
        stock_price: formData.stock_price || undefined,
        trading_volume: formData.trading_volume || undefined,
        has_dividends: formData.has_dividends,
        rating: formData.rating || undefined,
        company_status: formData.company_status || undefined,
      };
      const response = await api.put<EmitterProfileDto>(
        "/profile/emitter",
        payload
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
      setSaving(false);
    }
  };

  const handleSubmitForReview = async () => {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await api.post<EmitterProfileDto>(
        "/profile/emitter/submit-for-review"
      );
      setProfile(response.data);
      setSuccessMessage("Профиль отправлен на модерацию!");
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
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 h-full">
        <Spinner label="Загрузка профиля..." color="primary" />
      </section>
    );
  }

  if (error && !profile) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 h-full">
        <p className="text-danger text-lg">{error}</p>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 h-full">
        <p className="text-warning text-lg">Профиль не найден.</p>
      </section>
    );
  }

  const isProfileEditable =
    profile.status === "pending" || profile.status === "rejected";

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <Card className="max-w-4xl w-full">
        <CardHeader className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold">Профиль Эмитента</h1>
          <Chip
            color={
              profile.status === "approved"
                ? "success"
                : profile.status === "pending"
                ? "warning"
                : "danger"
            }
            variant="flat"
          >
            Статус: {profile.status === "pending" && "На модерации"}
            {profile.status === "approved" && "Утвержден"}
            {profile.status === "rejected" && "Отклонен"}
          </Chip>
          {profile.rejection_reason && profile.status === "rejected" && (
            <p className="text-danger text-sm mt-2">
              Причина отклонения: {profile.rejection_reason}
            </p>
          )}
          {successMessage && (
            <p className="text-success text-sm mt-2">{successMessage}</p>
          )}
          {error && <p className="text-danger text-sm mt-2">{error}</p>}
        </CardHeader>
        <CardBody>
          <form
            onSubmit={handleUpdateProfile}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Input
              label="Название компании"
              placeholder="Введите название компании"
              value={formData.name}
              onValueChange={(val) => handleChange(val, "name")}
              isReadOnly={!isProfileEditable}
              isRequired
            />
            <Input
              label="Email"
              placeholder="Email"
              value={profile.email}
              isReadOnly
            />
            <Input
              label="ИНН"
              placeholder="Введите ИНН"
              value={formData.inn}
              onValueChange={(val) => handleChange(val, "inn")}
              isReadOnly={!isProfileEditable}
            />
            <Input
              label="ОГРН/ОГРНИП"
              placeholder="Введите ОГРН/ОГРНИП"
              value={formData.ogrn_ogrnip}
              onValueChange={(val) => handleChange(val, "ogrn_ogrnip")}
              isReadOnly={!isProfileEditable}
            />
            <Input
              label="Юридический адрес"
              placeholder="Введите юридический адрес"
              value={formData.legal_address}
              onValueChange={(val) => handleChange(val, "legal_address")}
              isReadOnly={!isProfileEditable}
            />
            <Input
              label="Фактический адрес"
              placeholder="Введите фактический адрес"
              value={formData.actual_address}
              onValueChange={(val) => handleChange(val, "actual_address")}
              isReadOnly={!isProfileEditable}
            />
            <Input
              label="Телефон"
              placeholder="Введите телефон"
              type="tel"
              value={formData.phone}
              onValueChange={(val) => handleChange(val, "phone")}
              isReadOnly={!isProfileEditable}
            />
            <Input
              label="Веб-сайт"
              placeholder="Введите URL веб-сайта"
              type="url"
              value={formData.website}
              onValueChange={(val) => handleChange(val, "website")}
              isReadOnly={!isProfileEditable}
            />
            <Input
              label="URL логотипа"
              placeholder="Введите URL логотипа"
              type="url"
              value={formData.logo_url}
              onValueChange={(val) => handleChange(val, "logo_url")}
              isReadOnly={!isProfileEditable}
            />
            <Textarea
              label="Описание компании"
              placeholder="Введите краткое описание компании"
              className="col-span-1 md:col-span-2"
              value={formData.description}
              onValueChange={(val) => handleChange(val, "description")}
              isReadOnly={!isProfileEditable}
            />

            {/* НОВЫЕ ПОЛЯ: Финансовые данные */}
            <Input
              label="Тикер"
              placeholder="Введите тикер компании"
              value={formData.ticker}
              onValueChange={(val) => handleChange(val, "ticker")}
              isReadOnly={!isProfileEditable}
            />
            <Input
              label="Рынок"
              placeholder="Например, OTCQX"
              value={formData.market}
              onValueChange={(val) => handleChange(val, "market")}
              isReadOnly={!isProfileEditable}
            />
            <Input
              label="Отрасль"
              placeholder="Например, Технологии"
              value={formData.industry}
              onValueChange={(val) => handleChange(val, "industry")}
              isReadOnly={!isProfileEditable}
            />
            <Input
              label="Рыночная капитализация"
              placeholder="Введите рыночную капитализацию"
              type="number"
              value={formData.market_cap?.toString()}
              onValueChange={(val) =>
                handleChange(parseFloat(val), "market_cap")
              }
              isReadOnly={!isProfileEditable}
            />
            <Input
              label="Цена акции"
              placeholder="Введите цену акции"
              type="number"
              value={formData.stock_price?.toString()}
              onValueChange={(val) =>
                handleChange(parseFloat(val), "stock_price")
              }
              isReadOnly={!isProfileEditable}
            />
            <Input
              label="Объем торгов"
              placeholder="Введите объем торгов"
              type="number"
              value={formData.trading_volume?.toString()}
              onValueChange={(val) =>
                handleChange(parseFloat(val), "trading_volume")
              }
              isReadOnly={!isProfileEditable}
            />
            {/* Checkbox для has_dividends */}
            <div className="col-span-1 md:col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="has_dividends"
                checked={Boolean(formData.has_dividends)} // <-- ИСПРАВЛЕНИЕ: Явное приведение к boolean
                onChange={(e) =>
                  handleChange(e.target.checked, "has_dividends")
                }
                disabled={!isProfileEditable}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="has_dividends" className="text-default-600">
                Наличие дивидендов
              </label>
            </div>
            <Input
              label="Рейтинг"
              placeholder="Например, A, B, C"
              value={formData.rating}
              onValueChange={(val) => handleChange(val, "rating")}
              isReadOnly={!isProfileEditable}
            />
            <Input
              label="Статус компании (публичный)"
              placeholder="Например, Активна"
              value={formData.company_status}
              onValueChange={(val) => handleChange(val, "company_status")}
              isReadOnly={!isProfileEditable}
            />

            {isProfileEditable && (
              <Button
                type="submit"
                color="primary"
                isLoading={saving}
                className="col-span-1 md:col-span-2"
              >
                Сохранить изменения
              </Button>
            )}
            {(profile.status === "pending" ||
              profile.status === "rejected") && (
              <Button
                onClick={handleSubmitForReview}
                color="secondary"
                isLoading={saving}
                className="col-span-1 md:col-span-2"
              >
                Отправить на модерацию
              </Button>
            )}
          </form>

          <Divider className="my-8" />

          {/* Секция подписки */}
          <h2 className="text-xl font-bold mb-4">Управление подпиской</h2>
          {profile.subscription ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Тариф"
                isReadOnly
                value={profile.subscription.tariff_name}
              />
              <Input
                label="Дата начала"
                isReadOnly
                value={new Date(
                  profile.subscription.start_date
                ).toLocaleDateString()}
              />
              <Input
                label="Статус подписки"
                isReadOnly
                value={profile.subscription.payment_status}
              />
              <Input
                label="Дата окончания"
                isReadOnly
                value={new Date(
                  profile.subscription.end_date
                ).toLocaleDateString()}
              />
              <Input
                label="Дней осталось"
                isReadOnly
                value={profile.subscription.days_remaining.toString()}
              />
              <Input
                label="Активна"
                isReadOnly
                value={profile.subscription.is_active ? "Да" : "Нет"}
              />
              <Button
                as={Link}
                href="/subscriptions"
                color="primary"
                className="col-span-1 md:col-span-2"
              >
                Продлить подписку
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <p className="text-default-500">У вас нет активной подписки.</p>
              <Button as={Link} href="/subscriptions" color="primary">
                Купить подписку
              </Button>
            </div>
          )}

          <Divider className="my-8" />

          {/* Секция аналитики */}
          <h2 className="text-xl font-bold mb-4">Аналитика</h2>
          {profile.analitics ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Просмотры страницы"
                isReadOnly
                value={profile.analitics.page_views.toString()}
              />
              <Input
                label="Клики по внешним ссылкам"
                isReadOnly
                value={profile.analitics.external_link_clicks.toString()}
              />
            </div>
          ) : (
            <p className="text-default-500">
              Данные аналитики пока недоступны.
            </p>
          )}
        </CardBody>
      </Card>
    </section>
  );
}
