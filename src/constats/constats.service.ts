import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationInput } from 'src/common/dtos/paginationInput.dto';
import { Constat, ConstatStatus } from './entities/constat.entity';
import { Repository } from 'typeorm';
import { PaginatedConstats } from './dtos/outputs/constats.output';
import { ConstatStatusOutput } from './dtos/outputs/constat-status.output';
import { ConstatSession } from './types/constat-session.type';

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

  async finalizeFromSession(session: ConstatSession): Promise<Constat> {
    const constat = this.constatRepo.create({
      driverAId: session.driverAId,
      driverBId: session.driverBId,
      dateTime: session.draft.dateTime
        ? new Date(session.draft.dateTime)
        : new Date(),
      location: session.draft.location ?? '',
      injuredCount: session.draft.injuredCount ?? 0,
      constatVehicles: session.draft.vehicles ?? [],
      circumstances: session.draft.circumstances ?? [],
      damages: session.draft.damages ?? [],
      observations: session.draft.observations ?? [],
      signatures: session.draft.signatures ?? [],
      status: ConstatStatus.SUBMITTED,
    });
    const saved = await this.constatRepo.save(constat);

    return saved;
  }

  checkStatusByVehicleIds(
    vehicleAId: string,
    vehicleBId: string,
  ): Promise<ConstatStatusOutput> {
    const statuses = Object.values(ConstatStatus);
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    return Promise.resolve({
      status: randomStatus as ConstatStatus,
      message: `Status for constat involving vehicles ${vehicleAId} and ${vehicleBId} is ${randomStatus}.`,
    });
  }
}
