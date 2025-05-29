// backend/src/financial-data/financial-data.module.ts
import { Module } from '@nestjs/common';
import { FinancialDataService } from './financial-data.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialData } from './entities/financial-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FinancialData])],
  providers: [FinancialDataService],
  exports: [FinancialDataService], // Экспортируем сервис, если понадобится
})
export class FinancialDataModule {}
