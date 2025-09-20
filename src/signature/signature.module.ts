import { Module } from '@nestjs/common';
import { SignatureService } from './signature.service';
import { SignatureResolver } from './signature.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Signature } from './entities/signature.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Signature])],
  providers: [SignatureResolver, SignatureService],
  exports: [SignatureService],
})
export class SignatureModule {}
