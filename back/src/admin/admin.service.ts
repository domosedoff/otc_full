// backend/src/admin/admin.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { Emitter } from '../emitters/entities/emitter.entity';
import { GetEmittersFilterDto } from './dto/get-emitters-filter.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Emitter)
    private readonly emittersRepository: Repository<Emitter>,
  ) {}

  async findByUsername(username: string): Promise<Admin | null> {
    return this.adminRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<Admin | null> {
    return this.adminRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<Admin | null> {
    return this.adminRepository.findOne({ where: { admin_id: id } });
  }

  async create(adminData: Partial<Admin>): Promise<Admin> {
    const newAdmin = this.adminRepository.create(adminData);
    return this.adminRepository.save(newAdmin);
  }

  async getEmitters(
    filterDto: GetEmittersFilterDto,
  ): Promise<{ data: Emitter[]; total: number; page: number; limit: number }> {
    const { status, page = 1, limit = 20 } = filterDto;

    const queryBuilder = this.emittersRepository.createQueryBuilder('emitter');

    if (status) {
      queryBuilder.andWhere('emitter.status = :status', { status });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('emitter.created_at', 'DESC')
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async getEmitterDetails(id: string): Promise<Emitter | null> {
    return this.emittersRepository.findOne({ where: { emitent_id: id } });
  }

  async updateEmitterStatus(
    id: string,
    status: 'approved' | 'rejected',
    reason?: string,
  ): Promise<Emitter> {
    const emitter = await this.emittersRepository.findOne({
      where: { emitent_id: id },
    });
    if (!emitter) {
      throw new BadRequestException('Эмитент не найден.');
    }

    if (status === 'rejected' && !reason) {
      throw new BadRequestException(
        'Причина отклонения обязательна для статуса "rejected".',
      );
    }

    emitter.status = status;
    // Теперь rejection_reason может быть string | null, что соответствует типу в сущности
    emitter.rejection_reason = status === 'rejected' ? reason || null : null;
    return this.emittersRepository.save(emitter);
  }
}
