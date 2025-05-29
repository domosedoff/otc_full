// backend/src/admin/dto/get-emitters-filter.dto.ts
import { IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

// Определяем допустимые статусы для фильтрации
enum EmitterStatusFilter {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export class GetEmittersFilterDto {
  @ApiPropertyOptional({
    enum: EmitterStatusFilter,
    description: 'Фильтр по статусу эмитента',
    required: false,
  })
  @IsOptional()
  @IsEnum(EmitterStatusFilter, { message: 'Некорректный статус эмитента' })
  status?: EmitterStatusFilter;

  @ApiPropertyOptional({
    example: 1,
    description: 'Номер страницы',
    required: false,
  })
  @IsOptional()
  @Type(() => Number) // Преобразует строку в число
  @IsInt({ message: 'Номер страницы должен быть целым числом' })
  @Min(1, { message: 'Номер страницы должен быть не менее 1' })
  page?: number = 1; // Значение по умолчанию

  @ApiPropertyOptional({
    example: 20,
    description: 'Количество записей на странице (10, 20, 30, 50, 100)',
    required: false,
  })
  @IsOptional()
  @Type(() => Number) // Преобразует строку в число
  @IsInt({ message: 'Лимит должен быть целым числом' })
  @Min(1, { message: 'Лимит должен быть не менее 1' })
  @Max(100, { message: 'Лимит не должен превышать 100' }) // Максимальный лимит для безопасности
  limit?: number = 20; // Значение по умолчанию
}
