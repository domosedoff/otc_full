// backend/src/emitters/dto/update-emitter-profile.dto.ts
import {
  IsString,
  IsOptional,
  Matches,
  MaxLength,
  IsUrl,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEmitterProfileDto {
  // <-- Добавлен export
  @ApiPropertyOptional({
    example: 'Новое название компании',
    description: 'Название компании (эмитента)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Название компании должно быть строкой' })
  @MinLength(2, {
    message: 'Название компании должно содержать хотя бы 2 символа',
  })
  @MaxLength(255, {
    message: 'Название компании не должно превышать 255 символов',
  })
  name?: string;

  @ApiPropertyOptional({
    example: '1234567890',
    description: 'ИНН (10 или 12 цифр)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'ИНН должен быть строкой' })
  @Matches(/^(\d{10}|\d{12})$/, {
    message: 'ИНН должен состоять из 10 или 12 цифр',
  })
  inn?: string;

  @ApiPropertyOptional({
    example: '1234567890123',
    description: 'ОГРН/ОГРНИП (13 или 15 цифр)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'ОГРН/ОГРНИП должен быть строкой' })
  @Matches(/^(\d{13}|\d{15})$/, {
    message: 'ОГРН/ОГРНИП должен состоять из 13 или 15 цифр',
  })
  ogrn_ogrnip?: string;

  @ApiPropertyOptional({
    example: 'г. Москва, ул. Ленина, д. 1',
    description: 'Юридический адрес',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Юридический адрес должен быть строкой' })
  legal_address?: string;

  @ApiPropertyOptional({
    example: 'г. Москва, ул. Мира, д. 5, оф. 10',
    description: 'Фактический адрес',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Фактический адрес должен быть строкой' })
  actual_address?: string;

  @ApiPropertyOptional({
    example: '+79991234567',
    description: 'Контактный телефон',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Телефон должен быть строкой' })
  phone?: string;

  @ApiPropertyOptional({
    example: 'https://company.com',
    description: 'Веб-сайт компании',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'Некорректный URL веб-сайта' })
  website?: string;

  @ApiPropertyOptional({
    example: 'Обновленное описание компании.',
    description: 'Описание компании',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Описание должно быть строкой' })
  description?: string;

  @ApiPropertyOptional({
    example: 'https://company.com/logo.png',
    description: 'URL логотипа компании',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'Некорректный URL логотипа' })
  logo_url?: string;
}
