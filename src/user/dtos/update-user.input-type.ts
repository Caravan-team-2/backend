import { InputType, OmitType, PartialType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@InputType()
export class UpdateUserInputType extends PickType(User, [
  'username',
  'phoneNumber',
  'job',
]) {}
