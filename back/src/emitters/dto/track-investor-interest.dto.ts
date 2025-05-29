// backend/src/investors/dto/track-investor-interest.dto.ts
import { IsString, IsEmail, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TrackInvestorInterestDto {
  @ApiProperty({ example: 'Иван Иванов', description: 'Имя инвестора' })
  @IsString({ message: 'Имя должно быть строкой' })
  @MaxLength(255, { message: 'Имя не должно превышать 255 символов' })
  name: string;

  @ApiProperty({
    example: 'investor@example.com',
    description: 'Email инвестора',
  })
  @IsEmail({}, { message: 'Некорректный формат email' })
  @MaxLength(255, { message: 'Email не должен превышать 255 символов' })
  email: string;

  @ApiPropertyOptional({
    example: '+79991234567',
    description: 'Телефон инвестора',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Телефон должен быть строкой' })
  @MaxLength(20, { message: 'Телефон не должен превышать 20 символов' })
  phone?: string;
}
