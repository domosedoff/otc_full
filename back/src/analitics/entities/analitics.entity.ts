// backend/src/analitics/entities/analitics.entity.ts
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

@Entity('analitics') // <-- УБЕДИСЬ, ЧТО ЭТОТ ДЕКОРАТОР ПРИСУТСТВУЕТ
export class Analitics {
  @PrimaryGeneratedColumn('uuid')
  analitics_id: string;

  @Column({ type: 'bigint', default: 0 })
  page_views: number;

  @Column({ type: 'bigint', default: 0 })
  external_link_clicks: number;

  @OneToOne(() => Emitter, (emitter) => emitter.analitics, {
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
