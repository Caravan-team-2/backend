import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateSignatureInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  constatId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  visualSignature: string;
}
