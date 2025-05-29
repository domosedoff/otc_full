// frontend/src/components/common/Footer.tsx
"use client";

import React from "react";
// import { Link } from '@heroui/react'; // <-- УБРАН ИМПОРТ Link, если он больше не используется

export function Footer() {
  return (
    <footer className="w-full flex items-center justify-center py-3 border-t">
      {/* <Link // <-- УБРАН БЛОК Link
        isExternal
        className="flex items-center gap-1 text-current"
        href="https://github.com/domosedoff/otc"
        title="github repository"
      >
        <span className="text-default-600">Powered by</span>
        <p className="text-primary">domosedoff</p>
      </Link> */}
      <p className="text-default-600">© 2025 OTC Marketplace</p>{" "}
      {/* <-- ДОБАВЛЕН БАЗОВЫЙ ТЕКСТ */}
    </footer>
  );
}
