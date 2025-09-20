import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UserInsurranceService } from './user_insurrance.service';
import { UpdateUserInsurranceInput } from './dto/update-user_insurrance.input';
import { UseGuards } from '@nestjs/common';
import { SuperAdminGuard } from 'src/authentication/guards/super-admin.guard';
import { USER } from 'src/authentication/decorators/user.decorator';
import { UserInsurance } from './entities/user-insurance.entity';
import { Vehicle } from 'src/user/entities/vehicle.entity';
import { AcessTokenGuard } from 'src/authentication/guards/access-token.guard';

@UseGuards(AcessTokenGuard)
@Resolver(() => UserInsurance)
export class UserInsurranceResolver {
  constructor(private readonly userInsurranceService: UserInsurranceService) {}

  /* TODO:leave till intergation
   *@Mutation(() => UserInsurance)
  createUserInsurrance(
    @Args('createUserInsurranceInput')
    createUserInsurranceInput: CreateUserInsurranceInput,
  ) {
    return this.userInsurranceService.create(createUserInsurranceInput);
  }

 
   * */
  @UseGuards(SuperAdminGuard)
  @Query(() => [UserInsurance], { name: 'usersInsurrances' })
  findAll() {
    return this.userInsurranceService.findAll();
  }
  @Query(() => [UserInsurance], { name: 'userInsurrances' })
  findUserInsurrance(@USER('id') userId: string) {
    return this.userInsurranceService.findUserInsurrance(userId);
  }

  @Mutation(() => UserInsurance)
  updateUserInsurrance(
    @Args('updateUserInsurranceInput')
    updateUserInsurranceInput: UpdateUserInsurranceInput,
  ) {
    return this.userInsurranceService.update(
      updateUserInsurranceInput.id,
      updateUserInsurranceInput,
    );
  }
  @ResolveField(() => Vehicle)
  vehicle(@Parent() userInsurrance: UserInsurance) {
    return this.userInsurranceService.findInsurranceVehicule(userInsurrance.id);
  }

  // @Mutation(() => UserInsurance)
  // removeUserInsurrance(@Args('id', { type: () => Int }) id: number) {
  //   return this.userInsurranceService.remove(id);
  // }
}
