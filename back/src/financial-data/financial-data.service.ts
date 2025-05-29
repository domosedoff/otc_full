// backend/src/financial-data/financial-data.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinancialData } from './entities/financial-data.entity';

@Injectable()
export class FinancialDataService {
  constructor(
    @InjectRepository(FinancialData)
    private readonly financialDataRepository: Repository<FinancialData>,
  ) {}

  // НОВЫЙ МЕТОД: Создание начальной записи финансовых данных для нового эмитента
  async createInitialFinancialData(emitentId: string): Promise<FinancialData> {
    const newFinancialData = this.financialDataRepository.create({
      emitent_id: emitentId,
      // Можно установить начальные значения по умолчанию, если они отличаются от БД
      has_dividends: false,
      company_status: 'Неактивна', // Начальный публичный статус
    });
    return this.financialDataRepository.save(newFinancialData);
  }

  // Методы для обновления финансовых данных эмитентом будут добавлены позже
}
