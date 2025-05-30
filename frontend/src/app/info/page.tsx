// frontend/src/app/info/page.tsx
"use client";

import React from "react";

export default function InfoPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 text-center">
      <h1 className="text-3xl font-bold text-gray-800">
        Полезная биржевая информация
      </h1>
      <p className="text-lg text-gray-600 max-w-xl">
        Здесь будет размещаться актуальная информация о рынках, курсах валют,
        акций и другие полезные данные для инвесторов.
      </p>
      <p className="text-lg text-gray-600 max-w-xl">
        (Данный раздел будет наполняться администратором сайта.)
      </p>
    </section>
  );
}
