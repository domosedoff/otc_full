// backend/src/subscriptions/subscriptions.module.ts
import { Module } from '@nestjs/common';
// import { SubscribesService } from './subscribes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { Subscribe } from './entities/subscribe.entity';
import { EmittersModule } from '../emitters/emitters.module';
import { PaymentsModule } from '../payments/payments.module';
import { SubscriptionsController } from './subscriptions.controller'; // <-- Убедись, что импорт есть и не закомментирован
import { SubscribesService } from '@app/subscribes/subscribes.service';
import { Subscribe } from '@app/subscribes/entities/subscribe.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscribe]),
    EmittersModule,
    PaymentsModule,
  ],
  controllers: [SubscriptionsController], // <-- Убедись, что контроллер здесь
  providers: [SubscribesService],
  exports: [SubscribesService],
})
export class SubscribesModule {}
