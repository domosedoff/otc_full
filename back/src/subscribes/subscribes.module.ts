// backend/src/subscribes/subscribes.module.ts
import { Module, forwardRef } from '@nestjs/common'; // <-- Убедись, что forwardRef импортирован
import { SubscribesService } from './subscribes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscribe } from './entities/subscribe.entity';
import { EmittersModule } from '../emitters/emitters.module';
import { PaymentsModule } from '../payments/payments.module';
import { SubscriptionsController } from '@app/subscriptions/subscriptions.controller';
// import { SubscriptionsController } from './subscriptions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscribe]),
    forwardRef(() => EmittersModule), // <-- ИСПРАВЛЕНИЕ: Убедись, что EmittersModule импортирован с forwardRef
    PaymentsModule, // PaymentsModule не имеет циклической зависимости с SubscribesModule, поэтому forwardRef здесь не нужен
  ],
  controllers: [SubscriptionsController],
  providers: [SubscribesService],
  exports: [SubscribesService],
})
export class SubscribesModule {}
