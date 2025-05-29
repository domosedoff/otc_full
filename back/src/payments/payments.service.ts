// backend/src/payments/payments.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
  ) {}

  // Метод для создания платежа
  async createPayment(paymentData: Partial<Payment>): Promise<Payment> {
    const newPayment = this.paymentsRepository.create(paymentData);
    return this.paymentsRepository.save(newPayment);
  }

  // Другие методы для работы с платежами будут добавлены позже
}
