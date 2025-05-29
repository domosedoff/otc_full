// backend/src/admin/dto/update-emitter-status.dto.ts
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Определяем допустимые статусы для обновления
enum EmitterStatusUpdate {
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export class UpdateEmitterStatusDto {
  @ApiProperty({
    enum: EmitterStatusUpdate,
    description: 'Новый статус эмитента',
  })
  @IsEnum(EmitterStatusUpdate, {
    message: 'Статус должен быть "approved" или "rejected"',
  })
  status: EmitterStatusUpdate;

  @ApiPropertyOptional({
    example: 'Недостаточно информации',
    description: 'Причина отклонения (обязательно, если статус "rejected")',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Причина должна быть строкой' })
  @MaxLength(500, { message: 'Причина не должна превышать 500 символов' })
  reason?: string; // Обязательно, если status = 'rejected' (будет валидироваться в контроллере/сервисе)
}
