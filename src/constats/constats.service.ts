import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationInput } from 'src/common/dtos/paginationInput.dto';
import { Constat, ConstatStatus } from './entities/constat.entity';
import { Repository } from 'typeorm';
import { PaginatedConstats } from './dtos/outputs/constats.output';
import { ConstatStatusOutput } from './dtos/outputs/constat-status.output';
import { ConstatSession } from './types/constat-session.type';
import { User } from 'src/user/entities/user.entity';
import { PaymentService } from 'src/payment/payment.service';

@Injectable()
export class ConstatsService {
  constructor(
    @InjectRepository(Constat)
    private readonly constatRepo: Repository<Constat>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly paymentService: PaymentService,
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

  // Initiate the payment to  our app ocming from the inssurance company for their user and credit the balance of the driverB
  async validateConstat(
    constatId: string,
    validatorId: string,
  ): Promise<Constat> {
    const constat = await this.constatRepo.findOne({
      where: { id: constatId },
    });
    if (!constat) {
      throw new NotFoundException('Constat not found');
    }

    const validator = await this.userRepo.findOne({
      where: { id: validatorId },
    });
    if (!validator) {
      throw new NotFoundException('Validator not found');
    }

    constat.status = ConstatStatus.VALIDATED;
    return this.constatRepo.save(constat);
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
