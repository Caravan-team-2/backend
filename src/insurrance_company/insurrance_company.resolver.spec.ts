import { Test, TestingModule } from '@nestjs/testing';
import { InsurranceCompanyResolver } from './insurrance_company.resolver';
import { InsurranceCompanyService } from './insurrance_company.service';

describe('InsurranceCompanyResolver', () => {
  let resolver: InsurranceCompanyResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InsurranceCompanyResolver, InsurranceCompanyService],
    }).compile();

    resolver = module.get<InsurranceCompanyResolver>(InsurranceCompanyResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
