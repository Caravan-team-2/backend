import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationInput } from 'src/common/dtos/paginationInput.dto';
import { Constat } from './entities/constat.entity';
import { Repository } from 'typeorm';
import { PaginatedConstats } from './dtos/outputs/constats.output';
import { CreateConstatInput } from './dtos/inputs/create-constat.input';
import {
  ConstatStatus,
  ConstatStatusOutput,
} from './dtos/outputs/constat-status.output';

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

  async create(
    createConstatInput: CreateConstatInput,
    driverAId: string,
  ): Promise<Constat> {
    const {
      constatVehicles,
      circumstancesA,
      circumstancesB,
      damagesA,
      damagesB,
      observationsA,
      observationsB,
      signaturesA,
      signaturesB,
      driverBId,
      ...rest
    } = createConstatInput;

    const circumstances = [
      ...circumstancesA.map((c) => ({ ...c, driverId: driverAId })),
      ...circumstancesB.map((c) => ({ ...c, driverId: driverBId })),
    ];
    const damages = [
      ...damagesA.map((d) => ({ ...d, driverId: driverAId })),
      ...damagesB.map((d) => ({ ...d, driverId: driverBId })),
    ];
    const observations = [
      ...observationsA.map((o) => ({ ...o, driverId: driverAId })),
      ...observationsB.map((o) => ({ ...o, driverId: driverBId })),
    ];
    const signatures = [
      ...signaturesA.map((s) => ({ ...s, driverId: driverAId })),
      ...signaturesB.map((s) => ({ ...s, driverId: driverBId })),
    ];

    const constat = this.constatRepo.create({
      ...rest,
      driverAId,
      driverBId,
      constatVehicles,
      circumstances,
      damages,
      observations,
      signatures,
    });

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
