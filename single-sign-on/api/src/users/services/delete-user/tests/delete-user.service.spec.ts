import {
  handleModuleDependencies,
  mockPrismaService,
  mockSystemHistoryProxyService,
} from '@/utils';
import { DeleteUserService } from '../delete-user.service';
import { TestingModule, Test } from '@nestjs/testing';
import { UserEntity } from '@/users/entities/user.entity';
import { ActionEnum } from '@/system-history/interface/system-history.interface';
import { Resources } from '@/common';

describe('DeleteUserService', () => {
  let service: DeleteUserService;

  const id = 'mock.id';
  const creatorEmail = 'mock.creatorEmail';
  const email = 'mock.email';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeleteUserService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    service = module.get<DeleteUserService>(DeleteUserService);

    mockPrismaService.user.delete.mockResolvedValue({
      email,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should invoke prismaService and call delete from user', async () => {
    await service.run(id, creatorEmail);

    expect(mockPrismaService.user.delete).toHaveBeenLastCalledWith({
      where: {
        id: 'mock.id',
      },
    });
  });

  it('should return entity deleted in instance of UserEntity', async () => {
    const response = await service.run(id, creatorEmail);

    expect(response).toBeDefined();
    expect(response).toBeInstanceOf(UserEntity);
  });

  it('should invoke SystemHistoryProxyService and call createRecordStandard method', async () => {
    await service.run(id, creatorEmail);

    expect(
      mockSystemHistoryProxyService.createRecordStandard,
    ).toHaveBeenLastCalledWith(
      creatorEmail,
      ActionEnum.DELETE,
      { email },
      Resources.USER,
    );
  });
});
