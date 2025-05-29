// backend/src/emitters/emitters.module.ts
import { Module, forwardRef } from '@nestjs/common'; // <-- Убедись, что forwardRef импортирован
import { TypeOrmModule } from '@nestjs/typeorm';
import { Emitter } from './entities/emitter.entity';
import { EmittersService } from './emitters.service';
import { FinancialDataModule } from '../financial-data/financial-data.module';
import { AnaliticsModule } from '../analitics/analitics.module';
import { EmittersController } from './emitters.controller';
import { SubscribesModule } from '../subscribes/subscribes.module'; // <-- Импортируем SubscribesModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Emitter]),
    FinancialDataModule,
    AnaliticsModule,
    forwardRef(() => SubscribesModule), // <-- ИСПРАВЛЕНИЕ: Добавлен forwardRef
  ],
  controllers: [EmittersController],
  providers: [EmittersService],
  exports: [EmittersService],
})
export class EmittersModule {}
