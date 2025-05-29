// frontend/src/app/info/page.tsx
"use client";

import React from "react";

export default function InfoPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <h1 className="text-3xl font-bold">Полезная биржевая информация</h1>
      <p className="text-lg text-default-500 max-w-xl text-center">
        Здесь будет размещаться актуальная информация о рынках, курсах валют,
        акций и другие полезные данные для инвесторов.
      </p>
      <p className="text-lg text-default-500 max-w-xl text-center">
        (Данный раздел будет наполняться администратором сайта.)
      </p>
    </section>
  );
}
