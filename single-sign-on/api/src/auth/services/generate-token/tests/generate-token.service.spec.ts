import { handleModuleDependencies } from '@/utils';
import { Test, TestingModule } from '@nestjs/testing';
import { GenerateTokenService } from '../generate-token.service';
import { mockJwtService } from '@/utils/mocks/services/jwt';
import { IAuthorizedUser, RoleEnum } from '@/common';

describe('GenerateTokenService', () => {
  let service: GenerateTokenService;

  const payload: IAuthorizedUser = {
    id: 'mock.id',
    name: 'mock.name',
    email: 'mock.email',
    role: RoleEnum.ADMIN,
    clientId: 'mock.clientId',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenerateTokenService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    service = module.get<GenerateTokenService>(GenerateTokenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call jwtService and invoke signAsync', async () => {
    await service.run(payload);
    expect(mockJwtService.signAsync).toHaveBeenCalledWith(payload);
  });
});
