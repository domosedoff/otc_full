// backend/src/emitters/entities/emitter.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { FinancialData } from '../../financial-data/entities/financial-data.entity';
import { Analitics } from '../../analitics/entities/analitics.entity';
import { Subscribe } from '../../subscribes/entities/subscribe.entity'; // Импортируем Subscribe

@Entity('emitents')
export class Emitter {
  @PrimaryGeneratedColumn('uuid')
  emitent_id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 12, unique: true, nullable: true })
  inn: string;

  @Column({ type: 'varchar', length: 15, unique: true, nullable: true })
  ogrn_ogrnip: string;

  @Column({ type: 'text', nullable: true })
  legal_address: string;

  @Column({ type: 'text', nullable: true })
  actual_address: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logo_url: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  status: string;

  @Column({ type: 'text', nullable: true })
  rejection_reason: string | null;

  @OneToOne(() => FinancialData, (financialData) => financialData.emitter)
  financialData: FinancialData;

  @OneToOne(() => Analitics, (analitics) => analitics.emitter)
  analitics: Analitics;

  // НОВАЯ СВЯЗЬ: OneToMany с Subscribe
  @OneToMany(() => Subscribe, (subscribe) => subscribe.emitter)
  subscribes: Subscribe[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
