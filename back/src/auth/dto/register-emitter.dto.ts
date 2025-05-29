// backend/src/auth/dto/register-emitter.dto.ts
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  Matches,
  MaxLength,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'; // Для документирования API (позже)

export class RegisterEmitterDto {
  @ApiProperty({
    example: 'ООО Ромашка',
    description: 'Название компании (эмитента)',
  })
  @IsString({ message: 'Название компании должно быть строкой' })
  @MinLength(2, {
    message: 'Название компании должно содержать хотя бы 2 символа',
  })
  @MaxLength(255, {
    message: 'Название компании не должно превышать 255 символов',
  })
  name: string;

  @ApiProperty({
    example: 'emitter@example.com',
    description: 'Email эмитента',
  })
  @IsEmail({}, { message: 'Некорректный формат email' })
  @MaxLength(255, { message: 'Email не должен превышать 255 символов' })
  email: string;

  @ApiProperty({
    example: 'P@$$wOrd123',
    description:
      'Пароль эмитента (минимум 8 символов, заглавные, строчные, цифры, спецсимволы)',
  })
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(8, { message: 'Пароль должен содержать хотя бы 8 символов' })
  // Можно добавить @Matches для проверки сложности пароля, например:
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Пароль слишком простой' })
  password: string;

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
  // Можно добавить более строгую валидацию телефона, если нужно
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
    example: 'Ведущий поставщик инновационных решений.',
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
