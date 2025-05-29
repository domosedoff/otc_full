// frontend/src/app/auth/register/page.tsx
"use client";

import React, { useState } from "react";
import {
  Input,
  Button,
  Link,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Textarea,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import api, { setAuthToken } from "@/lib/api";
import { RegisterEmitterPayload, EmitterAuthResponse } from "@/types/auth";
import axios from "axios"; // <-- ИСПРАВЛЕНИЕ: Убран AxiosError из импорта

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterEmitterPayload>({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (value: string, field: keyof RegisterEmitterPayload) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: RegisterEmitterPayload = {
        ...formData,
        inn: formData.inn || undefined,
        ogrn_ogrnip: formData.ogrn_ogrnip || undefined,
        legal_address: formData.legal_address || undefined,
        actual_address: formData.actual_address || undefined,
        phone: formData.phone || undefined,
        website: formData.website || undefined,
        description: formData.description || undefined,
        logo_url: formData.logo_url || undefined,
      };

      const response = await api.post<EmitterAuthResponse>(
        "/auth/emitter/register",
        payload
      );

      sessionStorage.setItem("accessToken", response.data.accessToken);
      sessionStorage.setItem("userRole", "emitter");
      setAuthToken(response.data.accessToken);

      router.push("/profile/emitter");
    } catch (err: unknown) {
      console.error("Registration error:", err);
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
        if (Array.isArray(errorMessage)) {
          setError(errorMessage.join(", "));
        } else if (typeof errorMessage === "string") {
          setError(errorMessage);
        } else {
          setError(
            "Произошла ошибка при регистрации. Неизвестное сообщение об ошибке."
          );
        }
      } else {
        setError(
          "Произошла ошибка при регистрации. Пожалуйста, попробуйте позже."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <Card className="max-w-2xl w-full">
        <CardHeader className="flex justify-center">
          <h1 className="text-2xl font-bold">Регистрация Эмитента</h1>
        </CardHeader>
        <CardBody>
          <form
            onSubmit={handleRegister}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Input
              isRequired
              label="Название компании"
              placeholder="Введите название компании"
              value={formData.name}
              onValueChange={(val) => handleChange(val, "name")}
            />
            <Input
              isRequired
              label="Email"
              placeholder="Введите ваш email"
              type="email"
              value={formData.email}
              onValueChange={(val) => handleChange(val, "email")}
            />
            <Input
              isRequired
              label="Пароль"
              placeholder="Введите ваш пароль"
              type="password"
              value={formData.password}
              onValueChange={(val) => handleChange(val, "password")}
            />
            <Input
              label="ИНН"
              placeholder="Введите ИНН"
              value={formData.inn}
              onValueChange={(val) => handleChange(val, "inn")}
            />
            <Input
              label="ОГРН/ОГРНИП"
              placeholder="Введите ОГРН/ОГРНИП"
              value={formData.ogrn_ogrnip}
              onValueChange={(val) => handleChange(val, "ogrn_ogrnip")}
            />
            <Input
              label="Юридический адрес"
              placeholder="Введите юридический адрес"
              value={formData.legal_address}
              onValueChange={(val) => handleChange(val, "legal_address")}
            />
            <Input
              label="Фактический адрес"
              placeholder="Введите фактический адрес"
              value={formData.actual_address}
              onValueChange={(val) => handleChange(val, "actual_address")}
            />
            <Input
              label="Телефон"
              placeholder="Введите телефон"
              type="tel"
              value={formData.phone}
              onValueChange={(val) => handleChange(val, "phone")}
            />
            <Input
              label="Веб-сайт"
              placeholder="Введите URL веб-сайта"
              type="url"
              value={formData.website}
              onValueChange={(val) => handleChange(val, "website")}
            />
            <Input
              label="URL логотипа"
              placeholder="Введите URL логотипа"
              type="url"
              value={formData.logo_url}
              onValueChange={(val) => handleChange(val, "logo_url")}
            />
            <Textarea
              label="Описание компании"
              placeholder="Введите краткое описание компании"
              className="col-span-1 md:col-span-2"
              value={formData.description}
              onValueChange={(val) => handleChange(val, "description")}
            />
            {error && (
              <p className="text-danger text-sm col-span-1 md:col-span-2">
                {error}
              </p>
            )}
            <Button
              type="submit"
              color="primary"
              isLoading={loading}
              className="col-span-1 md:col-span-2"
            >
              Зарегистрироваться
            </Button>
          </form>
        </CardBody>
        <CardFooter className="flex justify-center">
          <p className="text-small">
            Уже есть аккаунт?{" "}
            <Link href="/auth/login" size="sm">
              Войти
            </Link>
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}
