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

    mockVerifyTokenService.run.mockResolvedValue({
      id: 'mock.id',
      role: 'mock.role',
      clientId: 'mock.clientId',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should invoke verifyToken method and return user', async () => {
    const response = await service.verifyToken(dto);

    expect(response).toBeDefined();
    expect(response).toStrictEqual({
      clientId: 'mock.clientId',
      id: 'mock.id',
      role: 'mock.role',
    });
    expect(mockVerifyTokenService.run).toHaveBeenCalledWith({ token });
  });
});
