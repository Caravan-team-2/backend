import { Module } from '@nestjs/common';
import { UserInsurranceService } from './user_insurrance.service';
import { UserInsurranceResolver } from './user_insurrance.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInsurance } from './entities/user-insurance.entity';
import { Vehicle } from 'src/user/entities/vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserInsurance, Vehicle])],
  providers: [UserInsurranceResolver, UserInsurranceService],
})
export class UserInsurranceModule {}
