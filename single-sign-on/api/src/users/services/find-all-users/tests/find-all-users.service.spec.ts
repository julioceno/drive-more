import { Test, TestingModule } from '@nestjs/testing';
import { FindAllUsersService } from '../find-all-users.service';
import { handleModuleDependencies, mockPrismaService } from '@/utils';
import { FindAllUsersDto } from '../dto/find-all-users.dto';
import { FindListEntity } from '@/common/entities/find-list.entity';
import { UserEntity } from '@/users/entities/user.entity';

describe('FindAllUsersService', () => {
  let service: FindAllUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindAllUsersService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    service = module.get<FindAllUsersService>(FindAllUsersService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return list instance of FindListEntity and items list instance of UserEntity', async () => {
    const dto: FindAllUsersDto = {};

    mockPrismaService.user.findMany.mockResolvedValue([
      { id: '83510e64-7001-4928-8db6-741870283f96' },
    ]);

    const response = await service.run(dto);

    expect(response).toBeInstanceOf(FindListEntity);

    response.list.map((item) => {
      expect(item).toBeInstanceOf(UserEntity);
    });
  });

  it('should invoke prismaService and call findMany and count from user', async () => {
    const dto: FindAllUsersDto = {};

    await service.run(dto);

    const select = {
      orderBy: { createdAt: 'desc' },
      skip: undefined,
      take: undefined,
      where: {
        email: { contains: undefined, mode: 'insensitive' },
        name: { contains: undefined, mode: 'insensitive' },
      },
    };

    expect(mockPrismaService.user.findMany).toHaveBeenLastCalledWith(select);
    expect(mockPrismaService.user.count).toHaveBeenLastCalledWith(select);
  });
});
