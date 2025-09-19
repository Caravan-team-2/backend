import { Test, TestingModule } from '@nestjs/testing';
import { ConstatsGateway } from './constats.gateway';

describe('ConstatsGateway', () => {
  let gateway: ConstatsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConstatsGateway],
    }).compile();

    gateway = module.get<ConstatsGateway>(ConstatsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
