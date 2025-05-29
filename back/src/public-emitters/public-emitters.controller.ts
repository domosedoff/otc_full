// backend/src/public-emitters/public-emitters.controller.ts
import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager'; // <-- ИСПРАВЛЕНИЕ: Импорт из @nestjs/cache-manager
import { EmittersService } from '../emitters/emitters.service';
import { InvestorsService } from '../investors/investors.service';
import { AnaliticsService } from '../analitics/analitics.service';
import { GetPublicEmittersFilterDto } from '../emitters/dto/get-public-emitters-filter.dto';
import { PublicEmittersListDto } from '../emitters/dto/public-emitters-list.dto';
import { PublicEmitterDetailsDto } from '../emitters/dto/public-emitter-details.dto';
// import { TrackInvestorInterestDto } from '../investors/dto/track-investor-interest.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TrackInvestorInterestDto } from '@app/emitters/dto/track-investor-interest.dto';

@ApiTags('Public Emitters')
@Controller('emitters')
export class PublicEmittersController {
  constructor(
    private readonly emittersService: EmittersService,
    private readonly investorsService: InvestorsService,
    private readonly analiticsService: AnaliticsService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Получить список публичных эмитентов (для скринера)',
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
  @ApiQuery({
    name: 'sortBy',
    type: String,
    required: false,
    description:
      'Поле для сортировки (market_cap, stock_price, trading_volume, name, created_at)',
  })
  @ApiQuery({
    name: 'order',
    type: String,
    required: false,
    description: 'Порядок сортировки (ASC, DESC)',
  })
  @ApiQuery({
    name: 'ticker',
    type: String,
    required: false,
    description: 'Поиск по тикеру',
  })
  @ApiQuery({
    name: 'company_name',
    type: String,
    required: false,
    description: 'Поиск по названию компании',
  })
  @ApiQuery({
    name: 'market',
    type: String,
    required: false,
    description: 'Фильтр по типу рынка',
  })
  @ApiQuery({
    name: 'industry',
    type: String,
    required: false,
    description: 'Фильтр по отрасли',
  })
  @ApiQuery({
    name: 'min_market_cap',
    type: Number,
    required: false,
    description: 'Минимальная рыночная капитализация',
  })
  @ApiQuery({
    name: 'max_market_cap',
    type: Number,
    required: false,
    description: 'Максимальная рыночная капитализация',
  })
  @ApiQuery({
    name: 'min_stock_price',
    type: Number,
    required: false,
    description: 'Минимальная цена акции',
  })
  @ApiQuery({
    name: 'max_stock_price',
    type: Number,
    required: false,
    description: 'Максимальная цена акции',
  })
  @ApiQuery({
    name: 'min_trading_volume',
    type: Number,
    required: false,
    description: 'Минимальный объем торгов',
  })
  @ApiQuery({
    name: 'max_trading_volume',
    type: Number,
    required: false,
    description: 'Максимальный объем торгов',
  })
  @ApiQuery({
    name: 'has_dividends',
    type: Boolean,
    required: false,
    description: 'Наличие дивидендов',
  })
  @ApiQuery({
    name: 'rating',
    type: String,
    required: false,
    description: 'Рейтинг компании',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Список эмитентов успешно получен',
    type: PublicEmittersListDto,
  })
  @UseInterceptors(CacheInterceptor)
  @CacheKey('public_emitters_list')
  async getPublicEmitters(
    @Query() filterDto: GetPublicEmittersFilterDto,
  ): Promise<PublicEmittersListDto> {
    console.log('Fetching public emitters from DB (or cache miss)');
    return this.emittersService.getPublicEmitters(filterDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Получить детальную информацию о публичном эмитенте',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Детальная информация об эмитенте успешно получена',
    type: PublicEmitterDetailsDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Эмитент не найден или не утвержден',
  })
  @UseInterceptors(CacheInterceptor)
  @CacheKey('public_emitter_details')
  async getPublicEmitterDetails(
    @Param('id') id: string,
  ): Promise<PublicEmitterDetailsDto | null> {
    console.log(
      `Fetching public emitter details for ${id} from DB (or cache miss)`,
    );
    const details = await this.emittersService.getPublicEmitterDetails(id);
    if (!details) {
      throw new BadRequestException('Эмитент не найден или не утвержден.');
    }
    return details;
  }

  @Post(':id/track-interest')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Зафиксировать интерес инвестора к эмитенту' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Интерес успешно зафиксирован',
    type: Object,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Некорректные данные',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Эмитент не найден',
  })
  async trackInvestorInterest(
    @Param('id') id: string,
    @Body() trackInvestorInterestDto: TrackInvestorInterestDto,
  ): Promise<{ message: string }> {
    const emitter = await this.emittersService.findById(id);
    if (!emitter) {
      throw new BadRequestException('Эмитент не найден.');
    }

    await this.investorsService.createInvestorInterest(
      trackInvestorInterestDto,
    );
    await this.analiticsService.incrementExternalLinkClicks(id);

    return { message: 'Интерес инвестора успешно зафиксирован.' };
  }
}
