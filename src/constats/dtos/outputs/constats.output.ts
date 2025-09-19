import { ObjectType } from '@nestjs/graphql';
import { WithPaginatedItems } from 'src/common/dtos/paginationRes.dto';
import { Constat } from 'src/constats/entities/constat.entity';

@ObjectType()
export class PaginatedConstats extends WithPaginatedItems(Constat) {
  constructor(data: Constat[], total: number, page: number, limit: number) {
    super(data, total, page, limit);
  }
}
