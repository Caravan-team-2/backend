import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attachment } from 'src/constats/entities/attachment.entity';
import { Repository } from 'typeorm';

interface AiRes {
  is_verified: boolean;
}

@Injectable()
export class VerificationService {
  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepo: Repository<Attachment>,
    private readonly httpService: HttpService,
  ) {}
  async findOne(documentId: string) {
    return await this.attachmentRepo.findOneByOrFail({ id: documentId });
  }
  async verifyIdentityDocument(documentId: string) {
    const attachment = await this.findOne(documentId);
    const url = '';
    const res = await this.httpService.axiosRef.post<AiRes>(url, {
      url: attachment.url,
    });

    const { is_verified } = res.data;
    if (is_verified) {
    }
  }
}
