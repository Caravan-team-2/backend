import { Test, TestingModule } from '@nestjs/testing';
import { UserInsurranceResolver } from './user_insurrance.resolver';
import { UserInsurranceService } from './user_insurrance.service';

describe('UserInsurranceResolver', () => {
  let resolver: UserInsurranceResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserInsurranceResolver, UserInsurranceService],
    }).compile();

    resolver = module.get<UserInsurranceResolver>(UserInsurranceResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
