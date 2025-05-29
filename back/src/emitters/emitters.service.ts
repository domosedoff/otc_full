// backend/src/emitters/emitters.service.ts
import { Injectable, BadRequestException } from '@nestjs/common'; // Убраны NotFoundException, BadRequestException, если не используются
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Emitter } from './entities/emitter.entity';
import { GetPublicEmittersFilterDto } from './dto/get-public-emitters-filter.dto';
import { FinancialDataService } from '../financial-data/financial-data.service';
import { AnaliticsService } from '../analitics/analitics.service';
import { PublicEmitterSummary } from './dto/public-emitters-list.dto';
import { PublicEmitterDetailsDto } from './dto/public-emitter-details.dto';
import { SubscribesService } from '../subscribes/subscribes.service';
import { EmitterProfileDto } from './dto/emitter-profile.dto';
import { differenceInDays, isAfter, isSameDay } from 'date-fns'; // <-- ИСПРАВЛЕНИЕ: Добавлены isAfter, isSameDay

@Injectable()
export class EmittersService {
  constructor(
    @InjectRepository(Emitter)
    private readonly emittersRepository: Repository<Emitter>,
    private readonly financialDataService: FinancialDataService,
    private readonly analiticsService: AnaliticsService,
    private readonly subscribesService: SubscribesService,
  ) {}

  async findByEmail(email: string): Promise<Emitter | null> {
    return this.emittersRepository.findOne({ where: { email } });
  }

  async findByName(name: string): Promise<Emitter | null> {
    return this.emittersRepository.findOne({ where: { name } });
  }

  async findByInn(inn: string): Promise<Emitter | null> {
    if (!inn) return null;
    return this.emittersRepository.findOne({ where: { inn } });
  }

  async findByOgrn(ogrn_ogrnip: string): Promise<Emitter | null> {
    if (!ogrn_ogrnip) return null;
    return this.emittersRepository.findOne({ where: { ogrn_ogrnip } });
  }

  async findById(id: string): Promise<Emitter | null> {
    return this.emittersRepository.findOne({ where: { emitent_id: id } });
  }

  async create(emitterData: Partial<Emitter>): Promise<Emitter> {
    const newEmitter = this.emittersRepository.create(emitterData);
    const createdEmitter = await this.emittersRepository.save(newEmitter);

    await this.financialDataService.createInitialFinancialData(
      createdEmitter.emitent_id,
    );
    await this.analiticsService.createInitialAnalitics(
      createdEmitter.emitent_id,
    );

    return createdEmitter;
  }

  async update(id: string, updateData: Partial<Emitter>): Promise<Emitter> {
    const emitter = await this.emittersRepository.findOne({
      where: { emitent_id: id },
    });
    if (!emitter) {
      throw new BadRequestException('Эмитент не найден');
    }
    Object.assign(emitter, updateData);
    return this.emittersRepository.save(emitter);
  }

  async updateStatus(
    id: string,
    status: 'pending' | 'approved' | 'rejected',
    reason?: string,
  ): Promise<Emitter> {
    const emitter = await this.emittersRepository.findOne({
      where: { emitent_id: id },
    });
    if (!emitter) {
      throw new BadRequestException('Эмитент не найден.');
    }

    if (status === 'rejected' && !reason) {
      throw new BadRequestException(
        'Причина отклонения обязательна для статуса "rejected".',
      );
    }

    emitter.status = status;
    emitter.rejection_reason = status === 'rejected' ? reason || null : null;
    return this.emittersRepository.save(emitter);
  }

