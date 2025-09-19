import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateDamageInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  description: string;
}
