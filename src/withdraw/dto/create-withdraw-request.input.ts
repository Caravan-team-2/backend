
import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsUUID } from 'class-validator';

@InputType()
export class CreateWithdrawRequestInput {
  @Field()
  @IsNumber()
  amount: number;
}
