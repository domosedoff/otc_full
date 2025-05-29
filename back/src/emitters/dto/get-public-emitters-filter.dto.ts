// backend/src/emitters/dto/get-public-emitters-filter.dto.ts
import {
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  Max,
  IsString,
  // Matches,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

// Определяем допустимые значения для фильтров
enum MarketType {
  OTCQX = 'OTCQX',
  OTCQB = 'OTCQB',
  PINK = 'Pink',
  // Добавь другие, если нужны
}

enum IndustryType {
  TECHNOLOGY = 'Technology',
  FINANCE = 'Finance',
  HEALTHCARE = 'Healthcare',
  // Добавь другие, если нужны
}

enum RatingType {
  A = 'A',
  B = 'B',
  C = 'C',
  // Добавь другие, если нужны
}

enum SortByField {
  MARKET_CAP = 'market_cap',
  STOCK_PRICE = 'stock_price',
  TRADING_VOLUME = 'trading_volume',
  NAME = 'name',
  CREATED_AT = 'created_at',
}

enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class GetPublicEmittersFilterDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Номер страницы',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Номер страницы должен быть целым числом' })
  @Min(1, { message: 'Номер страницы должен быть не менее 1' })
  page?: number = 1;

  @ApiPropertyOptional({
    example: 20,
    description: 'Количество записей на странице (10, 20, 30, 50, 100)',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Лимит должен быть целым числом' })
  @Min(1, { message: 'Лимит должен быть не менее 1' })
  @Max(100, { message: 'Лимит не должен превышать 100' })
  limit?: number = 20;

  @ApiPropertyOptional({
    enum: SortByField,
    example: 'market_cap',
    description: 'Поле для сортировки',
    required: false,
  })
  @IsOptional()
  @IsEnum(SortByField, { message: 'Некорректное поле для сортировки' })
  sortBy?: SortByField = SortByField.MARKET_CAP;

  @ApiPropertyOptional({
    enum: SortOrder,
    example: 'DESC',
    description: 'Порядок сортировки',
    required: false,
  })
  @IsOptional()
  @IsEnum(SortOrder, { message: 'Некорректный порядок сортировки' })
  order?: SortOrder = SortOrder.DESC;

  @ApiPropertyOptional({
    example: 'AAPL',
    description: 'Поиск по тикеру',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Тикер должен быть строкой' })
  ticker?: string;

  @ApiPropertyOptional({
    example: 'Apple Inc.',
    description: 'Поиск по названию компании',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Название компании должно быть строкой' })
  company_name?: string;

  @ApiPropertyOptional({
    enum: MarketType,
    example: 'OTCQX',
    description: 'Фильтр по типу рынка',
    required: false,
  })
  @IsOptional()
  @IsEnum(MarketType, { message: 'Некорректный тип рынка' })
  market?: MarketType;

  @ApiPropertyOptional({
    enum: IndustryType,
    example: 'Technology',
    description: 'Фильтр по отрасли',
    required: false,
  })
  @IsOptional()
  @IsEnum(IndustryType, { message: 'Некорректная отрасль' })
  industry?: IndustryType;

  @ApiPropertyOptional({
    example: 1000000,
    description: 'Минимальная рыночная капитализация',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Рыночная капитализация должна быть числом' })
  @Min(0, { message: 'Рыночная капитализация не может быть отрицательной' })
  min_market_cap?: number;

  @ApiPropertyOptional({
    example: 1000000000,
    description: 'Максимальная рыночная капитализация',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Рыночная капитализация должна быть числом' })
  max_market_cap?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Минимальная цена акции',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Цена акции должна быть числом' })
  @Min(0, { message: 'Цена акции не может быть отрицательной' })
  min_stock_price?: number;

  @ApiPropertyOptional({
    example: 100,
    description: 'Максимальная цена акции',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Цена акции должна быть числом' })
  max_stock_price?: number;

  @ApiPropertyOptional({
    example: 10000,
    description: 'Минимальный объем торгов',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Объем торгов должен быть числом' })
  @Min(0, { message: 'Объем торгов не может быть отрицательным' })
  min_trading_volume?: number;

  @ApiPropertyOptional({
    example: 1000000,
    description: 'Максимальный объем торгов',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Объем торгов должен быть числом' })
  max_trading_volume?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Наличие дивидендов',
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean) // Преобразует строку "true"/"false" в boolean
  @IsBoolean({ message: 'Наличие дивидендов должно быть булевым значением' })
  has_dividends?: boolean;

  @ApiPropertyOptional({
    enum: RatingType,
    example: 'A',
    description: 'Рейтинг компании',
    required: false,
  })
  @IsOptional()
  @IsEnum(RatingType, { message: 'Некорректный рейтинг' })
  rating?: RatingType;
}
