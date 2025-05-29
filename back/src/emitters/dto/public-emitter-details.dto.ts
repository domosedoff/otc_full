// backend/src/emitters/dto/public-emitter-details.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Emitter } from '../entities/emitter.entity';
// import { FinancialData } from '../../financial-data/entities/financial-data.entity'; // <-- Убран импорт FinancialData

// Вспомогательный тип для платформ (если будет использоваться)
class PlatformInfo {
  @ApiProperty({ example: 'Биржа X', description: 'Название платформы' })
  name: string;

  @ApiProperty({
    example: 'https://birzha-x.com/company-page',
    description: 'URL страницы компании на платформе',
  })
  url: string;
}

// Определяем, какие поля Emitter будут видны публично в детальной карточке
export type PublicEmitterDetails = Pick<
  Emitter,
  'emitent_id' | 'name' | 'description' | 'logo_url'
> & {
  // Поля из FinancialData
  ticker?: string;
  market?: string;
  industry?: string;
  market_cap?: number;
  stock_price?: number;
  trading_volume?: number;
  has_dividends?: boolean;
  rating?: string;
  company_status?: string;
  platforms?: PlatformInfo[];
};

export class PublicEmitterDetailsDto {
  @ApiProperty({
    type: () => Emitter,
    description: 'Детальные данные эмитента',
  })
  emitter: PublicEmitterDetails;
}
