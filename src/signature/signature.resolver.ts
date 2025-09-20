import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { SignatureService } from './signature.service';
import { Signature } from './entities/signature.entity';
import { CreateSignatureInput } from './dtos/create-signature.dto';

@Resolver(() => Signature)
export class SignatureResolver {
  constructor(private readonly signatureService: SignatureService) {}

  @Mutation(() => Signature)
  async createSignature(
    @Args('input') input: CreateSignatureInput,
  ): Promise<Signature> {
    return this.signatureService.create(input);
  }

  @Query(() => Signature, { name: 'signature' })
  async getSignatureById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Signature> {
    return this.signatureService.getSignatureById(id);
  }

  @Query(() => [Signature], { name: 'signaturesByUser' })
  async getSignatureByUser(
    @Args('driverId') driverId: string,
  ): Promise<Signature[]> {
    return this.signatureService.getSignatureByUser(driverId);
  }
}
