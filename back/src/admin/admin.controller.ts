// backend/src/admin/admin.controller.ts
import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
  BadRequestException,
} from '@nestjs/common'; // <-- Убран Post
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { GetEmittersFilterDto } from './dto/get-emitters-filter.dto';
import { UpdateEmitterStatusDto } from './dto/update-emitter-status.dto';
import { Emitter } from '../emitters/entities/emitter.entity';

// Определяем тип для пользователя, который будет в req.user после аутентификации
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface AuthenticatedAdminRequest extends Request {
  // <-- Добавлен eslint-disable-next-line
  user: {
    admin_id: string;
    username: string;
    email?: string;
    role: 'admin';
  };
}

@ApiTags('Admin Panel')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(AuthGuard('jwt'))
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('emitters')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Получить список эмитентов (для администратора)' })
  @ApiQuery({
    name: 'status',
    enum: ['pending', 'approved', 'rejected'],
    required: false,
    description: 'Фильтр по статусу эмитента',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Номер страницы (по умолчанию 1)',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Количество записей на странице (по умолчанию 20)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Список эмитентов успешно получен',
    type: [Emitter],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Неавторизованный доступ',
  })
  async getEmitters(@Query() filterDto: GetEmittersFilterDto) {
    return this.adminService.getEmitters(filterDto);
  }

  @Get('emitters/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Получить детали эмитента по ID (для администратора)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Детали эмитента успешно получены',
    type: Emitter,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Эмитент не найден',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Неавторизованный доступ',
  })
  async getEmitterDetails(@Param('id') id: string): Promise<Emitter | null> {
    const emitter = await this.adminService.getEmitterDetails(id);
    if (!emitter) {
      throw new BadRequestException('Эмитент не найден.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = emitter;
    return result as Emitter;
  }

  @Patch('emitters/:id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Обновить статус эмитента (утвердить/отклонить)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Статус эмитента успешно обновлен',
    type: Emitter,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Некорректные данные или причина отклонения отсутствует',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Неавторизованный доступ',
  })
  async updateEmitterStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateEmitterStatusDto,
  ): Promise<Emitter> {
    const { status, reason } = updateStatusDto;
    const updatedEmitter = await this.adminService.updateEmitterStatus(
      id,
      status,
      reason,
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = updatedEmitter;
    return result as Emitter;
  }
}
