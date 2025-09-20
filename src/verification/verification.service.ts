import { HttpService } from '@nestjs/axios';
import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { isAxiosError } from '@nestjs/terminus/dist/utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Attachment } from 'src/constats/entities/attachment.entity';
import { KycDetails } from 'src/user/entities/kyc-details.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

class AiRes extends KycDetails {
  is_verified: boolean;
}

@Injectable()
export class VerificationService {
  logger = new Logger(VerificationService.name);
  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepo: Repository<Attachment>,
    private readonly httpService: HttpService,
    private readonly userService: UserService,
  ) {}
  async findOne(documentId: string) {
    return await this.attachmentRepo.findOneByOrFail({ id: documentId });
  }
  async isUserVerified(userId: string) {
    const userVerification = await this.userService.getUserVerification(userId);
    if (!userVerification) {
      throw new ConflictException('User verification not found');
    }
    return userVerification?.isKycVerified;
  }
  async verifyIdentityDocument(documentId: string, userId: string) {
    try {
      const attachment = await this.findOne(documentId);
      if (!attachment) {
        throw new ConflictException('Document not found');
      }
      if (!attachment.url) {
        throw new ConflictException('Document url not found');
      }
      const url = 'ocr/extract'; //NOTE: chgange it later

      const res = await this.httpService.axiosRef.get<AiRes>(url, {
        params: { image_url: attachment.url },
      });

      const { is_verified, ...userData } = res.data;
      if (is_verified) {
        await this.userService.markUserAsVerified(userId, userData);
        return { isVerified: is_verified, ...userData };
      }
      throw new ConflictException('Document not verified');
    } catch (error) {
      if (isAxiosError(error)) {
        this.logger.error(`Axios error details: ${JSON.stringify(error)}`);

        throw new ConflictException('problem in validation try again');
      }
      throw error;
    }
  }
}
