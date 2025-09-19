import { Args, Query, Resolver } from '@nestjs/graphql';
import { Constat } from './entities/constat.entity';
import { ConstatsService } from './constats.service';
import { PaginatedConstats } from './dtos/outputs/constats.output';
import { PaginationInput } from 'src/common/dtos/paginationInput.dto';
import { USER } from 'src/authentication/decorators/user.decorator';

@Resolver(() => Constat)
export class ConstatResolver {
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
}
