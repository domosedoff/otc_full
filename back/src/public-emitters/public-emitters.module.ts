// backend/src/public-emitters/public-emitters.module.ts
import { Module } from '@nestjs/common';
import { PublicEmittersController } from './public-emitters.controller';
import { EmittersModule } from '../emitters/emitters.module'; // Импортируем EmittersModule
import { InvestorsModule } from '../investors/investors.module'; // Импортируем InvestorsModule
import { AnaliticsModule } from '../analitics/analitics.module'; // Импортируем AnaliticsModule
import { FinancialDataModule } from '../financial-data/financial-data.module'; // Импортируем FinancialDataModule

@Module({
  imports: [
    EmittersModule, // Для EmittersService
    InvestorsModule, // Для InvestorsService
    AnaliticsModule, // Для AnaliticsService
    FinancialDataModule, // Для FinancialDataService (если понадобится напрямую)
  ],
  controllers: [PublicEmittersController],
  providers: [], // Сервисы импортируются из других модулей
})
export class PublicEmittersModule {}
