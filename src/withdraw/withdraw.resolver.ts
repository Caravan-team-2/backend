
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { WithdrawService } from './withdraw.service';
import { WithdrawRequest } from './entities/withdraw-request.entity';
import { CreateWithdrawRequestInput } from './dto/create-withdraw-request.input';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { AcessTokenGuard } from 'src/authentication/guards/access-token.guard';
import { User } from 'src/user/entities/user.entity';
import { USER } from 'src/authentication/decorators/user.decorator';
import { IdempotencyInterceptor } from 'src/common/interceptors/idempotency.interceptor';

@UseInterceptors(IdempotencyInterceptor)
@UseGuards(AcessTokenGuard)
@Resolver(() => WithdrawRequest)
export class WithdrawResolver {
  constructor(private readonly withdrawService: WithdrawService) {}

  @UseGuards(AcessTokenGuard)
  @Mutation(() => WithdrawRequest)
  createWithdrawRequest(
    @USER() user: User,
    @Args('input') input: CreateWithdrawRequestInput,
  ) {
    return this.withdrawService.createWithdrawRequest(user.id, input);
  }

  @UseGuards(AcessTokenGuard)
  @Query(() => [WithdrawRequest])
  getUserWithdrawRequests(@USER() user: User) {
    return this.withdrawService.getUserWithdrawRequests(user.id);
  }
}
