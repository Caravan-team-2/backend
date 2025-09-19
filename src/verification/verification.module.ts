import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationResolver } from './verification.resolver';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attachment } from 'src/constats/entities/attachment.entity';
import { UserModule } from 'src/user/user.module';
import { CloudinaryModuleWrapper } from 'src/cloudinary/cloudinary.module';
import { verificationGuard } from './guards/verification.guard';
import { ConfigType } from '@nestjs/config';
import aiConfig from 'src/config/ai.config';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: (configs: ConfigType<typeof aiConfig>) => ({
        baseURL: configs.baseUrl,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${configs.ApiKey}`,
        },
      }),

      inject: [aiConfig.KEY],
    }),
    TypeOrmModule.forFeature([Attachment]),
    UserModule,
    CloudinaryModuleWrapper,
  ],
  providers: [VerificationResolver, VerificationService, verificationGuard],
  exports: [VerificationService],
})
export class VerificationModule {}
