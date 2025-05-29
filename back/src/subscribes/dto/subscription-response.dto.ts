// backend/src/subscribes/dto/subscription-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Subscribe } from '../entities/subscribe.entity'; // Импортируем сущность Subscribe

// Определяем, какие поля подписки будут возвращены
export type SubscriptionDataInResponse = Pick<
  Subscribe,
  | 'subscribe_id'
  | 'emitent_id'
  | 'tariff_name'
  | 'duration_days'
  | 'start_date'
  | 'end_date'
  | 'payment_status'
  | 'payment_amount'
>;

export class SubscriptionResponseDto {
  @ApiProperty({
    example: 'Подписка успешно активирована.',
    description: 'Сообщение о результате операции',
  })
  message: string;

  @ApiProperty({
    type: () => Subscribe,
    description: 'Данные активированной подписки',
  })
  subscription: SubscriptionDataInResponse;
}
