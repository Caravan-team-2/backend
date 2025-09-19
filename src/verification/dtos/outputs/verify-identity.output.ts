import { ObjectType, Field } from '@nestjs/graphql';
import { KycDetails } from 'src/user/entities/kyc-details.entity';

@ObjectType()
export class VerifyIdentityOutput extends KycDetails {
  @Field(() => Boolean)
  isVerified: boolean;
}
