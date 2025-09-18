import { Test, TestingModule } from '@nestjs/testing';
import { SignatureResolver } from './signature.resolver';
import { SignatureService } from './signature.service';

describe('SignatureResolver', () => {
  let resolver: SignatureResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignatureResolver, SignatureService],
    }).compile();

    resolver = module.get<SignatureResolver>(SignatureResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
