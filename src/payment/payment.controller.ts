import {
  Controller,
  Get,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PaymentService } from './payment.service';
import { Response } from 'express';
import { IdempotencyInterceptor } from 'src/common/interceptors/idempotency.interceptor';
import { AcessTokenGuard } from 'src/authentication/guards/access-token.guard';
import paymentConfig from 'src/config/payment.config';
@UseInterceptors(IdempotencyInterceptor)
@UseGuards(AcessTokenGuard)
@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    @paymentConfig.KEY
    private readonly paymentConf: ConfigType<typeof paymentConfig>,
  ) {}
  @Get('callback')
  async handlePaymentCallback(
    @Query('order_number') orderNumber: string,
    @Res() res: Response,
  ) {
    try {
      await this.paymentService.handlePaymentCallback(orderNumber);
      // Redirect the user to a success page on the frontend
      res.redirect(this.paymentConf.redirect.successUrl);
    } catch (error) {
      // Redirect the user to a failure page on the frontend
      res.redirect(this.paymentConf.redirect.failureUrl);
    }
  }
}
