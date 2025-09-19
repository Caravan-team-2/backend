import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { ConstatStatus } from 'src/constats/entities/constat.entity';

registerEnumType(ConstatStatus, { name: 'ConstatStatus' });

@ObjectType()
export class ConstatStatusOutput {
  @Field(() => ConstatStatus)
  status: ConstatStatus;

  @Field({ nullable: true })
  message?: string;
}
