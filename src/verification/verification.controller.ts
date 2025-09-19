import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { USER } from 'src/authentication/decorators/user.decorator';
import { ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { VerifyIdentityDto } from './dtos/verification-body.dto';

@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @ApiCreatedResponse({ description: 'verify ur identity with ai' })
  @ApiBody({ type: VerifyIdentityDto })
  @HttpCode(HttpStatus.CREATED)
  @Post(':/verify')
  verify(@Body('documentId') documentId: string, @USER('id') userId: string) {
    this.verificationService.verifyIdentityDocument(documentId, userId);
  }
}
