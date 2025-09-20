import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import {
  WithdrawRequest,
  WithdrawStatus,
} from './entities/withdraw-request.entity';
import { CreateWithdrawRequestInput } from './dto/create-withdraw-request.input';

@Injectable()
export class WithdrawService {
  constructor(
    @InjectRepository(WithdrawRequest)
    private readonly withdrawRequestRepository: Repository<WithdrawRequest>,
    private readonly entityManager: EntityManager,
  ) {}

  async createWithdrawRequest(
    userId: string,
    input: CreateWithdrawRequestInput,
  ): Promise<WithdrawRequest> {
    return this.entityManager.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.balance < input.amount) {
        throw new BadRequestException('Insufficient balance');
      }

      user.balance -= input.amount;
      await manager.save(user);

      const withdrawRequest = this.withdrawRequestRepository.create({
        ...input,
        userId,
        status: WithdrawStatus.PENDING,
      });

      return manager.save(withdrawRequest);
    });
  }

  async approveWithdrawRequest(id: string): Promise<WithdrawRequest> {
    const withdrawRequest = await this.withdrawRequestRepository.findOne({
      where: { id },
    });
    if (!withdrawRequest) {
      throw new NotFoundException('Withdraw request not found');
    }

    withdrawRequest.status = WithdrawStatus.APPROVED;
    return this.withdrawRequestRepository.save(withdrawRequest);
  }

  async rejectWithdrawRequest(id: string): Promise<WithdrawRequest> {
    return this.entityManager.transaction(async (manager) => {
      const withdrawRequest = await manager.findOne(WithdrawRequest, {
        where: { id },
      });
      if (!withdrawRequest) {
        throw new NotFoundException('Withdraw request not found');
      }

      const user = await manager.findOne(User, {
        where: { id: withdrawRequest.userId },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      user.balance += withdrawRequest.amount;
      await manager.save(user);

      withdrawRequest.status = WithdrawStatus.REJECTED;
      return manager.save(withdrawRequest);
    });
  }

  async getUserWithdrawRequests(userId: string): Promise<WithdrawRequest[]> {
    return this.withdrawRequestRepository.find({ where: { userId } });
  }
}
