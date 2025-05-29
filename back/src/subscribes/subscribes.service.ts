// backend/src/subscribes/subscribes.service.ts
import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common'; // <-- Убедись, что Inject и forwardRef импортированы
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscribe } from './entities/subscribe.entity';
import { EmittersService } from '../emitters/emitters.service';
import { PaymentsService } from '../payments/payments.service';
import { ActivateSubscriptionDto } from './dto/activate-subscription.dto';
import { addDays } from 'date-fns';

@Injectable()
export class SubscribesService {
  constructor(
    @InjectRepository(Subscribe)
    private readonly subscribesRepository: Repository<Subscribe>,
    @Inject(forwardRef(() => EmittersService)) // <-- ИСПРАВЛЕНИЕ: ДОБАВЛЕНО ЭТОТ ДЕКОРАТОР
    private readonly emittersService: EmittersService,
    private readonly paymentsService: PaymentsService,
  ) {}

  private readonly COST_PER_DAY = 1.0;

  getTariffInfo(): {
    name: string;
    description: string;
    price_per_day: number;
  } {
    return {
      name: 'Размещение на платформе',
      description: `Стоимость размещения составляет $${this.COST_PER_DAY.toFixed(2)} за один день.`,
      price_per_day: this.COST_PER_DAY,
    };
  }

  async activateSubscription(
    emitentId: string,
    activateDto: ActivateSubscriptionDto,
  ): Promise<Subscribe> {
    const { duration_days } = activateDto;
    const emitter = await this.emittersService.findById(emitentId);

    if (!emitter) {
      throw new NotFoundException('Эмитент не найден.');
    }

    const amount = duration_days * this.COST_PER_DAY;
    const today = new Date();
    let endDate = addDays(today, duration_days);

    const payment = await this.paymentsService.createPayment({
      amount,
      date: today,
      status: 'completed',
    });

    const existingActiveSubscription = await this.subscribesRepository.findOne({
      where: { emitent_id: emitentId, payment_status: 'active' },
      order: { end_date: 'DESC' },
    });

    let actualStartDate = today;
    if (
      existingActiveSubscription &&
      existingActiveSubscription.end_date > today
    ) {
      actualStartDate = addDays(existingActiveSubscription.end_date, 1);
      endDate = addDays(actualStartDate, duration_days);
    }

    const newSubscription = this.subscribesRepository.create({
      emitent_id: emitentId,
      tariff_name: `Размещение на ${duration_days} дней`,
      duration_days,
      payment_id: payment.payment_id,
      start_date: actualStartDate,
      end_date: endDate,
      payment_status: 'active',
      payment_amount: amount,
    });

    return this.subscribesRepository.save(newSubscription);
  }

  async getCurrentSubscription(emitentId: string): Promise<Subscribe | null> {
    const subscription = await this.subscribesRepository.findOne({
      where: { emitent_id: emitentId, payment_status: 'active' },
      order: { end_date: 'DESC' },
    });

    if (subscription && subscription.end_date < new Date()) {
      subscription.payment_status = 'disable';
      await this.subscribesRepository.save(subscription);
      return null;
    }

    return subscription;
  }
}
