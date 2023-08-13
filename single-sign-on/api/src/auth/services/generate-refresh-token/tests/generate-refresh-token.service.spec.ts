import { handleModuleDependencies, mockPrismaService } from '@/utils';
import { Test, TestingModule } from '@nestjs/testing';
import { GenerateRefreshTokenService } from '../generate-refresh-token.service';
import { mockConfigService } from '@/utils/mocks/services/config';
import { addSeconds, getUnixTime } from 'date-fns';

describe('GenerateRefreshTokenService', () => {
  let service: GenerateRefreshTokenService;

  const userId = 'mock.id';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenerateRefreshTokenService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    service = module.get<GenerateRefreshTokenService>(
      GenerateRefreshTokenService,
    );

    mockConfigService.get.mockReturnValue(900);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call prismaService and invoke deleteMany from refreshToken', async () => {
    await service.run(userId);

    expect(mockPrismaService.refreshToken.deleteMany).toHaveBeenCalledWith({
      where: { userId },
    });
  });

  it('should call configService and invoke get method', async () => {
    await service.run(userId);

    expect(mockConfigService.get).toHaveBeenCalledWith(
      'refreshToken.expiration',
    );
  });

  it('should call prismaService and invoke create from refreshToken with correctaly expiresIn', async () => {
    await service.run(userId);

    expect(mockPrismaService.refreshToken.create).toHaveBeenCalledWith({
      data: { userId, expiresIn: getUnixTime(addSeconds(new Date(), 900)) },
    });
  });
});
