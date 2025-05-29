// backend/src/auth/dto/emitter-auth-response.dto.ts
// import { ApiProperty } from '@nestjs/swagger';
import { Emitter } from '../../emitters/entities/emitter.entity'; // Предполагаем, что Emitter будет экспортирован

// Вспомогательный тип для данных эмитента в ответе (без пароля)
export type EmitterDataInResponse = Omit<
  Emitter,
  | 'password'
  | 'ogrn_ogrnip'
  | 'legal_address'
  | 'actual_address'
  | 'phone'
  | 'website'
  | 'description'
  | 'logo_url'
  | 'inn'
> & {
  // Можно добавить сюда специфичные поля, если нужно
};

export class EmitterAuthResponseDto {
  // @ApiProperty({ example: 'Login successful', description: 'Сообщение о результате операции' })
  message: string;

  // @ApiProperty({ example: 'eyJhbGciOiJIUzI1Ni...', description: 'JWT токен доступа' })
  accessToken: string;

  // @ApiProperty({ type: () => Emitter, description: 'Данные аутентифицированного эмитента (частичные)'})
  emitter: EmitterDataInResponse; // Используем Omit для исключения пароля и других ненужных полей
}
