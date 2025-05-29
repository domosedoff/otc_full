// backend/src/analitics/analitics.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Analitics } from './entities/analitics.entity';

@Injectable()
export class AnaliticsService {
  constructor(
    @InjectRepository(Analitics)
    private readonly analiticsRepository: Repository<Analitics>,
  ) {}

  // НОВЫЙ МЕТОД: Создание начальной записи аналитики для нового эмитента
  async createInitialAnalitics(emitentId: string): Promise<Analitics> {
    const newAnalitics = this.analiticsRepository.create({
      emitent_id: emitentId,
      page_views: 0,
      external_link_clicks: 0,
    });
    return this.analiticsRepository.save(newAnalitics);
  }

  // НОВЫЙ МЕТОД: Инкремент просмотров страницы
  async incrementPageViews(emitentId: string): Promise<void> {
    await this.analiticsRepository.increment(
      { emitent_id: emitentId },
      'page_views',
      1,
    );
  }

  // НОВЫЙ МЕТОД: Инкремент кликов по внешней ссылке
  async incrementExternalLinkClicks(emitentId: string): Promise<void> {
    await this.analiticsRepository.increment(
      { emitent_id: emitentId },
      'external_link_clicks',
      1,
    );
  }
}
