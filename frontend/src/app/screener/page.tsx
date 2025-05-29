// frontend/src/app/screener/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Input,
  Button,
  Spinner,
  Select,
  SelectItem,
  Pagination,
} from "@heroui/react";
import Image from "next/image";
// import { useRouter } from 'next/navigation'; // <-- ИСПРАВЛЕНИЕ: Убран неиспользуемый импорт router
import api from "@/lib/api";
import axios from "axios";
import { GetEmittersFilterDto } from "@/types/admin";
import { PublicEmitterSummary } from "@/types/emitter";

// Определяем допустимые значения для фильтров (должны совпадать с бэкендом)
const MARKET_TYPES = ["OTCQX", "OTCQB", "Pink"];
const INDUSTRY_TYPES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Energy",
  "Real Estate",
]; // Пример
const RATING_TYPES = ["A", "B", "C", "D"]; // Пример
const SORT_BY_FIELDS = [
  { key: "market_cap", label: "Капитализация" },
  { key: "stock_price", label: "Цена акции" },
  { key: "trading_volume", label: "Объем торгов" },
  { key: "name", label: "Название" },
  { key: "created_at", label: "Дата создания" },
];
const SORT_ORDER = [
  { key: "DESC", label: "По убыванию" },
  { key: "ASC", label: "По возрастанию" },
];

