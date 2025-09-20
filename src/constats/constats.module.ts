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
import { SignatureModule } from 'src/signature/signature.module';
import { ConstatGatewayDocsController } from './constats.controller';
import { User } from 'src/user/entities/user.entity';
import { PaymentModule } from 'src/payment/payment.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

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
    SignatureModule,
    PaymentModule,
    ClientsModule.register([
      {
        name: 'CONSTAT_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'constat_service',
            brokers: ['kafka:9092'],
          },
          producer: {
            // Topics will be created on configurations to ensure controll over them
            allowAutoTopicCreation: false,
          },
        },
      },
    ]),
  ],
  providers: [ConstatsResolver, ConstatsService, ConstatGateway],
  controllers: [ConstatGatewayDocsController],
})
export class ConstatsModule {}
