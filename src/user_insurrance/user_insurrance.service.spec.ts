import { Test, TestingModule } from '@nestjs/testing';
import { UserInsurranceService } from './user_insurrance.service';

describe('UserInsurranceService', () => {
  let service: UserInsurranceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserInsurranceService],
    }).compile();

    service = module.get<UserInsurranceService>(UserInsurranceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
