// backend/src/subscriptions/subscriptions.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { SubscriptionResponseDto } from '@app/subscribes/dto/subscription-response.dto';
import { ActivateSubscriptionDto } from '@app/subscribes/dto/activate-subscription.dto';
import { SubscribesService } from '@app/subscribes/subscribes.service';

interface AuthenticatedEmitterRequest extends Request {
  user: {
    emitent_id: string;
    email: string;
    name: string;
    role: 'emitter';
  };
}

@ApiTags('Subscriptions')
// @ApiBearerAuth() // <-- УБРАНО: Этот декоратор теперь будет только над защищенными методами
@Controller('subscriptions')
// @UseGuards(AuthGuard('jwt')) // <-- УБРАНО: Защита теперь будет только над защищенными методами
export class SubscriptionsController {
  constructor(private readonly subscribesService: SubscribesService) {}

  @Get('tariffs') // GET /subscriptions/tariffs - теперь публичный
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Получить информацию о тарифах размещения' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Информация о тарифах успешно получена',
  })
  // @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Неавторизованный доступ' }) // <-- УБРАНО
  getTariffs() {
    return this.subscribesService.getTariffInfo();
  }

  @Post('activate') // POST /subscriptions/activate - защищенный
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Активировать/продлить подписку эмитента' })
  @ApiBearerAuth() // <-- ДОБАВЛЕНО: Указываем, что этот метод требует Bearer токен
  @UseGuards(AuthGuard('jwt')) // <-- ДОБАВЛЕНО: Защищаем только этот метод
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Подписка успешно активирована',
    type: SubscriptionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Некорректные данные запроса',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Неавторизованный доступ',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Эмитент не найден',
  })
  async activateSubscription(
    @Req() req: AuthenticatedEmitterRequest,
    @Body() activateDto: ActivateSubscriptionDto,
  ): Promise<SubscriptionResponseDto> {
    const emitentId = req.user.emitent_id;
    const subscription = await this.subscribesService.activateSubscription(
      emitentId,
      activateDto,
    );
    return { message: 'Подписка успешно активирована.', subscription };
  }
}
