import { Test, TestingModule } from '@nestjs/testing';
import { ConstatsService } from './constats.service';

describe('ConstatsService', () => {
  let service: ConstatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConstatsService],
    }).compile();

    service = module.get<ConstatsService>(ConstatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
