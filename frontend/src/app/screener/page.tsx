// frontend/src/app/screener/page.tsx
"use client";

import React from "react";

export default function ScreenerPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 text-center">
      <h1 className="text-3xl font-bold text-gray-800">
        Скринер внебиржевых активов
      </h1>
      <p className="text-lg text-gray-600">
        Здесь будет список компаний с фильтрами (реализация в следующих шагах).
      </p>
      {/* Пример карточки (позже будет динамическим) */}
      <div className="mt-8 p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
          Тестовая Компания А
        </h5>
        <p className="font-normal text-gray-700">Тикер: TSTA</p>
        <p className="font-normal text-gray-700">Рынок: OTCQX</p>
        <a
          href="#"
          className="mt-4 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
        >
          Подробнее
        </a>
      </div>
    </section>
  );
}
