import { Test, TestingModule } from '@nestjs/testing';
import { VerifyTokenService } from '../verify-token.service';

describe('VerifyTokenService', () => {
  let service: VerifyTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VerifyTokenService],
    }).compile();

    service = module.get<VerifyTokenService>(VerifyTokenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
