// backend/src/emitters/dto/emitter-profile.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// Импорты сущностей Emitter, Analitics, Subscribe больше не нужны для Pick

class SubscriptionProfileInfo {
  @ApiProperty({ example: 'uuid-string', description: 'ID подписки' })
  subscribe_id: string;

  @ApiProperty({
    example: 'Размещение на 30 дней',
    description: 'Название тарифа',
  })
  tariff_name: string;

  @ApiProperty({
    example: '2023-10-26T10:00:00.000Z',
    description: 'Дата начала подписки',
  })
  start_date: Date;

  @ApiProperty({
    example: '2023-11-25T10:00:00.000Z',
    description: 'Дата окончания подписки',
  })
  end_date: Date;

  @ApiProperty({
    example: 'active',
    enum: ['active', 'disable'],
    description: 'Статус подписки',
  })
  payment_status: 'active' | 'disable'; // Добавлено для полноты

  @ApiProperty({
    example: 29,
    description: 'Количество дней до истечения подписки',
  })
  days_remaining: number;

  @ApiProperty({ example: true, description: 'Активна ли подписка' })
  is_active: boolean;
}

class AnaliticsProfileInfo {
  @ApiProperty({ example: 150, description: 'Количество просмотров страницы' })
  page_views: number;

  @ApiProperty({
    example: 25,
    description: 'Количество переходов по внешней ссылке',
  })
  external_link_clicks: number;
}

export class EmitterProfileDto {
  // <-- Убрано 'implements Pick<...>'
  @ApiProperty({ example: 'uuid-string', description: 'ID эмитента' })
  emitent_id: string;

  @ApiProperty({
    example: 'Название компании',
    description: 'Название компании',
  })
  name: string;

  @ApiProperty({ example: 'email@example.com', description: 'Email эмитента' })
  email: string;

  @ApiPropertyOptional({
    example: '1234567890',
    description: 'ИНН',
    required: false,
  })
  inn?: string | null; // <-- Тип соответствует сущности Emitter

  @ApiPropertyOptional({
    example: '1234567890123',
    description: 'ОГРН/ОГРНИП',
    required: false,
  })
  ogrn_ogrnip?: string | null; // <-- Тип соответствует сущности Emitter

  @ApiPropertyOptional({
    example: 'Юридический адрес',
    description: 'Юридический адрес',
    required: false,
  })
  legal_address?: string | null; // <-- Тип соответствует сущности Emitter

  @ApiPropertyOptional({
    example: 'Фактический адрес',
    description: 'Фактический адрес',
    required: false,
  })
  actual_address?: string | null; // <-- Тип соответствует сущности Emitter

  @ApiPropertyOptional({
    example: '+79991234567',
    description: 'Телефон',
    required: false,
  })
  phone?: string | null; // <-- Тип соответствует сущности Emitter

  @ApiPropertyOptional({
    example: 'https://company.com',
    description: 'Веб-сайт',
    required: false,
  })
  website?: string | null; // <-- Тип соответствует сущности Emitter

  @ApiPropertyOptional({
    example: 'Описание компании',
    description: 'Описание компании',
    required: false,
  })
  description?: string | null; // <-- Тип соответствует сущности Emitter

  @ApiPropertyOptional({
    example: 'https://company.com/logo.png',
    description: 'URL логотипа',
    required: false,
  })
  logo_url?: string | null; // <-- Тип соответствует сущности Emitter

  @ApiProperty({
    enum: ['pending', 'approved', 'rejected'],
    example: 'pending',
    description: 'Статус модерации эмитента',
  })
  status: string; // В сущности Emitter это string, а не enum-тип

  @ApiPropertyOptional({
    example: 'Недостаточно информации',
    description: 'Причина отклонения',
    required: false,
    type: String,
    nullable: true,
  })
  rejection_reason?: string | null; // <-- Тип соответствует сущности Emitter

  @ApiProperty({
    type: () => SubscriptionProfileInfo,
    description: 'Информация о текущей подписке',
    nullable: true,
    required: false,
  })
  subscription?: SubscriptionProfileInfo;

  @ApiProperty({
    type: () => AnaliticsProfileInfo,
    description: 'Статистика просмотров и кликов',
    nullable: true,
    required: false,
  })
  analitics?: AnaliticsProfileInfo;

  @ApiProperty({
    example: '2023-10-26T10:00:00.000Z',
    description: 'Дата создания профиля',
  })
  created_at: Date;

  @ApiProperty({
    example: '2023-10-26T10:30:00.000Z',
    description: 'Дата последнего обновления профиля',
  })
  updated_at: Date;
}
