import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { PaymentService } from './payment.service';
import { PaymentResolver } from './payment.resolver';
import { PaymentController } from './payment.controller';
import { PaymentHttpService } from './payment-http.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Transaction } from './entities/payment.entity';
import { Constat } from 'src/constats/entities/constat.entity';
import paymentConfig from 'src/config/payment.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, User, Constat]),
    ConfigModule.forFeature(paymentConfig),
    HttpModule.registerAsync({
      imports: [ConfigModule.forFeature(paymentConfig)],
      useFactory: (paymentConf: ConfigType<typeof paymentConfig>) => ({
        baseURL: paymentConf.gateway.baseURL,
        headers: {
          'Content-Type': 'application/json',
          'x-app-key': paymentConf.gateway.apiKey,
          'x-app-secret': paymentConf.gateway.apiSecret,
        },
      }),
      inject: [paymentConfig.KEY],
    }),
  ],
  providers: [PaymentResolver, PaymentService, PaymentHttpService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
