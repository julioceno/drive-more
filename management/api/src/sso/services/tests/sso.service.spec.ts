import { Test, TestingModule } from '@nestjs/testing';
import { SsoService } from '../sso.service';
import { VerifyTokenDto } from '../verify-token/dto/verify-token.dto';
import { handleModuleDependencies, mockVerifyTokenService } from '@/utils';

describe('SsoService', () => {
  let service: SsoService;

  const token = 'mock.token';

  const dto: VerifyTokenDto = { token };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SsoService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    service = module.get<SsoService>(SsoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should invoke verifyToken method', async () => {
    await service.verifyToken(dto);

    expect(mockVerifyTokenService.run).toHaveBeenCalledWith({ token });
  });
});
