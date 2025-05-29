// backend/src/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { Emitter } from '../../emitters/entities/emitter.entity';
import { Admin } from '../../admin/entities/admin.entity';

export interface JwtPayload {
  sub: string;
  role: 'emitter' | 'admin';
  email?: string;
  username?: string;
  name?: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: JwtPayload) {
    if (payload.role !== 'emitter' && payload.role !== 'admin') {
      throw new UnauthorizedException(
        'Неизвестная роль пользователя в токене.',
      );
    }

    const user = await this.authService.validateUserById(
      payload.sub,
      payload.role,
    );

    if (!user) {
      throw new UnauthorizedException(
        'Пользователь не найден или токен недействителен',
      );
    }

    if (payload.role === 'emitter') {
      const emitter = user as Emitter;
      return {
        emitent_id: emitter.emitent_id,
        email: emitter.email,
        name: emitter.name,
        role: payload.role,
      };
    } else {
      // role === 'admin'
      const admin = user as Admin;
      return {
        admin_id: admin.admin_id,
        username: admin.username,
        email: admin.email, // Добавляем email для админа в возвращаемый объект
        role: payload.role,
      };
    }
  }
}
