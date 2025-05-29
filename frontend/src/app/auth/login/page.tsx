// frontend/src/app/auth/admin/login/page.tsx
"use client";

import React, { useState } from "react";
import {
  Input,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@heroui/react"; // <-- ИСПРАВЛЕНИЕ: Убран Link
import { useRouter } from "next/navigation";
import api, { setAuthToken } from "@/lib/api";
import { LoginAdminPayload, AdminAuthResponse } from "@/types/auth";
import axios from "axios";

export default function AdminLoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: LoginAdminPayload = { password }; // <-- ИСПРАВЛЕНИЕ: 'const' вместо 'let'

      if (usernameOrEmail.includes("@")) {
        payload.email = usernameOrEmail;
      } else {
        payload.username = usernameOrEmail;
      }

      const response = await api.post<AdminAuthResponse>(
        "/auth/admin/login",
        payload
      );

      sessionStorage.setItem("accessToken", response.data.accessToken);
      sessionStorage.setItem("userRole", "admin");
      setAuthToken(response.data.accessToken);

      router.push("/admin");
    } catch (err: unknown) {
      console.error("Admin login error:", err);
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
        setError("Произошла ошибка при входе. Пожалуйста, попробуйте позже.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <Card className="max-w-md w-full">
        <CardHeader className="flex justify-center">
          <h1 className="text-2xl font-bold">Вход для Администраторов</h1>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Input
              isRequired
              label="Имя пользователя или Email"
              placeholder="Введите имя пользователя или email"
              type="text"
              value={usernameOrEmail}
              onValueChange={setUsernameOrEmail}
              isInvalid={!!error}
              errorMessage={error}
            />
            <Input
              isRequired
              label="Пароль"
              placeholder="Введите ваш пароль"
              type="password"
              value={password}
              onValueChange={setPassword}
              isInvalid={!!error}
            />
            {error && <p className="text-danger text-sm">{error}</p>}
            <Button type="submit" color="primary" isLoading={loading}>
              Войти
            </Button>
          </form>
        </CardBody>
        <CardFooter className="flex justify-center">
          <p className="text-small text-default-500">
            Только для авторизованных администраторов.
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}
