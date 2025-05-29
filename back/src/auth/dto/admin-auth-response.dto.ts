// backend/src/auth/dto/admin-auth-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Admin } from '../../admin/entities/admin.entity'; // <-- ПРОВЕРЕННЫЙ ПУТЬ

export type AdminDataInResponse = Omit<
  Admin,
  'password' | 'created_at' | 'updated_at'
>;

export class AdminAuthResponseDto {
  // <-- Убедись, что есть 'export'
  @ApiProperty({
    example: 'Admin login successful',
    description: 'Сообщение о результате операции',
  })
  message: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1Ni...',
    description: 'JWT токен доступа',
  })
  accessToken: string;

  @ApiProperty({
    type: () => Admin,
    description: 'Данные аутентифицированного администратора',
  })
  admin: AdminDataInResponse;
}
