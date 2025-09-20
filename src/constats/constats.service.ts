import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationInput } from 'src/common/dtos/paginationInput.dto';
import { Constat, ConstatStatus } from './entities/constat.entity';
import { DataSource, Repository } from 'typeorm';
import { PaginatedConstats } from './dtos/outputs/constats.output';
import { ConstatStatusOutput } from './dtos/outputs/constat-status.output';
import { ConstatSession } from './types/constat-session.type';
import { Signature } from 'src/signature/entities/signature.entity';
import { User } from 'src/user/entities/user.entity';
import { PaymentService } from 'src/payment/payment.service';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ConstatsService {
  constructor(
    @Inject('CONSTAT_SERVICE')
    private readonly constatClient: ClientProxy,
    @InjectRepository(Constat)
    private readonly constatRepo: Repository<Constat>,
    private readonly dataSource: DataSource,
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

  async finalizeFromSession(
    session: ConstatSession,
    isConsumed: boolean = false,
  ): Promise<Constat> {
    return await this.dataSource.transaction(async (manager) => {
      if (!session.driverBId) {
        throw new Error('Both drivers must be present to finalize constat');
      }

      if (!session.draft.signatures || session.draft.signatures.length === 0) {
        throw new Error('Signatures are required to finalize constat');
      }

      const requiredDrivers = [session.driverAId, session.driverBId];
      const signedDrivers = session.draft.signatures.map((sig) => sig.driverId);
      const allDriversSigned = requiredDrivers.every((driverId) =>
        signedDrivers.includes(driverId),
      );

      if (!allDriversSigned) {
        throw new Error('All drivers must sign before finalizing constat');
      }
      //TODO: we need to make sure that it links the users based on their nin if isConsumed flag is true
      const constat = manager.create(Constat, {
        driverAId: session.driverAId,
        driverBId: session.driverBId,
        dateTime: session.draft.dateTime
          ? new Date(session.draft.dateTime)
          : new Date(),
        location: session.draft.location ?? '',
        injuredCount: session.draft.injuredCount ?? 0,
        isPaid: false,
        status: ConstatStatus.SUBMITTED,
      });

      const savedConstat = await manager.save(constat);

      const signatureEntities = session.draft.signatures.map((signature) =>
        manager.create(Signature, {
          constatId: savedConstat.id,
          driverId: signature.driverId,
          signatureType: signature.signatureType,
          signatureData: signature.signatureData,
        }),
      );

      await manager.save(Signature, signatureEntities);
      if (!isConsumed) {
        const constats = await this.constatRepo.findOne({
          where: { driverAId: session.driverAId, driverBId: session.driverAId },

          relations: {
            constatVehicles: {
              insurer: {
                integration: true,
              },
            },
          },
        });
        if (!constats) {
          throw new NotFoundException('Constat not found');
        }
        // get the vehiclues and their insurance companies
        constat.constatVehicles.forEach((vehicles) => {
          const insuranceCompany = vehicles.insurer;
          //if the inssurance company has an integration send the constat to them
          if (insuranceCompany.integration) {
            const topic = `${insuranceCompany.integration.topic_prefix}.constat.created`;
            this.constatClient.emit(topic, {
              ...savedConstat,
            });
          }
        });
      }

      return savedConstat;
    });
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