export default function ScreenerPage() {
  // const router = useRouter(); // <-- ИСПРАВЛЕНИЕ: Убран неиспользуемый router
  const [emitters, setEmitters] = useState<PublicEmitterSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);

  // Состояния для фильтров
  const [filterTicker, setFilterTicker] = useState<string>("");
  const [filterCompanyName, setFilterCompanyName] = useState<string>("");
  const [filterMarket, setFilterMarket] = useState<string>("");
  const [filterIndustry, setFilterIndustry] = useState<string>("");
  const [filterMinMarketCap, setFilterMinMarketCap] = useState<string>("");
  const [filterMaxMarketCap, setFilterMaxMarketCap] = useState<string>("");
  const [filterMinStockPrice, setFilterMinStockPrice] = useState<string>("");
  const [filterMaxStockPrice, setFilterMaxStockPrice] = useState<string>("");
  const [filterMinTradingVolume, setFilterMinTradingVolume] =
    useState<string>("");
  const [filterMaxTradingVolume, setFilterMaxTradingVolume] =
    useState<string>("");
  const [filterHasDividends, setFilterHasDividends] = useState<boolean | null>(
    null
  );
  const [filterRating, setFilterRating] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("market_cap");
  const [order, setOrder] = useState<string>("DESC");

  const fetchEmitters = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: GetEmittersFilterDto = {
        page,
        limit,
        sortBy: sortBy as GetEmittersFilterDto["sortBy"],
        order: order as GetEmittersFilterDto["order"],
        ticker: filterTicker || undefined,
        company_name: filterCompanyName || undefined,
        market: filterMarket || undefined,
        industry: filterIndustry || undefined,
        min_market_cap: filterMinMarketCap
          ? parseFloat(filterMinMarketCap)
          : undefined,
        max_market_cap: filterMaxMarketCap
          ? parseFloat(filterMaxMarketCap)
          : undefined,
        min_stock_price: filterMinStockPrice
          ? parseFloat(filterMinStockPrice)
          : undefined,
        max_stock_price: filterMaxStockPrice
          ? parseFloat(filterMaxStockPrice)
          : undefined,
        min_trading_volume: filterMinTradingVolume
          ? parseFloat(filterMinTradingVolume)
          : undefined,
        max_trading_volume: filterMaxTradingVolume
          ? parseFloat(filterMaxTradingVolume)
          : undefined,
        has_dividends:
          filterHasDividends !== null ? filterHasDividends : undefined,
        rating: filterRating || undefined,
      };

      const response = await api.get<{
        data: PublicEmitterSummary[];
        total: number;
        page: number;
        limit: number;
      }>("/emitters", { params });
      setEmitters(response.data.data);
      setTotal(response.data.total);
      setPage(response.data.page);
      setLimit(response.data.limit);
    } catch (err: unknown) {
      console.error("Failed to fetch public emitters:", err);
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
          "Не удалось загрузить список эмитентов. Пожалуйста, попробуйте позже."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [
    page,
    limit,
    sortBy,
    order,
    filterTicker,
    filterCompanyName,
    filterMarket,
    filterIndustry,
    filterMinMarketCap,
    filterMaxMarketCap,
    filterMinStockPrice,
    filterMaxStockPrice,
    filterMinTradingVolume,
    filterMaxTradingVolume,
    filterHasDividends,
    filterRating,
  ]);

  useEffect(() => {
    fetchEmitters();
  }, [fetchEmitters]);

  const handleFilterChange = () => {
    setPage(1);
    fetchEmitters();
  };

  const handleResetFilters = () => {
    setFilterTicker("");
    setFilterCompanyName("");
    setFilterMarket("");
    setFilterIndustry("");
    setFilterMinMarketCap("");
    setFilterMaxMarketCap("");
    setFilterMinStockPrice("");
    setFilterMaxStockPrice("");
    setFilterMinTradingVolume("");
    setFilterMaxTradingVolume("");
    setFilterHasDividends(null);
    setFilterRating("");
    setSortBy("market_cap");
    setOrder("DESC");
    setPage(1);
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <h1 className="text-3xl font-bold">Скринер внебиржевых активов</h1>
      <p className="text-lg text-default-500">
        Здесь будет список компаний с фильтрами.
      </p>

      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8 p-4 border rounded-lg shadow-md">
        <h2 className="col-span-full text-xl font-semibold mb-2">Фильтры</h2>
        <Input
          label="Тикер"
          placeholder="AAPL"
          value={filterTicker}
          onValueChange={setFilterTicker}
        />
        <Input
          label="Название компании"
          placeholder="Apple Inc."
          value={filterCompanyName}
          onValueChange={setFilterCompanyName}
        />
        <Select
          label="Рынок"
          placeholder="Выберите рынок"
          selectedKeys={filterMarket ? new Set([filterMarket]) : new Set([])}
          onSelectionChange={(keys) =>
            setFilterMarket(Array.from(keys).join(""))
          }
        >
          {MARKET_TYPES.map((market) => (
            <SelectItem key={market} value={market}>
              {market}
            </SelectItem>
          ))}
        </Select>
        <Select
          label="Отрасль"
          placeholder="Выберите отрасль"
          selectedKeys={
            filterIndustry ? new Set([filterIndustry]) : new Set([])
          }
          onSelectionChange={(keys) =>
            setFilterIndustry(Array.from(keys).join(""))
          }
        >
          {INDUSTRY_TYPES.map((industry) => (
            <SelectItem key={industry} value={industry}>
              {industry}
            </SelectItem>
          ))}
        </Select>
        <Input
          label="Мин. капитализация"
          placeholder="0"
          type="number"
          value={filterMinMarketCap}
          onValueChange={setFilterMinMarketCap}
        />
        <Input
          label="Макс. капитализация"
          placeholder="1000000000"
          type="number"
          value={filterMaxMarketCap}
          onValueChange={setFilterMaxMarketCap}
        />
        <Input
          label="Мин. цена акции"
          placeholder="0"
          type="number"
          value={filterMinStockPrice}
          onValueChange={setFilterMinStockPrice}
        />
        <Input
          label="Макс. цена акции"
          placeholder="1000"
          type="number"
          value={filterMaxStockPrice}
          onValueChange={setFilterMaxStockPrice}
        />
        <Input
          label="Мин. объем торгов"
          placeholder="0"
          type="number"
          value={filterMinTradingVolume}
          onValueChange={setFilterMinTradingVolume}
        />
        <Input
          label="Макс. объем торгов"
          placeholder="1000000"
          type="number"
          value={filterMaxTradingVolume}
          onValueChange={setFilterMaxTradingVolume}
        />
        <Select
          label="Дивиденды"
          placeholder="Наличие дивидендов"
          selectedKeys={
            filterHasDividends === true
              ? new Set(["true"])
              : filterHasDividends === false
              ? new Set(["false"])
              : new Set([])
          }
          onSelectionChange={(keys) => {
            const val = Array.from(keys).join("");
            setFilterHasDividends(
              val === "true" ? true : val === "false" ? false : null
            );
          }}
        >
          <SelectItem key="true" value="true">
            Да
          </SelectItem>
          <SelectItem key="false" value="false">
            Нет
          </SelectItem>
        </Select>
        <Select
          label="Рейтинг"
          placeholder="Выберите рейтинг"
          selectedKeys={filterRating ? new Set([filterRating]) : new Set([])}
          onSelectionChange={(keys) =>
            setFilterRating(Array.from(keys).join(""))
          }
        >
          {RATING_TYPES.map((rating) => (
            <SelectItem key={rating} value={rating}>
              {rating}
            </SelectItem>
          ))}
        </Select>
        <Select
          label="Сортировать по"
          placeholder="Выберите поле"
          selectedKeys={sortBy ? new Set([sortBy]) : new Set([])}
          onSelectionChange={(keys) => setSortBy(Array.from(keys).join(""))}
        >
          {SORT_BY_FIELDS.map((field) => (
            <SelectItem key={field.key} value={field.key}>
              {field.label}
            </SelectItem>
          ))}
        </Select>
        <Select
          label="Порядок"
          placeholder="Выберите порядок"
          selectedKeys={order ? new Set([order]) : new Set([])}
          onSelectionChange={(keys) => setOrder(Array.from(keys).join(""))}
        >
          {SORT_ORDER.map((ord) => (
            <SelectItem key={ord.key} value={ord.key}>
              {ord.label}
            </SelectItem>
          ))}
        </Select>
        <div className="col-span-full flex justify-end gap-4 mt-4">
          <Button onClick={handleResetFilters} variant="bordered">
            Сбросить фильтры
          </Button>
          <Button onClick={handleFilterChange} color="primary">
            Применить фильтры
          </Button>
        </div>
      </div>

      {loading ? (
        <Spinner label="Загрузка компаний..." color="primary" />
      ) : error ? (
        <p className="text-danger text-lg">{error}</p>
      ) : emitters.length === 0 ? (
        <p className="text-default-500 text-lg">
          По вашему запросу ничего не найдено.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8 w-full max-w-4xl">
          {emitters.map((emitter) => (
            <Card key={emitter.emitent_id} className="max-w-[400px]">
              <CardHeader className="flex gap-3">
                <Image
                  alt="company logo"
                  height={40}
                  radius="sm"
                  src={
                    emitter.logo_url ||
                    "https://nextui.org/avatars/avatar-1.png"
                  }
                  width={40}
                />
                <div className="flex flex-col">
                  <p className="text-md">{emitter.name}</p>
                  <p className="text-small text-default-500">
                    Тикер: {emitter.ticker || "N/A"}
                  </p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p>Рынок: {emitter.market || "N/A"}</p>
                <p>Отрасль: {emitter.industry || "N/A"}</p>
                <p>
                  Капитализация: $
                  {emitter.market_cap?.toLocaleString() || "N/A"}
                </p>
                <p>Цена акции: ${emitter.stock_price || "N/A"}</p>
                <p>
                  Объем торгов:{" "}
                  {emitter.trading_volume?.toLocaleString() || "N/A"}
                </p>
                <p>Дивиденды: {emitter.has_dividends ? "Да" : "Нет"}</p>
                <p>Рейтинг: {emitter.rating || "N/A"}</p>
                <p>Статус: {emitter.company_status || "N/A"}</p>
              </CardBody>
              <Divider />
              <CardFooter>
                <Link href={`/emitters/${emitter.emitent_id}`}>Подробнее</Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      {total > limit && (
        <div className="flex w-full justify-center mt-4">
          <Pagination
            total={Math.ceil(total / limit)}
            initialPage={page}
            onChange={setPage}
          />
        </div>
      )}
    </section>
  );
}
