import { Test, TestingModule } from '@nestjs/testing';
import { ConstatsResolver } from './constats.resolver';
import { ConstatsService } from './constats.service';

describe('ConstatsResolver', () => {
  let resolver: ConstatsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConstatsResolver, ConstatsService],
    }).compile();

    resolver = module.get<ConstatsResolver>(ConstatsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
