
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WithdrawRequest } from './entities/withdraw-request.entity';
import { WithdrawService } from './withdraw.service';
import { WithdrawResolver } from './withdraw.resolver';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WithdrawRequest, User])],
  providers: [WithdrawService, WithdrawResolver],
})
export class WithdrawModule {}
