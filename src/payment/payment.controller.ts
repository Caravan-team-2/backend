import {
  Controller,
  Get,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Response } from 'express';
import { IdempotencyInterceptor } from 'src/common/interceptors/idempotency.interceptor';
import { AcessTokenGuard } from 'src/authentication/guards/access-token.guard';
@UseInterceptors(IdempotencyInterceptor)
@UseGuards(AcessTokenGuard)
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  @Get('callback')
  async handlePaymentCallback(
    @Query('order_number') orderNumber: string,
    @Res() res: Response,
  ) {
    try {
      await this.paymentService.handlePaymentCallback(orderNumber);
      // TODO :get this from the config url
      // Redirect the user to a success page on the frontend
      res.redirect('https://your-frontend-app.com/payment-success');
    } catch (error) {
      // Redirect the user to a failure page on the frontend
      res.redirect('https://your-frontend-app.com/payment-failure');
    }
  }
}
