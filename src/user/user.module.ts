import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { KycDetails } from './entities/kyc-details.entity';
import { Vehicle } from './entities/vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, KycDetails, Vehicle])],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