  async getPublicEmitters(filterDto: GetPublicEmittersFilterDto): Promise<{
    data: PublicEmitterSummary[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'market_cap',
      order = 'DESC',
      ticker,
      company_name,
      market,
      industry,
      min_market_cap,
      max_market_cap,
      min_stock_price,
      max_stock_price,
      min_trading_volume,
      max_trading_volume,
      has_dividends,
      rating,
    } = filterDto;

    const queryBuilder = this.emittersRepository.createQueryBuilder('emitter');

    queryBuilder.where('emitter.status = :status', { status: 'approved' });
    queryBuilder.leftJoinAndSelect('emitter.subscribes', 'subscribes');
    queryBuilder.andWhere('subscribes.payment_status = :activeStatus', {
      activeStatus: 'active',
    });
    queryBuilder.andWhere('subscribes.end_date >= :currentDate', {
      currentDate: new Date(),
    });

    queryBuilder.leftJoinAndSelect('emitter.financialData', 'financialData');

    if (ticker) {
      queryBuilder.andWhere('financialData.ticker ILIKE :ticker', {
        ticker: `%${ticker}%`,
      });
    }
    if (company_name) {
      queryBuilder.andWhere('emitter.name ILIKE :company_name', {
        company_name: `%${company_name}%`,
      });
    }
    if (market) {
      queryBuilder.andWhere('financialData.market = :market', { market });
    }
    if (industry) {
      queryBuilder.andWhere('financialData.industry = :industry', { industry });
    }
    if (min_market_cap !== undefined) {
      queryBuilder.andWhere('financialData.market_cap >= :min_market_cap', {
        min_market_cap,
      });
    }
    if (max_market_cap !== undefined) {
      queryBuilder.andWhere('financialData.market_cap <= :max_market_cap', {
        max_market_cap,
      });
    }
    if (min_stock_price !== undefined) {
      queryBuilder.andWhere('financialData.stock_price >= :min_stock_price', {
        min_stock_price,
      });
    }
    if (max_stock_price !== undefined) {
      queryBuilder.andWhere('financialData.stock_price <= :max_stock_price', {
        max_stock_price,
      });
    }
    if (min_trading_volume !== undefined) {
      queryBuilder.andWhere(
        'financialData.trading_volume >= :min_trading_volume',
        { min_trading_volume },
      );
    }
    if (max_trading_volume !== undefined) {
      queryBuilder.andWhere(
        'financialData.trading_volume <= :max_trading_volume',
        { max_trading_volume },
      );
    }
    if (has_dividends !== undefined) {
      queryBuilder.andWhere('financialData.has_dividends = :has_dividends', {
        has_dividends,
      });
    }
    if (rating) {
      queryBuilder.andWhere('financialData.rating = :rating', { rating });
    }

    let orderByField = `emitter.${sortBy}`;
    if (
      [
        'market_cap',
        'stock_price',
        'trading_volume',
        'has_dividends',
        'rating',
        'company_status',
        'ticker',
        'market',
        'industry',
      ].includes(sortBy)
    ) {
      orderByField = `financialData.${sortBy}`;
    }
    queryBuilder.orderBy(orderByField, order);

    const [emitters, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const data: PublicEmitterSummary[] = emitters.map((emitter) => ({
      emitent_id: emitter.emitent_id,
      name: emitter.name,
      description: emitter.description,
      logo_url: emitter.logo_url,
      ticker: emitter.financialData?.ticker,
      market: emitter.financialData?.market,
      industry: emitter.financialData?.industry,
      market_cap: emitter.financialData?.market_cap,
      stock_price: emitter.financialData?.stock_price,
      trading_volume: emitter.financialData?.trading_volume,
      has_dividends: emitter.financialData?.has_dividends,
      rating: emitter.financialData?.rating,
      company_status: emitter.financialData?.company_status,
    }));

    return { data, total, page, limit };
  }

  async getPublicEmitterDetails(
    id: string,
  ): Promise<PublicEmitterDetailsDto | null> {
    const emitter = await this.emittersRepository.findOne({
      where: { emitent_id: id, status: 'approved' },
      relations: ['financialData', 'analitics', 'subscribes'],
    });

    if (!emitter) {
      return null;
    }
    const currentSubscription =
      await this.subscribesService.getCurrentSubscription(emitter.emitent_id);
    if (
      !currentSubscription ||
      currentSubscription.payment_status !== 'active' ||
      currentSubscription.end_date < new Date()
    ) {
      return null;
    }

    await this.analiticsService.incrementPageViews(emitter.emitent_id);

    const details = new PublicEmitterDetailsDto();
    details.emitter = {
      emitent_id: emitter.emitent_id,
      name: emitter.name,
      description: emitter.description,
      logo_url: emitter.logo_url,
      ticker: emitter.financialData?.ticker,
      market: emitter.financialData?.market,
      industry: emitter.financialData?.industry,
      market_cap: emitter.financialData?.market_cap,
      stock_price: emitter.financialData?.stock_price,
      trading_volume: emitter.financialData?.trading_volume,
      has_dividends: emitter.financialData?.has_dividends,
      rating: emitter.financialData?.rating,
      company_status: emitter.financialData?.company_status,
    };

    return details;
  }

  async getEmitterProfile(
    emitentId: string,
  ): Promise<EmitterProfileDto | null> {
    const emitter = await this.emittersRepository.findOne({
      where: { emitent_id: emitentId },
      relations: ['financialData', 'analitics', 'subscribes'],
    });

    if (!emitter) {
      return null;
    }

    const currentSubscription =
      await this.subscribesService.getCurrentSubscription(emitentId);
    const today = new Date();

    const profile: EmitterProfileDto = {
      emitent_id: emitter.emitent_id,
      name: emitter.name,
      email: emitter.email,
      inn: emitter.inn,
      ogrn_ogrnip: emitter.ogrn_ogrnip,
      legal_address: emitter.legal_address,
      actual_address: emitter.actual_address,
      phone: emitter.phone,
      website: emitter.website,
      description: emitter.description,
      logo_url: emitter.logo_url,
      status: emitter.status,
      rejection_reason: emitter.rejection_reason,
      created_at: emitter.created_at,
      updated_at: emitter.updated_at,
      subscription: currentSubscription
        ? {
            subscribe_id: currentSubscription.subscribe_id,
            tariff_name: currentSubscription.tariff_name,
            start_date: currentSubscription.start_date,
            end_date: currentSubscription.end_date,
            payment_status: currentSubscription.payment_status,
            days_remaining: differenceInDays(
              currentSubscription.end_date,
              today,
            ),
            is_active:
              currentSubscription.payment_status === 'active' &&
              (isAfter(currentSubscription.end_date, today) ||
                isSameDay(currentSubscription.end_date, today)), // <-- ИСПРАВЛЕНИЕ ЗДЕСЬ
          }
        : undefined,
      analitics: emitter.analitics
        ? {
            page_views: emitter.analitics.page_views,
            external_link_clicks: emitter.analitics.external_link_clicks,
          }
        : undefined,
    };

    return profile;
  }
}
