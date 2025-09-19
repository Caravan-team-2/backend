import { Test, TestingModule } from '@nestjs/testing';
import { PdfGeneratorResolver } from './pdf-generator.resolver';
import { PdfGeneratorService } from './pdf-generator.service';

describe('PdfGeneratorResolver', () => {
  let resolver: PdfGeneratorResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PdfGeneratorResolver, PdfGeneratorService],
    }).compile();

    resolver = module.get<PdfGeneratorResolver>(PdfGeneratorResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
