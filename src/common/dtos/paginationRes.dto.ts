import { Type } from '@nestjs/common';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class PaginationMeta {
  @Field(() => Int, { description: 'Total number of items' })
  total: number;

  @Field(() => Int, { description: 'Current page number' })
  page: number;

  @Field(() => Int, { description: 'Number of items per page' })
  limit: number;

  @Field(() => Int, { description: 'Total number of pages' })
  totalPages: number;
}

@ObjectType({ isAbstract: true })
export abstract class PaginatedRes {
  @Field(() => PaginationMeta, { description: 'Pagination metadata' })
  meta: PaginationMeta;

  constructor(total: number, page: number, limit: number) {
    this.meta = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export function WithPaginatedItems<T>(classRef: Type<T>) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedWithItems extends PaginatedRes {
    @Field(() => [classRef], { description: 'List of items' })
    data: T[];

    constructor(data: T[], total: number, page: number, limit: number) {
      super(total, page, limit);
      this.data = data;
    }
  }
  return PaginatedWithItems;
}
