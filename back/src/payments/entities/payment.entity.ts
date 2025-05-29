// backend/src/payments/entities/payment.entity.ts
import { Subscribe } from '@app/subscribes/entities/subscribe.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
// import { Subscribe } from '../../subscribes/entities/subscribe.entity'; // Импортируем Subscribe

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  payment_id: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  date: Date; // Дата платежа

  @Column({
    type: 'enum',
    enum: ['pending', 'completed', 'failed', 'canceled', 'refunded'],
    default: 'pending',
  })
  status: 'pending' | 'completed' | 'failed' | 'canceled' | 'refunded'; // Статус платежа

  @OneToOne(() => Subscribe, (subscribe) => subscribe.payment)
  subscribe: Subscribe; // Связь OneToOne с подпиской

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
