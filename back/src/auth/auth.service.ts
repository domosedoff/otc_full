// backend/src/auth/auth.service.ts
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmittersService } from '../emitters/emitters.service';
import { AdminService } from '../admin/admin.service';
import { RegisterEmitterDto } from './dto/register-emitter.dto';
import { LoginEmitterDto } from './dto/login-emitter.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import * as bcrypt from 'bcrypt';
import { Emitter } from '../emitters/entities/emitter.entity';
import { Admin } from '../admin/entities/admin.entity';
import { EmitterDataInResponse } from './dto/emitter-auth-response.dto';
import { AdminDataInResponse } from './dto/admin-auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly emittersService: EmittersService,
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  private async validatePassword(
    password: string,
    storedPasswordHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, storedPasswordHash);
  }

  private sanitizeEmitterData(emitter: Emitter): EmitterDataInResponse {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = emitter;
    return result as EmitterDataInResponse;
  }

  private sanitizeAdminData(admin: Admin): AdminDataInResponse {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = admin;
    return result as AdminDataInResponse;
  }

  async register(
    registerEmitterDto: RegisterEmitterDto,
  ): Promise<{ accessToken: string; emitter: EmitterDataInResponse }> {
    const { email, password, name, ...restOfDto } = registerEmitterDto;

    const existingByEmail = await this.emittersService.findByEmail(email);
    if (existingByEmail) {
      throw new ConflictException(`Эмитент с email ${email} уже существует`);
    }
    const existingByName = await this.emittersService.findByName(name);
    if (existingByName) {
      throw new ConflictException(
        `Эмитент с названием "${name}" уже существует`,
      );
    }

    if (restOfDto.inn) {
      const existingByInn = await this.emittersService.findByInn(restOfDto.inn);
      if (existingByInn) {
        throw new ConflictException(
          `Эмитент с ИНН ${restOfDto.inn} уже существует`,
        );
      }
    }
    if (restOfDto.ogrn_ogrnip) {
      const existingByOgrn = await this.emittersService.findByOgrn(
        restOfDto.ogrn_ogrnip,
      );
      if (existingByOgrn) {
        throw new ConflictException(
          `Эмитент с ОГРН/ОГРНИП ${restOfDto.ogrn_ogrnip} уже существует`,
        );
      }
    }

    const hashedPassword = await this.hashPassword(password);

    try {
      const newEmitterEntityData = {
        ...restOfDto,
        name,
        email,
        password: hashedPassword,
      };
      const createdEmitter = await this.emittersService.create(
        newEmitterEntityData as Partial<Emitter>,
      );

      const payload = {
        sub: createdEmitter.emitent_id,
        email: createdEmitter.email,
        name: createdEmitter.name,
        role: 'emitter',
      };
      const accessToken = this.jwtService.sign(payload);

      return {
        accessToken,
        emitter: this.sanitizeEmitterData(createdEmitter),
      };
    } catch (error) {
      console.error('Error during emitter registration:', error);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Ошибка при регистрации эмитента. Пожалуйста, попробуйте позже.',
      );
    }
  }

  async login(
    loginEmitterDto: LoginEmitterDto,
  ): Promise<{ accessToken: string; emitter: EmitterDataInResponse }> {
    const { email, password } = loginEmitterDto;
    const emitter = await this.emittersService.findByEmail(email);

    if (!emitter) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const isPasswordMatching = await this.validatePassword(
      password,
      emitter.password,
    );
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const payload = {
      sub: emitter.emitent_id,
      email: emitter.email,
      name: emitter.name,
      role: 'emitter',
    };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      emitter: this.sanitizeEmitterData(emitter),
    };
  }

  async loginAdmin(
    loginAdminDto: LoginAdminDto,
  ): Promise<{ accessToken: string; admin: AdminDataInResponse }> {
    const { username, email, password } = loginAdminDto; // Теперь email будет доступен

    if (!username && !email) {
      throw new BadRequestException(
        'Необходимо указать имя пользователя или email',
      );
    }

    let admin: Admin | null = null;
    if (username) {
      admin = await this.adminService.findByUsername(username);
    } else if (email) {
      admin = await this.adminService.findByEmail(email);
    }

    if (!admin) {
      throw new UnauthorizedException(
        'Неверное имя пользователя/email или пароль',
      );
    }

    const isPasswordMatching = await this.validatePassword(
      password,
      admin.password,
    );
    if (!isPasswordMatching) {
      throw new UnauthorizedException(
        'Неверное имя пользователя/email или пароль',
      );
    }

    const payload = {
      sub: admin.admin_id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      admin: this.sanitizeAdminData(admin),
    };
  }

  async validateUserById(
    id: string,
    role: 'emitter' | 'admin',
  ): Promise<Emitter | Admin | null> {
    if (role === 'emitter') {
      return this.emittersService.findById(id);
    } else if (role === 'admin') {
      return this.adminService.findById(id);
    }
    return null;
  }
}
