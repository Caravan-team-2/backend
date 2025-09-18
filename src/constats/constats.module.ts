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
  ],
  providers: [ConstatsResolver, ConstatsService],
})
export class ConstatsModule {}
