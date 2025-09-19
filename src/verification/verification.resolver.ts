import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { VerificationService } from './verification.service';
import { VerifyIdentityOutput } from './dtos/outputs/verify-identity.output';
import { VerifyIdentityInput } from './inputs/verify-identity';
import { USER } from 'src/authentication/decorators/user.decorator';

@Resolver()
export class VerificationResolver {
  constructor(private readonly verificationService: VerificationService) {}

  @Mutation(() => VerifyIdentityOutput, {
    description: 'Verify identity document using AI (OCR + KYC).',
  })
  async verifyIdentity(
    @Args('input') input: VerifyIdentityInput,
    @USER('id') userId: string,
  ): Promise<VerifyIdentityOutput> {
    return this.verificationService.verifyIdentityDocument(
      input.documentId,
      userId,
    );
  }
}
