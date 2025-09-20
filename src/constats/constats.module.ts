import { Module } from '@nestjs/common';
import { ConstatsService } from './constats.service';
import { ConstatsResolver } from './constats.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Constat } from './entities/constat.entity';
import { ConstatVehicle } from './entities/constat-vehicle.entity';
import { Circumstance } from './entities/circumstance.entity';
import { Damage } from './entities/damage.entity';
import { Observation } from './entities/observation.entity';
import { Attachment } from './entities/attachment.entity';
import { ConstatGateway } from './constats.gateway';
import { ConstatGatewayDocsController } from './constats.controller';
import { User } from 'src/user/entities/user.entity';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Constat,
      ConstatVehicle,
      Circumstance,
      Damage,
      Observation,
      Attachment,
      User,
    ]),
    PaymentModule,
  ],
  providers: [ConstatsResolver, ConstatsService, ConstatGateway],
  controllers: [ConstatGatewayDocsController],
})
export class ConstatsModule {}
