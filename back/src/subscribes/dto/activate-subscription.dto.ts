// backend/src/subscribes/dto/activate-subscription.dto.ts
import { IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ActivateSubscriptionDto {
  @ApiProperty({
    example: 30,
    description:
      'Количество дней для активации подписки (минимум 1, максимум 365)',
  })
  @Type(() => Number)
  @IsInt({ message: 'Количество дней должно быть целым числом' })
  @Min(1, { message: 'Минимальное количество дней - 1' })
  @Max(365, { message: 'Максимальное количество дней - 365' }) // Ограничение на год
  duration_days: number;
}
