// backend/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmittersModule } from '../emitters/emitters.module';
import { AdminModule } from '../admin/admin.module'; // <-- НОВЫЙ ИМПОРТ: AdminModule
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const jwtSecret = configService.get<string>('JWT_SECRET');
        const jwtExpirationTime = configService.get<string>(
          'JWT_EXPIRATION_TIME',
        );

        if (!jwtSecret) {
          throw new Error(
            'JWT_SECRET is not defined in environment variables for JwtModule',
          );
        }
        if (!jwtExpirationTime) {
          throw new Error(
            'JWT_EXPIRATION_TIME is not defined in environment variables for JwtModule',
          );
        }

        return {
          secret: jwtSecret,
          signOptions: {
            expiresIn: jwtExpirationTime,
          },
        };
      },
      inject: [ConfigService],
    }),
    EmittersModule,
    AdminModule, // <-- НОВЫЙ ИМПОРТ: Добавляем AdminModule сюда
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
