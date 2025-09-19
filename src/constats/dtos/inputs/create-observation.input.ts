import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateObservationInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  note: string;
}
