import { CreateUserInsurranceInput } from './create-user_insurrance.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInsurranceInput extends PartialType(
  CreateUserInsurranceInput,
) {
  @Field(() => Int)
  id: number;
}
