import { Test, TestingModule } from '@nestjs/testing';
import { InsurranceCompanyService } from './insurrance_company.service';

describe('InsurranceCompanyService', () => {
  let service: InsurranceCompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InsurranceCompanyService],
    }).compile();

    service = module.get<InsurranceCompanyService>(InsurranceCompanyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
