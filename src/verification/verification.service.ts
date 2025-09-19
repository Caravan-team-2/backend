import { HttpService } from '@nestjs/axios';
import { ConflictException, Injectable } from '@nestjs/common';
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
  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepo: Repository<Attachment>,
    private readonly httpService: HttpService,
    private readonly userService: UserService,
  ) {}
  async findOne(documentId: string) {
    return await this.attachmentRepo.findOneByOrFail({ id: documentId });
  }
  async verifyIdentityDocument(documentId: string, userId: string) {
    const attachment = await this.findOne(documentId);
    const url = 'https://6e0429bfcd42.ngrok-free.app/ocr/extract'; //NOTE: chgange it later
    const res = await this.httpService.axiosRef.post<AiRes>(url, {
      url: attachment.url,
    });

    const { is_verified, ...userData } = res.data;
    if (is_verified) {
      await this.userService.markUserAsVerified(userId, userData);
    }
    throw new ConflictException('problem in validation try again');
  }
}
