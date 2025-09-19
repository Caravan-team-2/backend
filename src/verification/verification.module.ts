import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationResolver } from './verification.resolver';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attachment } from 'src/constats/entities/attachment.entity';
import { UserModule } from 'src/user/user.module';
import { CloudinaryModuleWrapper } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      baseURL: 'https://6e0429bfcd42.ngrok-free.app/',
    }),
    TypeOrmModule.forFeature([Attachment]),
    UserModule,
    CloudinaryModuleWrapper,
  ],
  providers: [VerificationResolver, VerificationService],
})
export class VerificationModule {}
