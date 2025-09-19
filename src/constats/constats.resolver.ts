import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Constat } from './entities/constat.entity';
import { ConstatsService } from './constats.service';
import { PaginatedConstats } from './dtos/outputs/constats.output';
import { PaginationInput } from 'src/common/dtos/paginationInput.dto';
import { USER } from 'src/authentication/decorators/user.decorator';
import { CreateConstatInput } from './dtos/inputs/create-constat.input';
import { ConstatStatusOutput } from './dtos/outputs/constat-status.output';

@Resolver(() => Constat)
export class ConstatsResolver {
  constructor(private readonly constatService: ConstatsService) {}

  @Query(() => PaginatedConstats, {
    description: 'Get all constats of the current user',
  })
  async getConstats(
    @Args('pagination', { type: () => PaginationInput })
    pagination: PaginationInput,
    @USER('id') userId: string,
  ): Promise<PaginatedConstats> {
    return this.constatService.getMany(pagination, userId);
  }

  @Mutation(() => Constat)
  async createConstat(
    @Args('createConstatInput') createConstatInput: CreateConstatInput,
    @USER('id') userId: string,
  ): Promise<Constat> {
    return this.constatService.create(createConstatInput, userId);
  }

  @Query(() => ConstatStatusOutput, {
    description: 'Check the status of a constat by vehicle IDs',
  })
  async checkStatusByVehicleIds(
    @Args('vehicleAId') vehicleAId: string,
    @Args('vehicleBId') vehicleBId: string,
  ): Promise<ConstatStatusOutput> {
    return this.constatService.checkStatusByVehicleIds(vehicleAId, vehicleBId);
  }
}
