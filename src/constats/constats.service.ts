import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationInput } from 'src/common/dtos/paginationInput.dto';
import { Constat } from './entities/constat.entity';
import { Repository } from 'typeorm';
import { PaginatedConstats } from './dtos/outputs/constats.output';

@Injectable()
export class ConstatsService {
  constructor(
    @InjectRepository(Constat)
    private readonly constatRepo: Repository<Constat>,
  ) {}
  async getMany({ page = 1, limit = 10 }: PaginationInput, userId: string) {
    const [data, total] = await this.constatRepo.findAndCount({
      where: [{ driverAId: userId }, { driverBId: userId }],
      skip: (page - 1) * limit,
      take: limit,
    });
    return new PaginatedConstats(data, total, page, limit);
  }

  async createSesion() {}
}
