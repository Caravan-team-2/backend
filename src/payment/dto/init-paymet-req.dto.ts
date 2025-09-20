import { Field, InputType, registerEnumType } from '@nestjs/graphql';

const languageType = {
  ER: 'ER',
  EN: 'EN',
  FR: 'FR',
};

registerEnumType(languageType, {
  name: 'languageType',
  description: 'language enum',
});

@InputType()
export class InitPaymentReqDto {
  @Field()
  amount: string;

  @Field(() => languageType)
  language: 'ER' | 'EN' | 'FR';
}
