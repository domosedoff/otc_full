// backend/src/analitics/analitics.module.ts
import { Module } from '@nestjs/common';
import { AnaliticsService } from './analitics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Analitics } from './entities/analitics.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Analitics])],
  providers: [AnaliticsService],
  exports: [AnaliticsService], // Экспортируем сервис, если понадобится
})
export class AnaliticsModule {}
