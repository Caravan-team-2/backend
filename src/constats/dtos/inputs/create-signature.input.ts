import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SignatureType } from 'src/signature/entities/signature.entity';

@InputType()
export class CreateSignatureInput {
  @Field(() => SignatureType)
  @IsNotEmpty()
  @IsEnum(SignatureType)
  signatureType: SignatureType;

  @Field()
  @IsNotEmpty()
  @IsString()
  signatureData: string;
}
