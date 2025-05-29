// frontend/src/components/common/Header.tsx
"use client";

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@heroui/react";
// import Image from 'next/image'; // <-- УБРАН ИМПОРТ Image

export function Header() {
  return (
    <Navbar shouldHideOnScroll>
      <NavbarBrand>
        {/* <Image // <-- УБРАН БЛОК Image
          src="/logo.svg"
          alt="OTC Marketplace Logo"
          width={30}
          height={30}
        />
        <p className="font-bold text-inherit ml-2">OTC Marketplace</p> */}
        <p className="font-bold text-inherit">OTC Marketplace</p>{" "}
        {/* <-- ОСТАВЛЯЕМ ТОЛЬКО ТЕКСТ */}
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/">
            Главная
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/screener">
            Скринер
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/about">
            О сервисе
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/info">
            Полезная инфа
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Button as={Link} color="primary" href="/auth/login" variant="flat">
            Я эмитент
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
