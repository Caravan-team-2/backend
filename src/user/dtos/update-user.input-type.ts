import { Field, InputType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@InputType()
export class UpdateUserInputType {
  @Field({ nullable: true })
  username: string;
  @Field({ nullable: true })
  phoneNumber: string
  @Field({ nullable: true })
  job: string;
}

