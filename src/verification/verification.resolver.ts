import { Resolver } from '@nestjs/graphql';
import { VerificationService } from './verification.service';

@Resolver()
export class VerificationResolver {
  constructor(private readonly verificationService: VerificationService) {}
}
