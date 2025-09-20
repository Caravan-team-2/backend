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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Constat,
      ConstatVehicle,
      Circumstance,
      Damage,
      Observation,
      Attachment,
    ]),
    SignatureModule,
  ],
  providers: [ConstatsResolver, ConstatsService, ConstatGateway],
})
export class ConstatsModule {}
