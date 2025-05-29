// backend/src/auth/dto/login-admin.dto.ts
import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsEmail,
} from 'class-validator'; // <-- ИСПРАВЛЕНИЕ: Добавлены IsOptional, IsEmail
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'; // <-- ИСПРАВЛЕНИЕ: Добавлен ApiPropertyOptional

export class LoginAdminDto {
  @ApiPropertyOptional({
    example: 'admin_user',
    description:
      'Имя пользователя администратора (обязательно, если email не указан)',
    required: false,
  })
  @IsOptional() // <-- ИСПРАВЛЕНИЕ: Добавлен IsOptional
  @IsString({ message: 'Имя пользователя должно быть строкой' })
  @MinLength(3, {
    message: 'Имя пользователя должно содержать хотя бы 3 символа',
  })
  @MaxLength(50, {
    message: 'Имя пользователя не должно превышать 50 символов',
  })
  username?: string; // <-- ИСПРАВЛЕНИЕ: Сделано опциональным

  @ApiPropertyOptional({
    example: 'admin@example.com',
    description:
      'Email администратора (обязательно, если имя пользователя не указано)',
    required: false,
  })
  @IsOptional() // <-- ИСПРАВЛЕНИЕ: Добавлен IsOptional
  @IsEmail({}, { message: 'Некорректный формат email' }) // <-- ИСПРАВЛЕНИЕ: Добавлен IsEmail
  @MaxLength(255, { message: 'Email не должен превышать 255 символов' })
  email?: string; // <-- ИСПРАВЛЕНИЕ: Добавлено поле email

  @ApiProperty({
    example: 'admin_password',
    description: 'Пароль администратора',
  })
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(8, { message: 'Пароль должен содержать хотя бы 8 символов' })
  password: string;
}
