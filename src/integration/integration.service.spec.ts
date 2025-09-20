import { Test, TestingModule } from '@nestjs/testing';
import { IntegrationService } from './integration.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Integration } from './entities/integration.entity';
import { Repository } from 'typeorm';

describe('IntegrationService', () => {
  let service: IntegrationService;
  let repository: Repository<Integration>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IntegrationService,
        {
          provide: getRepositoryToken(Integration),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<IntegrationService>(IntegrationService);
    repository = module.get<Repository<Integration>>(
      getRepositoryToken(Integration),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
