// back/src/subscribes/dto/activate-subscription.dto.ts
import { IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';

export class ActivateSubscriptionDto {
  @IsUUID() // Валидация для UUID
  @IsString()
  tariffId: string; // Добавлено поле tariffId

  @IsNumber()
  @IsPositive()
  duration_days: number;
}
