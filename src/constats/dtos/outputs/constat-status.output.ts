import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';

export enum ConstatStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

registerEnumType(ConstatStatus, { name: 'ConstatStatus' });

@ObjectType()
export class ConstatStatusOutput {
  @Field(() => ConstatStatus)
  status: ConstatStatus;

  @Field({ nullable: true })
  message?: string;
}
