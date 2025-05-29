// backend/src/auth/auth.controller.ts
import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterEmitterDto } from './dto/register-emitter.dto';
import { LoginEmitterDto } from './dto/login-emitter.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { EmitterAuthResponseDto } from './dto/emitter-auth-response.dto';
import { AdminAuthResponseDto } from './dto/admin-auth-response.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('emitter/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Регистрация нового эмитента' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Эмитент успешно зарегистрирован',
    type: EmitterAuthResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Эмитент с таким email/названием/ИНН/ОГРН уже существует',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Некорректные данные запроса',
  })
  async registerEmitter(
    @Body() registerEmitterDto: RegisterEmitterDto,
  ): Promise<EmitterAuthResponseDto> {
    const result = await this.authService.register(registerEmitterDto);
    return { message: 'Эмитент успешно зарегистрирован', ...result };
  }

  @Post('emitter/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Вход эмитента в систему' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Вход выполнен успешно',
    type: EmitterAuthResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Неверный email или пароль',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Некорректные данные запроса',
  })
  async loginEmitter(
    @Body() loginEmitterDto: LoginEmitterDto,
  ): Promise<EmitterAuthResponseDto> {
    const result = await this.authService.login(loginEmitterDto);
    return { message: 'Вход выполнен успешно', ...result };
  }

  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Вход администратора в систему' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Вход администратора выполнен успешно',
    type: AdminAuthResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Неверное имя пользователя или пароль',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Некорректные данные запроса',
  })
  async loginAdmin(
    @Body() loginAdminDto: LoginAdminDto,
  ): Promise<AdminAuthResponseDto> {
    const result = await this.authService.loginAdmin(loginAdminDto);
    return { message: 'Вход администратора выполнен успешно', ...result };
  }
}
