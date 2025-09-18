import { Resolver } from '@nestjs/graphql';
import { ConstatsService } from './constats.service';

@Resolver()
export class ConstatsResolver {
  constructor(private readonly constatsService: ConstatsService) {}
}
