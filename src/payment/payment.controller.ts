import { Controller, Get, Query } from '@nestjs/common';
import { PaymentHttpService } from './payment-http.service';

@Controller('payments')
export class PaymentController {
  constructor() {}
  @Get('callback')
  handlePaymentCallback() {
    // Logic to handle payment callback
  }
}
