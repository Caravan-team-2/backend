import { Resolver } from '@nestjs/graphql';
import { SignatureService } from './signature.service';

@Resolver()
export class SignatureResolver {
  constructor(private readonly signatureService: SignatureService) {}
}
