// backend/src/financial-data/entities/financial-data.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Emitter } from '../../emitters/entities/emitter.entity';

@Entity('financial_data') // <-- УБЕДИСЬ, ЧТО ЭТОТ ДЕКОРАТОР ПРИСУТСТВУЕТ
export class FinancialData {
  @PrimaryGeneratedColumn('uuid')
  financial_data_id: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  ticker: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  company_name: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  market: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  industry: string;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  market_cap: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  stock_price: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  trading_volume: number;

  @Column({ type: 'boolean', default: false })
  has_dividends: boolean;

  @Column({ type: 'varchar', length: 1, nullable: true })
  rating: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  company_status: string;

  @OneToOne(() => Emitter, (emitter) => emitter.financialData, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'emitent_id' })
  emitter: Emitter;

  @Column({ type: 'uuid', unique: true })
  emitent_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
