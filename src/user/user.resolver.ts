import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { USER } from 'src/authentication/decorators/user.decorator';
import { UseGuards } from '@nestjs/common';
import { AcessTokenGuard } from 'src/authentication/guards/access-token.guard';
import { UpdateUserInputType } from './dtos/update-user.input-type';
import { KycDetails } from './entities/kyc-details.entity';
import { UserInsurance } from 'src/user_insurrance/entities/user-insurance.entity';

@UseGuards(AcessTokenGuard)
@Resolver(User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}
  @Query(() => User)
  me(@USER('id') id: string) {
    return this.userService.findById(id);
  }
  @Mutation(() => User)
  updateMe(
    @USER('id') id: string,
    @Args('user', { type: () => UpdateUserInputType })
    userData: UpdateUserInputType,
  ) {
    return this.userService.updateUser(userData, id);
  }

  @Mutation(() => Boolean)
  deleteMe(@USER('id') id: string) {
    return this.userService.deleteUser(id);
  }
  @ResolveField(() => KycDetails)
  kycDetails(@Parent() user: User) {
    return this.userService.findUserKycDetails(user.id);
  }
  @ResolveField(() => Array<UserInsurance>)
  insurances(@Parent() user: User) {
    return this.userService.getUserInsurances(user.id);
  }
  }
