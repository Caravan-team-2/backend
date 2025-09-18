import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { KycDetails } from './entities/kyc-details.entity';
import { Vehicle } from './entities/vehicle.entity';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { UpdateUserInputType } from './dtos/update-user.input-type';
import { UserInsurance } from 'src/insurrance_company/entities/user-insurance.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, KycDetails, Vehicle,UserInsurance]),
    forwardRef(() => AuthenticationModule),
  ],
  providers: [UserService, UserResolver,UpdateUserInputType],
  exports: [UserService],
})
export class UserModule {}
