// backend/src/auth/dto/login-emitter.dto.ts
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Убедись, что ApiProperty импортирован

export class LoginEmitterDto {
  @ApiProperty({
    example: 'emitter@example.com',
    description: 'Email эмитента',
  }) // <-- ИСПРАВЛЕНИЕ
  @IsEmail({}, { message: 'Некорректный формат email или пароль' })
  @MaxLength(255)
  email: string;

  @ApiProperty({ example: 'P@$$wOrd123', description: 'Пароль эмитента' }) // <-- ИСПРАВЛЕНИЕ
  @IsString()
  @MinLength(8, { message: 'Некорректный формат email или пароль' })
  password: string;
}
