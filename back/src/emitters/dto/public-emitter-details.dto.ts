// back/src/emitters/dto/public-emitter-details.dto.ts
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsUUID,
} from 'class-validator';

// Этот DTO используется для вложенного объекта emitter в PublicEmitterDetailsDto
export class PublicEmitterDetailsData {
  @IsUUID()
  @IsString()
  emitent_id: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  logo_url?: string;

  @IsOptional()
  @IsString()
  ticker?: string;

  @IsOptional()
  @IsString()
  market?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsNumber()
  market_cap?: number;

  @IsOptional()
  @IsNumber()
  stock_price?: number;

  @IsOptional()
  @IsNumber()
  trading_volume?: number;

  @IsOptional()
  @IsBoolean()
  has_dividends?: boolean;

  @IsOptional()
  @IsString() // ИСПРАВЛЕНИЕ: rating теперь string
  rating?: string; // Изменено с number на string

  @IsOptional()
  @IsString()
  company_status?: string;
}

export class PublicEmitterDetailsDto {
  emitter: PublicEmitterDetailsData;
}
