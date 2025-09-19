import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInsurranceInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
