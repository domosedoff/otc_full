// backend/src/investors/investors.module.ts
import { Module } from '@nestjs/common';
import { InvestorsService } from './investors.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Investor } from './entities/investor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Investor])],
  providers: [InvestorsService],
  exports: [InvestorsService], // Экспортируем сервис, если понадобится
})
export class InvestorsModule {}
