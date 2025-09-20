import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ConstatPaymentDto {
  @Field()
  constatId: string;

  @Field()
  language: 'ER' | 'EN' | 'FR';
}