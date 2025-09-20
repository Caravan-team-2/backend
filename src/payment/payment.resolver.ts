import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PaymentService } from './payment.service';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { AcessTokenGuard } from 'src/authentication/guards/access-token.guard';
import { USER } from 'src/authentication/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { InitPaymentReqDto } from './dto/init-paymet-req.dto';
import { Transaction } from './entities/payment.entity';
import { IdempotencyInterceptor } from 'src/common/interceptors/idempotency.interceptor';

@UseGuards(AcessTokenGuard)
@UseInterceptors(IdempotencyInterceptor)
@Resolver()
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(AcessTokenGuard)
  @UseInterceptors(IdempotencyInterceptor)
  @Mutation(() => Transaction)
  initiatePayment(@USER() user: User, @Args('input') input: InitPaymentReqDto) {
    return this.paymentService.initiatePayment(user.id, input);
  }
}
