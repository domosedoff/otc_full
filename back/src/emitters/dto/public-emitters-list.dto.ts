// backend/src/emitters/dto/public-emitters-list.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Emitter } from '../entities/emitter.entity';
// import { FinancialData } from '../../financial-data/entities/financial-data.entity'; // <-- Убран импорт FinancialData

// Определяем, какие поля Emitter будут видны публично в списке
export type PublicEmitterSummary = Pick<
  Emitter,
  'emitent_id' | 'name' | 'description' | 'logo_url'
> & {
  // Добавляем поля из FinancialData, которые будут отображаться в списке
  ticker?: string;
  market?: string;
  industry?: string;
  market_cap?: number;
  stock_price?: number;
  trading_volume?: number;
  has_dividends?: boolean;
  rating?: string;
  company_status?: string;
};

export class PublicEmittersListDto {
  @ApiProperty({
    example: 50,
    description: 'Общее количество эмитентов, соответствующих фильтру',
  })
  total: number;

  @ApiProperty({ example: 1, description: 'Текущая страница' })
  page: number;

  @ApiProperty({ example: 20, description: 'Количество записей на странице' })
  limit: number;

  @ApiProperty({ type: [Emitter], description: 'Массив эмитентов' }) // Type: [Emitter] для Swagger
  data: PublicEmitterSummary[];
}
