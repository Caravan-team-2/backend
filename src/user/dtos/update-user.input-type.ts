import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInputType {
  @Field({ nullable: true })
  phoneNumber: string;
  @Field({ nullable: true })
  job: string;
}
