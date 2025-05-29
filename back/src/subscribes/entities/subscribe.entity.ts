// backend/src/subscribes/entities/subscribe.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Emitter } from '../../emitters/entities/emitter.entity'; // Импортируем Emitter
import { Payment } from '@app/payments/entities/payment.entity';
// import { Payment } from '../../payments/entities/payment.entity'; // Импортируем Payment (создадим позже)

@Entity('subscribes')
export class Subscribe {
  @PrimaryGeneratedColumn('uuid')
  subscribe_id: string;

  @ManyToOne(() => Emitter, (emitter) => emitter.subscribes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'emitent_id' })
  emitter: Emitter;

  @Column({ type: 'uuid' })
  emitent_id: string; // Внешний ключ к Emitter

  // Связь с тарифом не нужна, если тариф - константа.
  // Но если мы хотим сохранить название тарифа/длительность в подписке,
  // можно добавить поля name, duration_days, price напрямую.
  @Column({ type: 'varchar', length: 255 })
  tariff_name: string; // Название тарифа (например, "Размещение на X дней")

  @Column({ type: 'int' })
  duration_days: number; // Длительность подписки в днях

  @OneToOne(() => Payment, (payment) => payment.subscribe, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'payment_id' })
  payment: Payment;

  @Column({ type: 'uuid', unique: true })
  payment_id: string; // Внешний ключ к Payment

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date' })
  end_date: Date;

  @Column({ type: 'enum', enum: ['active', 'disable'], default: 'active' })
  payment_status: 'active' | 'disable'; // Статус подписки (активна/отключена)

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  payment_amount: number; // Сумма платежа

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
