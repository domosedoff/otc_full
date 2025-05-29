// backend/src/investors/entities/investor.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('investors')
export class Investor {
  @PrimaryGeneratedColumn('uuid')
  investor_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true }) // <-- ИСПРАВЛЕНИЕ: nullable: true
  phone: string | null; // <-- ИСПРАВЛЕНИЕ: Добавлено | null

  @Column({ type: 'varchar', length: 50, default: 'investor' })
  role: string;

  @CreateDateColumn()
  created_at: Date;
}
