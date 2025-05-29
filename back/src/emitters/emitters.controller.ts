// backend/src/emitters/emitters.controller.ts
import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Req,
  HttpStatus,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { EmittersService } from './emitters.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Emitter } from './entities/emitter.entity';
import { UpdateEmitterProfileDto } from './dto/update-emitter-profile.dto';
import { EmitterProfileDto } from './dto/emitter-profile.dto'; // <-- Импортируем EmitterProfileDto

interface AuthenticatedEmitterRequest extends Request {
  user: {
    emitent_id: string;
    email: string;
    name: string;
    role: 'emitter';
  };
}

@ApiTags('Emitter Profile')
@ApiBearerAuth()
@Controller('profile/emitter')
@UseGuards(AuthGuard('jwt'))
export class EmittersController {
  constructor(private readonly emittersService: EmittersService) {}

  @Get() // GET /profile/emitter
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Получить профиль текущего аутентифицированного эмитента',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Профиль эмитента успешно получен',
    type: EmitterProfileDto,
  }) // <-- ИСПРАВЛЕНИЕ: тип ответа
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Неавторизованный доступ',
  })
  async getMyProfile(
    @Req() req: AuthenticatedEmitterRequest,
  ): Promise<EmitterProfileDto> {
    // <-- ИСПРАВЛЕНИЕ: тип возврата
    const emitterId = req.user.emitent_id;
    const profile = await this.emittersService.getEmitterProfile(emitterId); // <-- ИСПРАВЛЕНИЕ: используем новый метод
    if (!profile) {
      throw new UnauthorizedException('Профиль эмитента не найден.');
    }
    return profile;
  }

  @Put() // PUT /profile/emitter
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Обновить профиль текущего аутентифицированного эмитента',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Профиль эмитента успешно обновлен',
    type: Emitter,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Некорректные данные запроса',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Неавторизованный доступ',
  })
  async updateMyProfile(
    @Req() req: AuthenticatedEmitterRequest,
    @Body() updateEmitterProfileDto: UpdateEmitterProfileDto,
  ): Promise<Emitter> {
    const emitterId = req.user.emitent_id;
    const updatedEmitter = await this.emittersService.update(
      emitterId,
      updateEmitterProfileDto,
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = updatedEmitter;
    return result as Emitter;
  }

  @Post('submit-for-review')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Отправить профиль эмитента на модерацию' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Профиль успешно отправлен на модерацию',
    type: Emitter,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Неавторизованный доступ',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Некорректные данные или профиль не готов к модерации',
  })
  async submitForReview(
    @Req() req: AuthenticatedEmitterRequest,
  ): Promise<Emitter> {
    const emitterId = req.user.emitent_id;
    const updatedEmitter = await this.emittersService.updateStatus(
      emitterId,
      'pending',
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = updatedEmitter;
    return result as Emitter;
  }
}
