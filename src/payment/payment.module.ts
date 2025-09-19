import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentResolver } from './payment.resolver';
import { PaymentController } from './payment.controller';
import { PaymentHttpService } from './payment-http.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://epay.guiddini.dz',
      headers: {
        'Content-Type': 'application/json',
        'x-app-key': 'apiKeyHere',
        'x-app-secret': 'apiSecretHere',
      },
    }),
  ],
  providers: [PaymentResolver, PaymentService, PaymentHttpService],
  controllers: [PaymentController],
})
export class PaymentModule {}
