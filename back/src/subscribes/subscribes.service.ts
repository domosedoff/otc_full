// back/src/subscribes/subscribes.service.ts
import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
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
    @Inject(forwardRef(() => EmittersService))
    private readonly emittersService: EmittersService,
    private readonly paymentsService: PaymentsService,
  ) {}

  getTariffInfo(): {
    id: string;
    name: string;
    description: string;
    price: number;
    duration_days: number;
  } {
    return {
      id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', // Фиксированный ID для единственного тарифа
      name: 'Базовое размещение',
      description: 'Размещение вашей компании на платформе.',
      price: 100, // 100 руб. за день
      duration_days: 1, // По умолчанию 1 день для отображения.
    };
  }

  async activateSubscription(
    emitentId: string,
    activateDto: ActivateSubscriptionDto,
  ): Promise<Subscribe> {
    // --- ИСПРАВЛЕНИЕ ЗДЕСЬ: Убрали 'tariffId' из деструктуризации ---
    const { duration_days } = activateDto;
    // --- КОНЕЦ ИСПРАВЛЕНИЯ ---

    const pricePerDay = 100; // Хардкодим цену за день для логики активации

    const emitter = await this.emittersService.findById(emitentId);
    if (!emitter) {
      throw new NotFoundException('Эмитент не найден.');
    }

    const amount = duration_days * pricePerDay;

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
